// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, OAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9-s0Qg1LG4VIdvfOnQjVDw_8CCbmC_f8",
  authDomain: "stunden-lauf.firebaseapp.com",
  projectId: "stunden-lauf",
  storageBucket: "stunden-lauf.appspot.com",
  messagingSenderId: "210407908201",
  appId: "1:210407908201:web:88ba4c67121bc05583d3f8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const microsoftOAuthProvider = new OAuthProvider("microsoft.com");
microsoftOAuthProvider.setCustomParameters({
  prompt: "consent",
  tenant: "89cd34a8-db37-49d2-a4f9-9231b59f7e1a",
});

export { app, db, auth, microsoftOAuthProvider };
