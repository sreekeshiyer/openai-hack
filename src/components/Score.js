export default function Score({ score, total }) {
    let message, emoji;
    if (score === 0) {
        message = "Oops!";
        emoji = "🙁";
    } else if (score / total < 0.5 && score > 0) {
        message = "Not bad!";
        emoji = "🤔";
    } else if (score / total >= 0.5 && score / total < 0.8) {
        message = "Good job!";
        emoji = "😀";
    } else {
        message = "Amazing!";
        emoji = "🎉";
    }

    return (
        <div className="p-8 bg-blue-500 rounded-lg flex flex-col items-center justify-center text-white text-lg">
            <div className="mb-2">{emoji}</div>
            <h1>You scored</h1>
            <div>
                {score} / {total}
            </div>
            <div className="mt-2">{message}</div>
        </div>
    );
}
