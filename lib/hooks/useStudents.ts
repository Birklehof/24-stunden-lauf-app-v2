import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
  onSnapshot,
} from "@firebase/firestore";
import { db } from "lib/firebase";
import { Student } from "lib/interfaces/student";

export default function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    syncStudents();
  }, []);

  async function syncStudents() {
    const q = query(collection(db, "/students"));
    const querySnapshot = await getDocs(q);
    const students = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { id: doc.id, ...data } as Student;
    });
    setStudents(students);

    onSnapshot(q, (query) => {
      const students = query.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data } as Student;
      });
      console.log("students", students);

      setStudents(students);
    });
  }

  function getStudentById(id: string): Student | undefined {
    return students?.find((student) => student.id == id);
  }

  return { students, getStudentById };
}
