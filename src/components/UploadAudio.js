import { useState } from "react";

export default function UploadAudio() {
    const [audioFile, setAudioFile] = useState(null);

    const handleUpload = (event) => {
        setAudioFile(event.target.files[0]);
    };

    return (
        <div className="bg-gray-800 py-10 px-4 rounded-lg">
            <h2 className="text-3xl font-bold text-white mb-7">
                Upload Lecture Audio
            </h2>
            <label
                htmlFor="audio-upload"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer my-3"
            >
                Select File
            </label>
            <input
                id="audio-upload"
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleUpload}
            />
            {audioFile && (
                <p className="text-green-400 mt-4">{audioFile.name} selected</p>
            )}
        </div>
    );
}
