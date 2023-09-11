import { NextApiRequest, NextApiResponse } from 'next';
import { auth, db } from '@/lib/firebase/admin';
import { Lap } from '@/lib/interfaces';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Verify access token
  try {
    const token = await auth.verifyIdToken(
      req.headers.authorization.toString()
    );

    if (!token.role || token.role !== 'assistant') {
      return res.status(401).json({ error: 'Access token invalid' });
    }
  } catch {
    return res.status(500);
  }

  const { runnerId } = req.body;

  if (!runnerId) {
    return res.status(400).json({ error: 'Missing runnerId' });
  }

  // TODO: Make sure the user exists

  // Get last lap of runner
  const querySnapshot = await db
    .collection('apps/24-stunden-lauf/laps')
    .where('runnerId', '==', runnerId)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get();

  if (!querySnapshot.empty) {
    const lastLapOfRunner = querySnapshot.docs[0].data() as Lap;
    const lastLapDate = lastLapOfRunner.createdAt.toDate();

    const now = new Date();

    // Check if last lap was less than 2 minutes ago
    if (now.getTime() - lastLapDate.getTime() < 2 * 60 * 1000) {
      return res.status(400).json({ error: 'Too many laps' });
    }
  }

  const now = new Date();

  // Create new lap
  await db
    .collection('apps/24-stunden-lauf/laps')
    .add({ runnerId, createdAt: now })
    .then((docRef) => {
      res.status(200).json({
        id: docRef.id, // @ts-ignore
        runnerId,
        createdAt: now,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).end();
    });
}
