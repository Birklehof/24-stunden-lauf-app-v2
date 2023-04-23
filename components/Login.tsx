import React from "react";
import { signInWithPopup } from "firebase/auth";
import {
  auth,
  githubOAuthProvider,
  microsoftOAuthProvider,
} from "@/lib/firebase";
import useAuth from "@/lib/hooks/useAuth";
import useToast from "@/lib/hooks/useToast";

export default function Login() {
  const { isLoggedIn } = useAuth();
  const { promiseToast } = useToast();

  const handleRunnerAuth = async () => {
    promiseToast(signInWithPopup(auth, microsoftOAuthProvider), {
      pending: "Anmeldung läuft...",
      success: {
        render: () => {
          return "Willkommen zurück!";
        },
        icon: "👋", // TODO check if this still works
        type: "info",
      },
      error: "Fehler beim Anmelden!",
    });
    // signInWithPopup(auth, microsoftOAuthProvider).catch((error) => {
    //   console.log(error);
    // });
  };

  const handleStaffAuth = async () => {
    promiseToast(signInWithPopup(auth, githubOAuthProvider), {
      pending: "Anmeldung läuft...",
      success: {
        render: () => {
          return "Willkommen zurück!";
        },
        icon: "👋", // TODO check if this still works
        type: "info",
      },
      error: "Fehler beim Anmelden!",
    });
    // signInWithPopup(auth, githubOAuthProvider).catch((error) => {
    //   console.log(error);
    // });
  };

  return (
    <>
      <button
        className={`btn btn-outline btn-primary w-full ${
          isLoggedIn ? "btn-disabled loading" : ""
        }`}
        onClick={handleRunnerAuth}
        disabled={isLoggedIn}
      >
        Läufer
      </button>
      <div className="divider">
        <p className="font-bold text-sm text-gray-300 tracking-wider">ODER</p>
      </div>
      <button
        className={`btn btn-outline btn-primary w-full ${
          isLoggedIn ? "btn-disabled loading" : ""
        }`}
        onClick={handleStaffAuth}
        disabled={isLoggedIn}
      >
        Assistent
      </button>
    </>
  );
}
