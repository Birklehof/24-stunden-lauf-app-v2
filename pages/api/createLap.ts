import { NextApiRequest, NextApiResponse } from "next";
import { auth, db } from "lib/firebase/firebase-admin";

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
