import { Runner } from "lib/interfaces/runner";
import { useEffect, useState } from "react";
import { collection, query, getDocs } from "@firebase/firestore";
import { db } from "lib/firebase";
import { addDoc, onSnapshot } from "firebase/firestore";
import useAuth from "./useAuth";

export default function useRunners() {
  const { isLoggedIn, user } = useAuth();
  const [runners, setRunners] = useState<{ [id: string]: Runner }>({});

  useEffect(() => {
    if (!isLoggedIn || !user) return;
    syncRunners();
  }, [isLoggedIn, user]);

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

  async function createRunner(name: string): Promise<number> {
    if (!name) {
      throw new Error("Invalid name");
    }
    const new_number = Object.keys(runners).length + 1;
    const new_runner = { name, number: new_number };
    const docRef = await addDoc(
      collection(db, "apps/24-stunden-lauf/runners"),
      new_runner
    );
    return new_number;
  }

  return { runners, createRunner };
}
