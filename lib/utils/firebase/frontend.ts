import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { Runner, Lap } from '@/lib/interfaces';
import { firebase } from '@/lib/firebase';

// Used in pages/runner/index.tsx
export async function syncLapCount(runnerId: string, updateFunction: Function) {
  const lapCountQuery = query(
    collection(firebase, 'laps'),
    where('runnerId', '==', runnerId)
  );
  const lapCountSnapshot = await getCountFromServer(lapCountQuery);
  const lapCount = lapCountSnapshot.data().count || 0;
  updateFunction(lapCount);

  onSnapshot(lapCountQuery, (snapshot) => {
    updateFunction(snapshot.docs.length);
  });
}

// Used in pages/runner/charts.tsx
export async function getRunner(email: string): Promise<Runner> {
  const runnerQuery = query(
    collection(firebase, 'runners'),
    where('email', '==', email)
  );
  const runnerSnapshot = await getDocs(runnerQuery);
  const runnerData = runnerSnapshot.docs[0].data();

  if (!runnerData) {
    throw new Error('Runner not found');
  }

  return {
    id: runnerSnapshot.docs[0].id,
    ...runnerData,
  } as Runner;
}

// Used in pages/assistant/index.tsx
export async function deleteLap(lapId: string) {
  await deleteDoc(doc(firebase, 'laps', lapId));
}

export async function syncNewestLaps(
  limitNumber: number,
  updateFunction: Function
) {
  const lapsQuery = query(
    collection(firebase, 'laps'),
    orderBy('createdAt', 'desc'),
    limit(limitNumber)
  );

  const lapsSnapshot = await getDocs(lapsQuery);
  const lapsData = lapsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Lap[];

  updateFunction(lapsData);

  onSnapshot(lapsQuery, (snapshot) => {
    const lapsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Lap[];
    updateFunction(lapsData);
  });
}