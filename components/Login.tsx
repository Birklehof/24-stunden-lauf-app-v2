import React from "react";
import { signInWithPopup } from "firebase/auth";
import {
  auth,
  githubOAuthProvider,
  microsoftOAuthProvider,
} from "lib/firebase";
import useAuth from "lib/hooks/useAuth";

export default function Login() {
  const { isLoggedIn } = useAuth();

  const handleRunnerAuth = async () => {
    signInWithPopup(auth, microsoftOAuthProvider).catch((error) => {
      console.log(error);
    });
  };

  const handleStaffAuth = async () => {
    signInWithPopup(auth, githubOAuthProvider).catch((error) => {
      console.log(error);
    });
  };

  return (
    <>
      <button
        className={`btn btn-primary w-full ${
          isLoggedIn ? "btn-disabled loading" : ""
        }`}
        onClick={() => handleRunnerAuth()}
        disabled={isLoggedIn}
      >
        Läufer
      </button>
      <div className="divider">
        <p className="font-bold text-sm text-gray-300 tracking-wider">ODER</p>
      </div>
      <button
        className={`btn btn-primary w-full ${
          isLoggedIn ? "btn-disabled loading" : ""
        }`}
        onClick={() => handleStaffAuth()}
        disabled={isLoggedIn}
      >
        Organisator
      </button>
    </>
  );
}
