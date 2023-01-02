import router from "next/router";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { User } from "../interfaces/user";

const useAuth = () => {
  const [user, setUser] = useState<User>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((authenticatedUser) => {
      if (user !== authenticatedUser) {
        if (authenticatedUser && authenticatedUser.uid) {
          console.log("authenticatedUser", authenticatedUser);
          const newUser = authenticatedUser as User;
          setUser(newUser);
          setIsLoggedIn(true);
        }
      }
    });
  }, []);

  const logout = async () => {
    return auth
      .signOut()
      .then(() => {
        router.push("/");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return { user, isLoggedIn, logout };
};

export default useAuth;
