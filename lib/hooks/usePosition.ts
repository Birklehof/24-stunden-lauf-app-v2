import {
  collection,
  query,
  where,
  getCountFromServer,
  onSnapshot,
} from '@firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { getPosition } from '@/lib/utils/firebase/frontend';

export default function usePosition(runnerId: string) {
  const [lapCount, setLapCount] = useState<number | undefined>(undefined);
  const [position, setPosition] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!runnerId) {
      return;
    }
    console.log('sync lap count');
    syncLapCount(runnerId);
  }, [runnerId]);

  useEffect(() => {
    if (!runnerId || !lapCount) {
      return;
    }

    getPosition(lapCount).then((position) => {
      setPosition(position);
    });
  }, [runnerId, lapCount]);

  async function syncLapCount(runnerId: string) {
    const lapCountQuery = query(
      collection(db, '/apps/24-stunden-lauf/laps'),
      where('runnerId', '==', runnerId)
    );
    const lapCountSnapshot = await getCountFromServer(lapCountQuery);
    const lapCount = lapCountSnapshot.data().count || 0;
    setLapCount(lapCount);

    onSnapshot(lapCountQuery, (snapshot) => {
      setLapCount(snapshot.docs.length);
    });
  }

  return {
    lapCount,
    position,
  };
}
