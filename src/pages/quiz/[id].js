import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import Score from "@/components/Score";
import axios from "axios";
import { HOST_URL } from "@/config/index";

// const questions = [
//     {
//         id: 1,
//         question: "What is the capital of India?",
//         options: [
//             { id: 1, text: "New Delhi", correct: true },
//             { id: 2, text: "Mumbai", correct: false },
//             { id: 3, text: "Kolkata", correct: false },
//             { id: 4, text: "Chennai", correct: false },
//         ],
//     },
//     {
//         id: 2,
//         question: "Who is the author of the Harry Potter series?",
//         options: [
//             { id: 1, text: "J.K. Rowling", correct: true },
//             { id: 2, text: "Stephenie Meyer", correct: false },
//             { id: 3, text: "Dan Brown", correct: false },
//             { id: 4, text: "George R.R. Martin", correct: false },
//         ],
//     },
//     {
//         id: 3,
//         question: "What is the highest mountain in the world?",
//         options: [
//             { id: 1, text: "Mount Kilimanjaro", correct: false },
//             { id: 2, text: "Mount Everest", correct: true },
//             { id: 3, text: "Mount Fuji", correct: false },
//             { id: 4, text: "Mount Kilimanjaro", correct: false },
//         ],
//     },
// ];

const Quiz = ({ questions }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [enabledButton, setButtonStatus] = useState(true);

    const handleOptionClick = (correct) => {
        setButtonStatus(false);
        console.log(enabledButton);

        if (correct) {
            setScore(score + 1);
            toast.success("Correct!", { autoClose: 100 });
        } else {
            toast.error("Wrong answer", { autoClose: 100 });
        }
        setCurrentQuestionIndex(currentQuestionIndex + 1);

        setButtonStatus(true);
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <Layout title="Quiz">
            <div className="flex items-center justify-center min-h-screen w-full">
                <div className="max-w-2xl mx-auto rounded-md bg-blue-100 p-10">
                    <AnimatePresence initial={false} mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentQuestion ? (
                                <>
                                    <h1 className="text-3xl font-bold mb-4">
                                        {currentQuestion.question}
                                    </h1>
                                    <div className="grid grid-cols-2 gap-4">
                                        {currentQuestion.options.map(
                                            (option) => (
                                                <button
                                                    key={option.id}
                                                    className="p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                    onClick={() =>
                                                        handleOptionClick(
                                                            option.correct
                                                        )
                                                    }
                                                    disabled={
                                                        enabledButton === false
                                                    }
                                                >
                                                    {option.text}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </>
                            ) : (
                                <Score score={score} total={questions.length} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                    <ToastContainer />
                </div>
            </div>
        </Layout>
    );
};

export default Quiz;

export async function getServerSideProps(ctx) {
    const slug = ctx.params.id.toString();

    const res = await axios.get(`${HOST_URL}/api/subjects`);

    const [sub_id, lec] = slug.split("-");

    const subFilter = res.data.filter((sub) => sub._id === sub_id);

    if (subFilter.length === 0)
        return {
            notFound: true, //redirects to 404 page
        };

    const lectures = subFilter[0].lectures;

    try {
        let currLec = lectures.filter((l) => l._id === lec);

        if (!currLec[0].quiz) {
            return {
                notFound: true, //redirects to 404 page
            };
        }
        return {
            props: {
                questions: currLec[0].quiz,
            },
        };
    } catch (err) {
        return {
            notFound: true, //redirects to 404 page
        };
    }
}
