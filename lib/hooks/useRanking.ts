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
import { getDoc, onSnapshot } from "firebase/firestore";

interface LapCountByRunnerId {
  runnerId: string;
  lapCount: number;
}

export default function useRanking() {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [lapCountByRunnerId, setLapCountByRunnerId] = useState<
    LapCountByRunnerId[]
  >([]);

  useEffect(() => {
    getRunners().then((runners) => {
      setRunners(runners);
    });
    syncLapsByRunnerId();
  }, []);

  async function getRunners(): Promise<Runner[]> {
    const q = query(collection(db, "/apps/24-stunden-lauf/runners"));
    const querySnapshot = await getDocs(q);
    const runners = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { id: doc.id, ...data } as Runner;
    });
    return runners;
  }

  async function syncLapsByRunnerId() {
    const q = collection(db, "/apps/24-stunden-lauf/laps");
    const querySnapshot = await getDocs(q);
    let loadedLapCountByRunnerId: LapCountByRunnerId[] = [];
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const lapCountWithRunnerId = loadedLapCountByRunnerId.find(
        (lap) => lap.runnerId == data.runnerId
      );
      if (lapCountWithRunnerId) {
        lapCountWithRunnerId.lapCount++;
      } else {
        loadedLapCountByRunnerId.push({ runnerId: data.runnerId, lapCount: 1 });
      }
    });
    setLapCountByRunnerId(
      loadedLapCountByRunnerId.sort((a, b) => b.lapCount - a.lapCount)
    );

    onSnapshot(q, (querySnapshot) => {
      let loadedLapCountByRunnerId: LapCountByRunnerId[] = [];
      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const lapCountWithRunnerId = loadedLapCountByRunnerId.find(
          (lap) => lap.runnerId == data.runnerId
        );
        if (lapCountWithRunnerId) {
          lapCountWithRunnerId.lapCount++;
        } else {
          loadedLapCountByRunnerId.push({
            runnerId: data.runnerId,
            lapCount: 1,
          });
        }
      });
      setLapCountByRunnerId(
        loadedLapCountByRunnerId.sort((a, b) => b.lapCount - a.lapCount)
      );
    });
  }

  function getPosition(runner: Runner) {
    const position = lapCountByRunnerId.findIndex(
      (lap) => lap.runnerId == runner.id
    );
    return position + 1;
  }

  return { runners, lapCountByRunnerId, getPosition };
}
