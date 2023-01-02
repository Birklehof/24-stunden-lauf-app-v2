import { useEffect, useState } from "react";
import { auth } from "../firebase";

interface User {
  uid: string;
  email?: string;
  displayName?: string;
}

const useAuth = () => {
  const [user, setUser] = useState<User>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((authenticatedUser) => {
      if (user !== authenticatedUser) {
        if (authenticatedUser && authenticatedUser.uid) {
          const newUser = authenticatedUser as User;
          setUser(newUser);
          setIsLoggedIn(true);
        }
      }
    });
  }, []);

  return { user, isLoggedIn };
};

export default useAuth;
