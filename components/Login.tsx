import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, githubOAuthProvider, microsoftOAuthProvider } from "../firebase";
import useAuth from "../hooks/useAuth";

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
      <h1>Anmelden</h1>
      <div>
        <button onClick={() => handleRunnerAuth()}>Läufer</button>
        <button onClick={() => handleStaffAuth()}>Organisatoren</button>
      </div>
    </div>
  );
};

export default Auth;
