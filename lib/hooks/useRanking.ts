import { Runner } from "@/lib/interfaces/runner";
import { useEffect, useState } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "@/lib/firebase";
import { getDoc, onSnapshot } from "firebase/firestore";
import useAuth from "./useAuth";

interface LapCountByRunnerId {
  runnerId: string;
  lapCount: number;
}

export default function useRanking() {
  const { isLoggedIn, user } = useAuth();
  const [lapCountByRunnerId, setLapCountByRunnerId] = useState<
    LapCountByRunnerId[]
  >([]);

  useEffect(() => {
    if (!isLoggedIn || !user) return;
    syncLapsByRunnerId();
  }, [isLoggedIn, user]);

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

  return { lapCountByRunnerId, getPosition };
}
