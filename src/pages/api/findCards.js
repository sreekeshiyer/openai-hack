import { MongoClient, ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { subjectId, lectureName } = req.body;

        if (!subjectId || !lectureName) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        const uri = process.env.NEXT_PUBLIC_MONGO_URL;
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        try {
            await client.connect();
            // console.log("Connected to MongoDB database");
            const subjectsCollection = client
                .db("lecturemind")
                .collection("subjects");
            const subject = await subjectsCollection.findOne({
                _id: new ObjectId(subjectId),
            });

            // find the lecture object with the specified ID inside the subject document

            const lecture = subject.lectures.find(
                (lecture) => lecture.name == lectureName
            );

            // get the flashcards array for the found lecture object

            const flashcards = lecture.flashcards;

            if (!flashcards) {
                res.status(400).json({
                    message: "failure",
                    flashcards: [],
                });
            }
            res.json({ message: "success", flashcards: flashcards });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to connect to database" });
        } finally {
            await client.close();
            // console.log("Disconnected from MongoDB database");
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
