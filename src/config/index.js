export const API_URL = process.env.NEXT_PUBLIC_MONGO_URL;
export const OPENAI_KEY = process.env.NEXT_PUBLIC_OPENAI_KEY;
export const SUMMARY_PROMPT =
    "Please summarize the passage of text I provide you and return it in Markdown format, so make use of bold, italics and new lines when necessary. Here is the text you have to summarize: ";

export const QUIZ_PROMPT =
    "Generate a quiz of 10 multiple-choice questions with 4 options each strictly in an array of JSON String format such that: \n Each question looks like : \n { question: 'The question text', options: [{id: 1, text: 'option 1', correct: false},{id: 2, text: 'option 2', correct: false}, {id: 3, text: 'option 3', correct: true},{id: 4, text: 'option 4', correct: false}]} \n Any of the options 1,2,3 or 4 could be a right answer.\n The response should look like [question1, question2, ...]\n The questions that are generated should be based on the following context: ";

export const FLASHCARD_PROMPT =
    "Generate 10 flash cards for one to learn and revise from the given text. These can be single sentences that contain useful information. \nThese flash cards need to be in string format in an array separated by commas. \n The text for your reference is: ";
export const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL || "localhost:3000";
