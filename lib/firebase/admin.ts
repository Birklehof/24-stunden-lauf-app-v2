import admin from 'firebase-admin';
import { firebaseConfig } from '@/lib/firebase/firebaseConfig';

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT?.toString() || '{}'
);

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: firebaseConfig.databaseURL,
  });
  console.log('Firebase admin initialized successfully.');
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (error instanceof Error && !error.message.includes('already exists')) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

const auth = admin.auth();
const firebase = admin.firestore();
const database = admin.database();

export { auth, firebase, database };
