import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase/admin';
import { Lap } from '@/lib/interfaces';
import { getUserFromCookies } from 'next-firebase-auth'

import initAuth from '@/lib/next-firebase-auth';

initAuth()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  let user;
  try {
    user = await getUserFromCookies({ req })
  } catch (e) {
    return res.status(500).end();
  }

  if (!user || !user.id) {
    return res.status(401).end();
  }

  if (user.id !== process.env.NEXT_PUBLIC_ASSISTANT_ACCOUNT_UID) {
    return res.status(403).end();
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
