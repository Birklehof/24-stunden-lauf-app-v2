import React from "react";
import { signInWithPopup } from "firebase/auth";
import {
  auth,
  githubOAuthProvider,
  microsoftOAuthProvider,
} from "@/lib/firebase";
import useAuth from "@/lib/hooks/useAuth";
import { themedPromiseToast } from "@/lib/utils";

export default function Login() {
  const { isLoggedIn } = useAuth();

  const handleRunnerAuth = async () => {
    themedPromiseToast(signInWithPopup(auth, microsoftOAuthProvider), {
      pending: "Anmeldung läuft...",
      success: {
        render: () => {
          return "Willkommen zurück!";
        },
        icon: "👋",
        type: "info",
      },
      error: "Fehler beim Anmelden!",
    });
  };

  const handleStaffAuth = async () => {
    themedPromiseToast(signInWithPopup(auth, githubOAuthProvider), {
      pending: "Anmeldung läuft...",
      success: {
        render: () => {
          return "Willkommen zurück!";
        },
        icon: "👋",
        type: "info",
      },
      error: "Fehler beim Anmelden!",
    });
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
