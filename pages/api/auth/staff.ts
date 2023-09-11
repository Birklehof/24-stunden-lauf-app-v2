import { auth, db } from '@/lib/firebase/admin';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!req.body.code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  // Check if code exists in database
  const querySnapshot = await db
    .collection('apps/24-stunden-lauf/codes')
    .doc(req.body.code)
    .get();

  if (!querySnapshot.exists) {
    return res.status(400).json({ error: 'Code invalid' });
  }

  // Send auth token to client
  auth
    .createCustomToken(
      process.env.NEXT_PUBLIC_ASSISTANT_ACCOUNT_UID || 'some-uid',
      {
        role: 'assistant',
      }
    )
    .then((customToken) => {
      res.status(200).json({ token: customToken });
    })
    .catch((error) => {
      console.log('Error creating custom token:', error);
    });
}
