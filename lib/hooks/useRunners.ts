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

export default function useRunners() {
  const [runners, setRunners] = useState<{ [id: string]: Runner }>({});

  useEffect(() => {
    syncRunners();
  }, []);

  async function syncRunners() {
    const q = query(collection(db, "/apps/24-stunden-lauf/runners"));
    const querySnapshot = await getDocs(q);
    const new_runners: { [id: string]: Runner } = {};
    querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const new_runner = { id: doc.id, ...data } as Runner;
      new_runners[doc.id] = new_runner;
    });
    setRunners(new_runners);

    onSnapshot(q, (querySnapshot) => {
      const new_runners: { [id: string]: Runner } = {};
      querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const new_runner = { id: doc.id, ...data } as Runner;
        new_runners[doc.id] = new_runner;
      });
      setRunners(new_runners);
    });
  }

  return { runners };
}
