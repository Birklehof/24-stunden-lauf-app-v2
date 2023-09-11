import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { User, Runner, RunnerWithLapCount, Lap } from '@/lib/interfaces';
import { db } from '@/lib/firebase';

// Used in pages/assistant/create-runner.tsx
export async function createRunner(name: string): Promise<number> {
  if (!name) {
    throw new Error('Invalid name');
  }

  const newNumberQuery = query(
    collection(db, 'apps/24-stunden-lauf/runners'),
    orderBy('number', 'desc'),
    limit(1)
  );
  const newNumberSnapshot = await getDocs(newNumberQuery);
  const newNumber = newNumberSnapshot.empty
    ? 1
    : newNumberSnapshot.docs[0].data().number + 1;

  const runner = { name, number: newNumber, type: 'guest' } as Runner;
  await addDoc(collection(db, 'apps/24-stunden-lauf/runners'), runner);

  return newNumber;
}

// Used in pages/assistant/index.tsx
export async function deleteLap(lapId: string) {
  await deleteDoc(doc(db, 'apps/24-stunden-lauf/laps', lapId));
}

// Used in pages/assistant/index.tsx
export async function createLap(
  runnerNumber: number,
  runners: { [id: string]: Runner },
  token: string | null,
): Promise<Lap> {
  // Convert runnerNumber to valid runnerId
  if (runnerNumber <= 0) {
    throw new Error('Ungültige Startnummer');
  }
  const runnerId = Object.values(runners).find(
    (runner) => runner.number == runnerNumber
  )?.id;
  if (!runnerId) {
    return Promise.reject('Kein Läufer mit dieser Startnummer');
  }

  // Make api request to /api/createLap to create a lap with the corresponding runnerId
  const res = await fetch('/api/createLap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
    body: JSON.stringify({ runnerId }),
  });

  const body = await res.text();

  if (res.status == 200) {
    return Promise.resolve(JSON.parse(body));
  }

  if (res.status == 401 || res.status == 403) {
    return Promise.reject('Zugriff verweigert');
  }

  if (res.status == 400) {
    if (JSON.parse(body).error == 'Too many laps') {
      return Promise.reject('Letzte Runde ist keine Zwei Minuten her');
    }
  }

  return Promise.reject('Fehler beim Hinzufügen der Runde');
}

// Used in pages/assistant/index.tsx
export async function getNewestLaps(numberOfLaps: number): Promise<Lap[]> {
  const lapsQuery = query(
    collection(db, 'apps/24-stunden-lauf/laps'),
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

// Used in lib/hooks/usePosition.ts
export async function getPosition(lapCount: number): Promise<number> {
  const positionQuery = query(
    collection(db, 'apps/24-stunden-lauf/runners'),
    where('lapCount', '>', lapCount)
  );
  const positionSnapshot = await getCountFromServer(positionQuery);
  const position = positionSnapshot.data().count || 0;
  return position + 1;
}
