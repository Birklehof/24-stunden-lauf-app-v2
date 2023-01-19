import { Runner } from "lib/interfaces/runner";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
} from "@firebase/firestore";
import { db } from "lib/firebase";

export default function useRanking() {
  const [runners, setRunners] = useState<Runner[]>([]);

  useEffect(() => {
    getRunners().then((runners) => {
      setRunners(runners.sort((a, b) => (b.lapCount || 0) - (a.lapCount || 0)));
    });
  }, []);

  async function getRunners(): Promise<Runner[]> {
    const q = query(collection(db, "/apps/24-stunden-lauf/runners"));
    const querySnapshot = await getDocs(q);
    const runners = querySnapshot.docs.map(async (doc) => {
      const id = doc.id;
      const data = doc.data();
      const runner = { id, ...data } as Runner;
      runner.lapCount = await getLapCount(id);
      return runner;
    });
    const runnersWithLapCount = await Promise.all(runners);
    return runnersWithLapCount;
  }

  async function getLapCount(runnerId: string): Promise<number> {
    const q = query(
      collection(db, "/apps/24-stunden-lauf/laps"),
      where("runnerId", "==", runnerId)
    );
    const lapCount = await getCountFromServer(q);
    return lapCount.data().count;
  }

  function getPosition(runner: Runner) {
    const position = runners.findIndex((r) => r.id == runner.id) + 1;
    return position;
  }

  return { runners, getPosition };
}
