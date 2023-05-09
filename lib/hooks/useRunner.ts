import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
  onSnapshot,
} from '@firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Student, Runner, Staff } from '@/lib/interfaces';
import { useEffect, useState } from 'react';
import useAuth from './useAuth';

export default function useRunner() {
  const { isLoggedIn, user, role } = useAuth();
  const [runner, setRunner] = useState<Runner>();
  const [laps, setLaps] = useState<number>(0);

  useEffect(() => {
    if (!isLoggedIn || !user) return;
    getRunner(user).then((runner) => {
      setRunner(runner);
      if (runner) {
        syncLapCount(runner);
      }
    });
  }, [isLoggedIn, user, role]);

  async function getRunner(user: User): Promise<Runner | undefined> {
    if (!user) {
      return;
    } else {
      const q = query(
        collection(db, '/apps/24-stunden-lauf/runners'),
        where('email', '==', user.email)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length == 0) {
        throw new Error('Runner not found');
      }
      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data(),
      } as Runner;
    }
  }

  async function syncLapCount(runner: Runner) {
    const q = query(
      collection(db, '/apps/24-stunden-lauf/laps'),
      where('runnerId', '==', runner.id)
    );
    const lapCount = await getCountFromServer(q);
    setLaps(lapCount.data().count);

    onSnapshot(q, (query) => {
      setLaps(query.docs.length);
    });
  }

  return { runner, laps };
}
