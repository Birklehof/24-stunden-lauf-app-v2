// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getAuth, OAuthProvider } from 'firebase/auth';
import { firebaseConfig } from '@/lib/firebase/firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firebase = getFirestore(app);
const functions = getFunctions(app, 'europe-west1');

// connectFirestoreEmulator(firebase, '192.168.56.3', 8080);
// connectFunctionsEmulator(functions, '192.168.56.3', 5001)

const microsoftOAuthProvider = new OAuthProvider('microsoft.com');
microsoftOAuthProvider.setCustomParameters({
  prompt: 'consent',
  tenant: '89cd34a8-db37-49d2-a4f9-9231b59f7e1a',
});

export { app, firebase, auth, functions, microsoftOAuthProvider };
