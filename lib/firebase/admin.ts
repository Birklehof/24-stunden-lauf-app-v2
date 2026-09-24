import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from '@/lib/firebase/firebaseConfig';

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT?.toString() || '{}'
);

const firebaseAdminApp =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
        databaseURL: firebaseConfig.databaseURL,
      })
    : getApps()[0];

const auth = getAuth(firebaseAdminApp);
const firebase = getFirestore(firebaseAdminApp);
const database = getDatabase(firebaseAdminApp);

export { auth, firebase, database };
