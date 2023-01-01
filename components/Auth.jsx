import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, microsoftOAuthProvider } from "../firebase";
import useAuth from "../hooks/useAuth";

const Auth = () => {
  const { isLoggedIn, user } = useAuth();

  const handleAuth = async () => {
    signInWithPopup(auth, microsoftOAuthProvider)
      .then((result) => {
        // User is signed in.
        // IdP data available in result.additionalUserInfo.profile.

        // Get the OAuth access token and ID Token
        const credential = OAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        const idToken = credential.idToken;
        console.log(accessToken, idToken);
      })
      .catch((error) => {
        // Handle error.
      });
  };

  return (
    <div>
      <h1>Auth</h1>
      {isLoggedIn && (
        <div>
          <p>Logged in as {user.email}</p>
          <button onClick={() => auth.signOut()}>Logout</button>
        </div>
      )}
      {!isLoggedIn && (
        <div>
          <button onClick={() => handleAuth()}>Login with MS</button>
        </div>
      )}
    </div>
  );
};

export default Auth;
