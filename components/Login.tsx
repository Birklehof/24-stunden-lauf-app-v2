import React, { useEffect } from "react";
import { OAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, microsoftOAuthProvider } from "../firebase";
import useAuth from "../hooks/useAuth";

const Auth = () => {
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isLoggedIn) {
        window.location.href = "/runner";
      }
    }
  }, [isLoggedIn, user]);

  const handleRunnerAuth = async () => {
    signInWithPopup(auth, microsoftOAuthProvider)
      .then((result) => {
        const credential = OAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;
        const idToken = credential?.idToken;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAdminAuth = async () => {
    console.log("Admin");
  };

  const handleAssistantAuth = async () => {
    console.log("Assistant");
  };

  return (
    <div>
      <h1>Anmelden</h1>
      {!isLoggedIn && (
        <div>
          <button onClick={() => handleRunnerAuth()}>Läufer</button>
          <button onClick={() => handleAssistantAuth()}>Assistent</button>
          <button onClick={() => handleAdminAuth()}>Admin</button>
        </div>
      )}
    </div>
  );
};

export default Auth;
