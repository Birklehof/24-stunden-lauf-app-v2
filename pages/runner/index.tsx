import useAuth from "../../hooks/useAuth";
import { collection, query, where, getDocs } from "@firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

interface Runner {
  uid: string;
  number: number;
  firstName: string;
  lastName: string;
  studentId: string;
}

export default function Runner() {
  const { isLoggedIn, user } = useAuth();
  const [laps, setLaps] = useState(0);
  const [runner, setRunner] = useState<Runner>();

  useEffect(() => {
    console.log("useEffect");
    if (!isLoggedIn || !user) {
      return;
    }
    getLapCount().catch((error) => {
      console.log("Error getting documents: ", error);
    });
    getRunnerData().catch((error) => {
      console.log("Error getting documents: ", error);
    });
  }, [isLoggedIn, user]);

  if (!isLoggedIn || !user) {
    return (
      <>
        <main>
          <h1>Account</h1>
          <p>Loading ...</p>
        </main>
      </>
    );
  }

  const getLapCount = async () => {
    const q = query(collection(db, "laps"), where("uid", "==", user?.uid));
    const querySnapshot = await getDocs(q);
    setLaps(querySnapshot.size);
  };

  const getRunnerData = async () => {
    const q = query(collection(db, "runners"), where("uid", "==", user?.uid));
    const querySnapshot = await getDocs(q);
    const runner = querySnapshot.docs[0].data() as Runner;
    setRunner(runner);
  };

  return (
    <>
      <main>
        <h1>Runner</h1>
        <div>
          <p>Number: {runner?.number}</p>
          <p>First Name: {runner?.firstName}</p>
          <p>Last Name: {runner?.lastName}</p>
          <p>Student ID: {runner?.studentId}</p>
          <p>Laps: {laps}</p>
        </div>
      </main>
    </>
  );
}
