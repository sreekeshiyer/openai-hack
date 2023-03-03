module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                bounce200: "bounce 1s infinite 200ms",
                bounce400: "bounce 1s infinite 400ms",
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
