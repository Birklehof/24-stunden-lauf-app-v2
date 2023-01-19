import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
  onSnapshot,
  doc,
  getDoc,
} from "@firebase/firestore";
import { app, db } from "lib/firebase";
import { Runner } from "lib/interfaces/runner";
import { User } from "lib/interfaces/user";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";

export default function useUser() {
  const { user, role } = useAuth();
  const [runner, setRunner] = useState<Runner>();
  const [laps, setLaps] = useState<number>(0);

  useEffect(() => {
    if (user) {
      getRunner(user, role).then((runner) => {
        setRunner(runner);
        if (runner) {
          syncLapCount(runner);
        }
      });
    }
  }, [user, role]);

  async function getRunner(
    user: User,
    role: string
  ): Promise<Runner | undefined> {
    if (!user) {
      return;
    } else if (role == "student") {
      const q = query(
        collection(db, "students"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      const studentRef = querySnapshot.docs[0].ref;
      const q2 = query(
        collection(db, "/apps/24-stunden-lauf/runners"),
        where("student", "==", studentRef)
      );
      const querySnapshot2 = await getDocs(q2);
      if (querySnapshot2.docs.length == 0) {
        return;
      }
      const id = querySnapshot2.docs[0].id;
      const data = querySnapshot2.docs[0].data();
      const runner = { id, ...data } as Runner;
      runner.name =
        querySnapshot.docs[0].data().firstName +
        " " +
        querySnapshot.docs[0].data().lastName;
      return runner;
    } else {
      const q = query(
        collection(db, "/apps/24-stunden-lauf/runners"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length == 0) {
        return;
      }
      const id = querySnapshot.docs[0].id;
      const data = querySnapshot.docs[0].data();
      const runner = { id, ...data } as Runner;
      return runner;
    }
  }

  async function syncLapCount(runner: Runner) {
    const q = query(
      collection(db, "/apps/24-stunden-lauf/laps"),
      where("runnerId", "==", runner.id)
    );
    const lapCount = await getCountFromServer(q);
    setLaps(lapCount.data().count);

    onSnapshot(q, (query) => {
      setLaps(query.docs.length);
    });
  }

  return { runner, laps };
}
