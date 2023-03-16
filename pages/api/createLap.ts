import { NextApiRequest, NextApiResponse } from "next";
import { auth, db } from "lib/firebase/firebase-admin";
import Lap from "lib/interfaces/lap";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    await auth.verifyIdToken(req.headers.authorization.toString());
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }

  const { runnerId } = req.body;

  if (!runnerId) {
    return res.status(400).json({ error: "Missing runnerId" });
  }

  // Get last lap of runner
  const querySnapshot = await db
    .collection("apps/24-stunden-lauf/laps")
    .where("runnerId", "==", runnerId)
    .orderBy("timestamp", "desc")
    .limit(1)
    .get();

  if (!querySnapshot.empty) {
    const lastLapOfRunner = querySnapshot.docs[0].data() as Lap;
    const lastLapDate = lastLapOfRunner.timestamp.toDate();

    const now = new Date();

    // Check if last lap was less than 2 minutes ago
    if (now.getTime() - lastLapDate.getTime() < 2 * 60 * 1000) {
      return res.status(400).json({ error: "Too many laps" });
    }
  }

  const lap = { runnerId, timestamp: new Date() };
  await db
    .collection("apps/24-stunden-lauf/laps")
    .add(lap)
    .catch((err) => {
      console.error(err);
      return res.status(500).end();
    })
    .then(() => {
      res.status(200).end();
    });
}
