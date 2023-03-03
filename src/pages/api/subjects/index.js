import { MongoClient } from "mongodb";

export default async function handler(req, res) {
    const uri = process.env.NEXT_PUBLIC_MONGO_URL;
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();

        const db = client.db("lecturemind");
        const collection = db.collection("subjects");
        const cursor = collection.find({});
        const subjects = await cursor.toArray();

        res.json(subjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to connect to database" });
    } finally {
        await client.close();
    }
}
