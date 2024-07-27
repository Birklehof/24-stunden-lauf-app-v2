import { NextApiRequest, NextApiResponse } from 'next';
import { firebase } from '@/lib/firebase/admin';
import { getUserFromCookies } from 'next-firebase-auth';

import initAuth from '@/lib/next-firebase-auth';

initAuth();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: {
        status: 'method-not-allowed',
        message: 'Method not allowed',
      },
    });
  }

  let user;
  try {
    user = await getUserFromCookies({ req });
  } catch (e) {
    return res.status(500).json({
      error: {
        status: 'internal',
        message: 'Internal server error',
      },
    });
  }

  if (!user || !user.email) {
    return res.status(401).json({
      error: {
        status: 'unauthenticated',
        message: 'Unauthenticated',
      },
    });
  }

  const { goal } = req.body;

  if (!goal || typeof goal !== 'number') {
    return res.status(400).json({
      error: {
        status: 'invalid-argument',
        message: 'Missing field: goal',
      },
    });
  }

  const runnerQuery = await firebase
    .collection('runners')
    .where('email', '==', user.email)
    .limit(1)
    .get();

  if (runnerQuery.empty) {
    return res.status(404).json({
      error: {
        status: 'not-found',
        message: 'Runner not found',
      },
    });
  }

  const runnerRef = firebase.doc(`runners/${runnerQuery.docs[0].id}`);

  await runnerRef.update({
    goal,
  });

  return res.status(200).json({
    success: true,
  });
}
