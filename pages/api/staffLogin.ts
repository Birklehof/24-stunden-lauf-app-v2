import { auth } from 'firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO Ask fot auth code and check it against firestore

  auth()
    .createCustomToken(
      process.env.NEXT_PUBLIC_ASSISTANT_ACCOUNT_UID || 'some-uid'
    )
    .then((customToken) => {
      // Send token back to client
      res.status(200).json({ token: customToken });
    })
    .catch((error) => {
      console.log('Error creating custom token:', error);
    });
}
