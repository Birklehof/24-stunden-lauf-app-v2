import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
  onSnapshot,
} from '@firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Runner } from '@/lib/interfaces';
import { useEffect, useState } from 'react';
import useAuth from './useAuth';
import { getRunnerPosition } from '@/lib/firebase/frontendUtils';

export default function useRunner() {
  const { isLoggedIn, user, role } = useAuth();
  const [runner, setRunner] = useState<Runner | null | undefined>(undefined);
  const [lapCount, setLapCount] = useState<number | undefined>(undefined);
  const [position, setPosition] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!isLoggedIn || !user?.email) return;
    getRunnerByEmail(user.email).then((runner) => {
      setRunner(runner);
      if (runner) {
        syncLapCount(runner);
      }
    });
  }, [isLoggedIn, user, role]);

  useEffect(() => {
    if (!runner || !lapCount) {
      return;
    }

    getRunnerPosition({
      ...runner,
      lapCount,
    }).then((position) => {
      setPosition(position);
    });
  }, [runner, lapCount]);

  async function getRunnerByEmail(email: string): Promise<Runner | null> {
    const userSnapshot = await getDocs(
      query(
        collection(db, '/apps/24-stunden-lauf/runners'),
        where('email', '==', email)
      )
    );

    if (userSnapshot.docs.length == 0) {
      return null;
    }

    return {
      id: userSnapshot.docs[0].id,
      ...userSnapshot.docs[0].data(),
    } as Runner;
  }

  async function syncLapCount(runner: Runner) {
    const lapCountQuery = query(
      collection(db, '/apps/24-stunden-lauf/laps'),
      where('runnerId', '==', runner.id)
    );
    const lapCountSnapshot = await getCountFromServer(lapCountQuery);
    const lapCount = lapCountSnapshot.data().count || 0;
    setLapCount(lapCount);

    onSnapshot(lapCountQuery, (snapshot) => {
      setLapCount(snapshot.docs.length);
    });
  }

  return { runner, lapCount, position };
}
