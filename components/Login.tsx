import React from "react";
import { signInWithPopup } from "firebase/auth";
import {
  auth,
  githubOAuthProvider,
  microsoftOAuthProvider,
} from "lib/firebase";
import useAuth from "lib/hooks/useAuth";

const Auth = () => {
  const { isLoggedIn, user } = useAuth();

  if (isLoggedIn && user) {
    return <></>;
  }

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
    <div>
      <div>
        <button
          className="btn btn-primary w-full"
          onClick={() => handleRunnerAuth()}
        >
          Läufer
        </button>
        <div className="divider">
          <p className="font-bold text-sm text-gray-300 tracking-wider">ODER</p>
        </div>
        <button
          className="btn btn-primary w-full"
          onClick={() => handleStaffAuth()}
        >
          Organisator
        </button>
      </div>
    </div>
  );
};

export default Auth;
