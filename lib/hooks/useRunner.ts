import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
  onSnapshot,
} from "@firebase/firestore";
import { db } from "lib/firebase";
import { Runner } from "lib/interfaces/runner";
import Staff from "lib/interfaces/staff";
import { Student } from "lib/interfaces/student";
import { User } from "lib/interfaces/user";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";

export default function useUser() {
  const { isLoggedIn, user, role } = useAuth();
  const [runner, setRunner] = useState<Runner>();
  const [laps, setLaps] = useState<number>(0);

  useEffect(() => {
    if (isLoggedIn && user) {
      getRunner(user).then((runner) => {
        setRunner(runner);
        if (runner) {
          syncLapCount(runner);
        }
      });
    }
  }, [isLoggedIn, user, role]);

  async function getRunner(user: User): Promise<Runner | undefined> {
    if (!user) {
      return;
    } else {
      if (user.email.endsWith("@s.birklehof.de")) {
        const q = query(
          collection(db, "students"),
          where("email", "==", user.email)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length == 0) {
          throw new Error("Student not found");
        }
        const student = {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        } as Student;
        const q2 = query(
          collection(db, "/apps/24-stunden-lauf/runners"),
          where("studentId", "==", student.id)
        );
        const querySnapshot2 = await getDocs(q2);
        if (querySnapshot2.docs.length == 0) {
          return;
        }
        const id = querySnapshot2.docs[0].id;
        const data = querySnapshot2.docs[0].data();
        const runner = { id, ...data } as Runner;
        runner.name = student.firstName + " " + student.lastName;
        return runner;
      } else {
        const q = query(
          collection(db, "staff"),
          where("email", "==", user.email)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length == 0) {
          throw new Error("Staff member not found");
        }
        const staff = {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        } as Staff;
        const q2 = query(
          collection(db, "/apps/24-stunden-lauf/runners"),
          where("staffId", "==", staff.id)
        );
        const querySnapshot2 = await getDocs(q2);
        if (querySnapshot2.docs.length == 0) {
          return;
        }
        const id = querySnapshot2.docs[0].id;
        const data = querySnapshot2.docs[0].data();
        const runner = { id, ...data } as Runner;
        runner.name = staff.firstName + " " + staff.lastName;
        return runner;
      }
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
