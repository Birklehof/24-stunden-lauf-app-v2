import { useEffect, useState } from "react";
import { collection, query, getDocs, onSnapshot } from "@firebase/firestore";
import { db } from "lib/firebase";
import { Student } from "lib/interfaces/student";
import useAuth from "./useAuth";

export default function useStudents() {
  const { isLoggedIn, user } = useAuth();
  const [students, setStudents] = useState<{ [id: string]: Student }>({});

  useEffect(() => {
    if (!isLoggedIn || !user) return;
    syncStudents();
  }, [isLoggedIn, user]);

  async function syncStudents() {
    const q = query(collection(db, "/students"));
    const querySnapshot = await getDocs(q);
    const new_students: { [id: string]: Student } = {};
    const students = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const new_student = { id: doc.id, ...data } as Student;
      new_students[doc.id] = new_student;
    });
    setStudents(new_students);

    onSnapshot(q, (querySnapshot) => {
      const new_students: { [id: string]: Student } = {};
      const students = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const new_student = { id: doc.id, ...data } as Student;
        new_students[doc.id] = new_student;
      });
      setStudents(new_students);
    });
  }

  return { students };
}
