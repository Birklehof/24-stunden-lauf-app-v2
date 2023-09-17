import { auth, firebase } from '@/lib/firebase/admin';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
    });
  }

  if (!req.body.code) {
    return res.status(400).json({
      error: 'Missing auth code',
    })
  }

  // Check if code exists in database
  const querySnapshot = await firebase
    .collection('apps/24-stunden-lauf/codes')
    .doc(req.body.code.toString())
    .get();

  if (!querySnapshot.exists) {
    return res.status(401).json({
      error: 'Invalid auth code',
    });
  }

  // Send auth token to client
  try {
    auth
      .createCustomToken(
        process.env.NEXT_PUBLIC_ASSISTANT_ACCOUNT_UID || 'some-uid',
        {
          role: 'assistant',
        }
      )
      .then((customToken) => {
        res.status(200).json({ success: true, token: customToken });
      });
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.' });
  }
}
