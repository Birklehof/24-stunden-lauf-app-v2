// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, OAuthProvider } from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const microsoftOAuthProvider = new OAuthProvider("microsoft.com");
microsoftOAuthProvider.setCustomParameters({
  prompt: "consent",
  tenant: "89cd34a8-db37-49d2-a4f9-9231b59f7e1a",
});
const githubOAuthProvider = new OAuthProvider("github.com");
githubOAuthProvider.setCustomParameters({
  allow_signup: "false",
});

export { app, db, auth, microsoftOAuthProvider, githubOAuthProvider };
