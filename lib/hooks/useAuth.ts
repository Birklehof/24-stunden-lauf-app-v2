import router from 'next/router';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { User } from '@/lib/interfaces';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

export default function useAuth() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [role, setRole] = useState<string | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((authenticatedUser) => {
      if (user !== authenticatedUser) {
        setIsLoggedIn(false);
        if (authenticatedUser && authenticatedUser.uid) {
          const newUser = authenticatedUser as User;
          setUser(newUser);
          getUserRole(newUser).then((role) => {
            setRole(role);
          });
          setIsLoggedIn(true);
        }
      }
    });
  }, []);

  async function getUserRole(user: User): Promise<string | undefined> {
    if (!user || !user.email) {
      return;
    }
    const roleSnapshot = await getDoc(
      doc(db, '/apps/24-stunden-lauf/roles', user.email)
    );
    const role = roleSnapshot.data()?.role || '';

    if (user.email.endsWith('@s.birklehof.de') || user.email.endsWith('@birklehof.de')) {
      return 'runner';
    }

    // The following code could be used to check if the user is a runner, but then the information on the runners would be public
    //
    // if (!role) {
    //   const runnerQuery = query(collection(db, '/apps/24-stunden-lauf/runners'), where('email', '==', user.email));
    //   const runnerSnapshot = await getDocs(runnerQuery);
    //   if (runnerSnapshot.empty) {
    //     return '';
    //   }

    //   return 'runner';
    // }

    return role;
  }

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

  return { user, role, isLoggedIn, logout };
}
