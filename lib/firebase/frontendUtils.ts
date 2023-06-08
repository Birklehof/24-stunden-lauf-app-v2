import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { User, Runner, RunnerWithLapCount } from '@/lib/interfaces';
import { db } from '.';

export async function createRunner(
  name: string,
  runners: { [id: string]: Runner }
): Promise<number> {
  if (!name) {
    throw new Error('Invalid name');
  }
  const number = Object.keys(runners).length + 1;

  const runner = { name, number, type: 'guest' } as Runner;
  await addDoc(collection(db, 'apps/24-stunden-lauf/runners'), runner);

  return number;
}

export async function deleteLap(lapId: string) {
  await deleteDoc(doc(db, 'apps/24-stunden-lauf/laps', lapId));
}

export async function createLap(
  runnerNumber: number,
  runners: { [id: string]: Runner },
  user: User | undefined
) {
  if (runnerNumber <= 0) {
    throw new Error('Ungültige Startnummer');
  }

  const runnerId = Object.values(runners).find(
    (runner) => runner.number == runnerNumber
  )?.id;

  if (!runnerId) {
    return Promise.reject('Kein Läufer mit dieser Startnummer');
  }

  // Make api request to /api/createLap
  const res = await fetch('/api/createLap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: user?.accessToken || '',
    },
    body: JSON.stringify({ runnerId }),
  });

  if (res.status == 200) {
    return;
  }

  const body = await res.text();

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

export async function getRunnerWithLapCount(runnerId: string): Promise<RunnerWithLapCount> {
  const runnerDoc = await getDocs(collection(db, 'apps/24-stunden-lauf/runners'));
  const runner = runnerDoc.docs.find((doc) => doc.id == runnerId)?.data() as Runner;

  const lapCountSnapshot = await getCountFromServer(
    query(collection(db, 'apps/24-stunden-lauf/laps'), where('runnerId', '==', runnerId))
  );
  const lapCount = lapCountSnapshot.data().count || 0;

  return {
    ...runner,
    lapCount,
  } as RunnerWithLapCount;
}

export async function getRunnersWithLapCount(): Promise<RunnerWithLapCount[]> {
  // Get all runners

  const runners = await getDocs(collection(db, 'apps/24-stunden-lauf/runners'));

  // Get the lap count for each runner
  const runnersWithLaps = await Promise.all(
    runners.docs.map(async (docs) => {
      const runner = docs.data() as Runner;

      const lapsQuery = query(
        collection(db, 'apps/24-stunden-lauf/laps'),
        where('runnerId', '==', docs.id)
      );
      const lapCountSnapshot = await getCountFromServer(lapsQuery);
      const lapCount = lapCountSnapshot.data().count || 0;

      return {
        ...runner,
        lapCount,
      } as RunnerWithLapCount;
    })
  );

  return runnersWithLaps;
}

export async function getRunnerPosition(runner: RunnerWithLapCount): Promise<number> {
  const positionQuery = query(collection(db, 'apps/24-stunden-lauf/runners'), where('lapCount', '>', runner.lapCount));
  const positionSnapshot = await getCountFromServer(positionQuery);
  const position = positionSnapshot.data().count || 0;
  return position + 1;
}