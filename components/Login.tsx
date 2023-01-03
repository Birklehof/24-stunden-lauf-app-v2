import React, { useEffect } from "react";
import { OAuthProvider, signInWithPopup } from "firebase/auth";
import {
  auth,
  db,
  githubOAuthProvider,
  microsoftOAuthProvider,
} from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
  doc,
  getDoc,
} from "@firebase/firestore";
import useAuth from "../hooks/useAuth";
import router from "next/router";
import { User } from "../interfaces/user";

const Auth = () => {
  const { isLoggedIn, user, logout } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isLoggedIn && user) {
        redirect(user).then((path) => {
          router.push(path);
        });
      }
    }
  }, [isLoggedIn, user]);

  async function redirect(user: User): Promise<string> {
    const userRole = await getUserRole(user.uid);

    if (userRole === "admin") {
      return "/admin";
    } else if (userRole === "assistant") {
      return "/assistant";
    } else {
      return "/runner";
    }
  }

  async function getUserRole(uid: string): Promise<string> {
    const userRole = await getDoc(doc(db, "user-roles", uid));
    const role = userRole.data()?.role || "";
    return role;
  }

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
    signInWithPopup(auth, githubOAuthProvider)
      .then((result) => {
        const credential = OAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;
        const idToken = credential?.idToken;
      })
      .catch((error) => {
        console.log(error);
      });
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
