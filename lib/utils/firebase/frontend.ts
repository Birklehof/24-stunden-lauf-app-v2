import {
  addDoc,
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

// Used in pages/runner/index.tsx FIXME: this function is bullshit ⇾ probably ai generated
// export async function getPosition(lapCount: number): Promise<number> {
//   const positionQuery = query(
//     collection(firebase, 'apps/24-stunden-lauf/runners'),
//     where('lapCount', '>', lapCount)
//   );
//   const positionSnapshot = await getCountFromServer(positionQuery);
//   const position = positionSnapshot.data().count || 0;
//   return position + 1;
// }

// Used in pages/runner/index.tsx
export async function syncLapCount(runnerId: string, updateFunction: Function) {
  const lapCountQuery = query(
    collection(firebase, '/apps/24-stunden-lauf/laps'),
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
    collection(firebase, 'apps/24-stunden-lauf/runners'),
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

// Used in pages/assistant/create-runner.tsx
export async function createRunner(name: string): Promise<number> {
  if (!name) {
    throw new Error('Ungültiger Name');
  }

  const newNumberQuery = query(
    collection(firebase, 'apps/24-stunden-lauf/runners'),
    orderBy('number', 'desc'),
    limit(1)
  );
  const newNumberSnapshot = await getDocs(newNumberQuery);
  const newNumber = newNumberSnapshot.empty
    ? 1
    : newNumberSnapshot.docs[0].data().number + 1;

  const runner = { name, number: newNumber, type: 'guest' } as Runner;
  await addDoc(collection(firebase, 'apps/24-stunden-lauf/runners'), runner);

  return newNumber;
}

// Used in pages/assistant/index.tsx
export async function deleteLap(lapId: string) {
  await deleteDoc(doc(firebase, 'apps/24-stunden-lauf/laps', lapId));
}

// Used in pages/assistant/index.tsx
export async function getNewestLaps(numberOfLaps: number): Promise<Lap[]> {
  const lapsQuery = query(
    collection(firebase, 'apps/24-stunden-lauf/laps'),
    orderBy('createdAt', 'desc'),
    limit(numberOfLaps)
  );
  const lapsSnapshot = await getDocs(lapsQuery);

  const laps = lapsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    } as Lap;
  });

  return laps;
}
