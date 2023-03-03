import { MongoClient, ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method === "PUT") {
        const { subjectName, newLecture } = req.body;

        if (!subjectName || !newLecture) {
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
            const db = client.db("lecturemind");
            const collection = db.collection("subjects");
            const subject = await collection.findOne({ name: subjectName });

            if (!subject) {
                return res.status(404).json({ error: "Subject not found" });
            }

            const lectureId = new ObjectId();
            const lecture = { _id: lectureId, ...newLecture };
            await collection.updateOne(
                { _id: subject._id },
                { $push: { lectures: lecture } }
            );

            res.json({ message: "Lecture added successfully" });
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
