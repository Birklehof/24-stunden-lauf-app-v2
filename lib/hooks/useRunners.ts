import { Runner } from "@/lib/interfaces/runner";
import { useEffect, useState } from "react";
import { collection, query, getDocs } from "@firebase/firestore";
import { db } from "@/lib/firebase";
import { addDoc, onSnapshot } from "firebase/firestore";
import useAuth from "./useAuth";
import useStaff from "./useStaff";
import useStudents from "./useStudents";

export default function useRunners() {
  const { isLoggedIn, user } = useAuth();
  const { students } = useStudents();
  const { staff } = useStaff();
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

  function getRunnerName(runnerId: string): string {
    const runner = runners[runnerId];

    if (!runner) {
      return "Unbekannt";
    }

    if (runner.name) {
      return runner.name;
    } else if (runner.studentId) {
      const student = students[runner.studentId];
      if (student) {
        return student.firstName.concat(" ").concat(student.lastName);
      }
    } else if (runner.staffId) {
      const staffMember = staff[runner.staffId];
      if (staffMember) {
        return staffMember.firstName.concat(" ").concat(staffMember.lastName);
      }
    }

    return "Unbekannt";
  }

  return { runners, createRunner, getRunnerName };
}
