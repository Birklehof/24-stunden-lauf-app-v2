import { useEffect, useState } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "lib/firebase";
import { addDoc, onSnapshot } from "firebase/firestore";
import Lap from "lib/interfaces/lap";
import useRunners from "./useRunners";

export default function useLaps() {
  const [laps, setLaps] = useState<Lap[]>([]);
  const { runners } = useRunners();

  useEffect(() => {
    syncLaps();
  }, []);

  async function syncLaps() {
    const q = collection(db, "/apps/24-stunden-lauf/laps");
    const querySnapshot = await getDocs(q);
    const laps = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { id: doc.id, ...data } as Lap;
    });
    setLaps(laps);

    onSnapshot(q, (querySnapshot) => {
      const laps = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data } as Lap;
      });
      setLaps(laps);
    });
  }

  async function createLap(runnerNumber: number) {
    if (runnerNumber <= 0) {
      throw new Error("Invalid runner number");
    }

    const runnerId = Object.values(runners).find(
      (runner) => runner.number == runnerNumber
    )?.id;

    if (!runnerId) {
      throw new Error("Runner not found");
    }

    const lap = { runnerId, timestamp: new Date() };
    const docRef = await addDoc(
      collection(db, "apps/24-stunden-lauf/laps"),
      lap
    );
  }

  return { laps, createLap };
}
