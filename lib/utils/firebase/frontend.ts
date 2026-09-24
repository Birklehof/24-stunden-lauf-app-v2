import {
  collection,
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

export async function syncNewestLaps(
  limitNumber: number,
  updateFunction: (laps: Lap[]) => void
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

export async function syncLapCount(
  runnerId: string,
  updateFunction: (lapCount: number) => void
) {
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

export async function refreshRunnersArray(
  updateFunction: (runners: Runner[]) => void
) {
  const runnersQuery = query(collection(firebase, 'runners'));

  const runnersSnapshot = await getDocs(runnersQuery);

  const runnersArray: Runner[] = [];

  runnersSnapshot.docs.forEach((runner) => {
    runnersArray.push({
      id: runner.id,
      name: runner.data().name,
      number: runner.data().number,
      type: runner.data().type,
      email: runner.data().email,
      class: runner.data().class,
      house: runner.data().house,
      laps: runner.data().laps || 0,
    } as Runner);
  });

  updateFunction(runnersArray);
}
