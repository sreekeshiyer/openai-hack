// pages/add-lecture.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Layout from "@/components/Layout";
import {
    OPENAI_KEY,
    SUMMARY_PROMPT,
    QUIZ_PROMPT,
    FLASHCARD_PROMPT,
} from "@/config/index";
import Loader from "@/components/Loader";

export default function AddLecture() {
    const router = useRouter();
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [lectureTitle, setLectureTitle] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get("/api/subjects");
                setSubjects(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
        setLoading(false);
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("file", audioFile);
        formData.append("model", "whisper-1");

        try {
            const res = await axios.post(
                "https://api.openai.com/v1/audio/transcriptions",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${OPENAI_KEY}`,
                    },
                }
            );

            const text = res.data.text;

            const gptRes = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "user", content: `${SUMMARY_PROMPT} ${text}` },
                    ],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${OPENAI_KEY}`,
                    },
                }
            );

            const summarizedText = gptRes.data.choices[0].message.content
                .toString()
                .trimLeft();

            const quizRes = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "user",
                            content: `${QUIZ_PROMPT} ${summarizedText}`,
                        },
                    ],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${OPENAI_KEY}`,
                    },
                }
            );

            const quiz = JSON.parse(
                quizRes.data.choices[0].message.content.toString().trimLeft()
            );

            const flashCardRes = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "user",
                            content: `${FLASHCARD_PROMPT} ${summarizedText}`,
                        },
                    ],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${OPENAI_KEY}`,
                    },
                }
            );

            const flashcards = JSON.parse(
                flashCardRes.data.choices[0].message.content
                    .toString()
                    .trimLeft()
            );

            axios
                .put("/api/lectures/add", {
                    subjectName: selectedSubject,
                    newLecture: {
                        name: lectureTitle,
                        summary: summarizedText,
                        quiz: quiz,
                        flashcards: flashcards,
                    },
                })
                .then((response) => {
                    router.push("/");
                })
                .catch((error) => {
                    console.log(error);
                });

            router.push("/");
        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };

    return (
        <Layout title="Add Lecture">
            {loading && <Loader prompt="This might take a while." />}
            <div className="min-h-screen  text-white py-10">
                <div className="max-w-md mx-auto px-4">
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="subject"
                                className="block text-lg font-medium mb-2"
                            >
                                Subject
                            </label>
                            <select
                                id="subject"
                                name="subject"
                                className="rounded-md text-black shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full py-2 px-3"
                                value={selectedSubject}
                                onChange={(e) =>
                                    setSelectedSubject(e.target.value)
                                }
                                required
                            >
                                <option className="text-black" value="">
                                    -- Select a subject --
                                </option>
                                {subjects.map((subject) => (
                                    <option
                                        key={subject._id}
                                        value={subject.name}
                                        className="text-black"
                                    >
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="title"
                                className="block text-lg font-medium mb-2"
                            >
                                Lecture title
                            </label>
                            <input
                                id="title"
                                name="title"
                                className="rounded-md text-black shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full py-2 px-3"
                                value={lectureTitle}
                                onChange={(e) =>
                                    setLectureTitle(e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="audio"
                                className="block text-lg font-medium mb-2"
                            >
                                Audio File
                            </label>
                            <input
                                type="file"
                                name="audio"
                                id="audio"
                                className="rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full py-2 px-3"
                                onChange={(e) =>
                                    setAudioFile(e.target.files[0])
                                }
                                accept="audio/*"
                                required
                            />
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-blue-500 hover:bg-blue-700"
                            >
                                Add Lecture
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
