import router from 'next/router';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { User } from '@/lib/interfaces';
import { themedErrorToast } from '../utils';

export default function useAuth() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged(async (authenticatedUser) => {
      if (!authenticatedUser) {
        setIsLoggedIn(false);
        setUser(undefined);
        return;
      }

      if (user?.uid !== authenticatedUser.uid) {
        if (
          authenticatedUser &&
          authenticatedUser.uid ===
            process.env.NEXT_PUBLIC_ASSISTANT_ACCOUNT_UID
        ) {
          setIsLoggedIn(true);
          setUser({
            uid: authenticatedUser.uid,
            email: 'assistant@birklehof.de',
            displayName: 'Assistant',
            role: 'assistant',
            accessToken: await authenticatedUser.getIdToken(),
          });
        } else if (
          authenticatedUser &&
          authenticatedUser.uid &&
          authenticatedUser.email &&
          (authenticatedUser.email.endsWith('@s.birklehof.de') ||
            authenticatedUser.email.endsWith('@birklehof.de'))
        ) {
          setIsLoggedIn(true);
          const newUser = {
            ...authenticatedUser,
            role: 'runner',
            accessToken: await authenticatedUser.getIdToken(),
          } as User;
          setUser(newUser);
        } else {
          auth.signOut();
          setIsLoggedIn(true);
          setUser(undefined);

          themedErrorToast('Du hast keine Berechtigung für diese App', {
            theme:
              localStorage.getItem('usehooks-ts-dark-mode') === 'true'
                ? 'dark'
                : 'light',
          });
        }
      }
    });
  }, []);

  async function logout() {
    return auth
      .signOut()
      .then(() => {
        router.push('/');
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return { user, isLoggedIn, logout };
}
