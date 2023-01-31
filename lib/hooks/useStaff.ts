import { useEffect, useState } from "react";
import { collection, query, getDocs, onSnapshot } from "@firebase/firestore";
import { db } from "lib/firebase";
import Staff from "lib/interfaces/staff";

export default function useStudents() {
  const [staff, setStaff] = useState<{ [id: string]: Staff }>({});

  useEffect(() => {
    syncStudents();
  }, []);

  async function syncStudents() {
    const q = query(collection(db, "/staff"));
    const querySnapshot = await getDocs(q);
    const new_staff: { [id: string]: Staff } = {};
    const staff = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const new_staff_member = { id: doc.id, ...data } as Staff;
      new_staff[doc.id] = new_staff_member;
    });
    setStaff(new_staff);

    onSnapshot(q, (querySnapshot) => {
      const new_staff: { [id: string]: Staff } = {};
      const staff = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const new_staff_member = { id: doc.id, ...data } as Staff;
        new_staff[doc.id] = new_staff_member;
      });
      setStaff(new_staff);
    });
  }

  return { staff };
}
