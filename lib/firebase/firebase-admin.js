import admin from "firebase-admin";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT.toString()
);

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Initialized.");
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

const auth = admin.auth();
const db = admin.firestore();

export { auth, db };
