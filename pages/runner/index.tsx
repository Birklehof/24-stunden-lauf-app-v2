import useAuth from "../../hooks/useAuth";
import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
} from "@firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import { type Runner } from "../../interfaces/runner";

export default function Runner() {
  const { isLoggedIn, user, logout } = useAuth();
  const [laps, setLaps] = useState(0);
  const [runner, setRunner] = useState<Runner>();

  useEffect(() => {
    if (!isLoggedIn || !user) {
      return;
    }
    getRunner().catch((error) => {
      console.log("Error getting documents: ", error);
    });
  }, [isLoggedIn, user]);

  if (!isLoggedIn || !user) {
    return (
      <>
        <main>
          <h1>Runner</h1>
          <p>Loading ...</p>
        </main>
      </>
    );
  }

  const getRunner = async () => {
    const q = query(
      collection(db, "runners"),
      where("email", "==", user?.email)
    );
    const querySnapshot = await getDocs(q);
    const id = querySnapshot.docs[0].id;
    getLapCount(id);
    const data = querySnapshot.docs[0].data();
    const runner = { id, ...data } as Runner;
    await setRunner(runner);
  };

  const getLapCount = async (runnerId: string) => {
    const q = query(collection(db, "laps"), where("runnerId", "==", runnerId));
    const lapCount = await getCountFromServer(q);
    setLaps(lapCount.data().count);
  };

  return (
    <>
      <main>
        <h1>Runner</h1>
        <div>
          <p>ID: {runner?.id}</p>
          <p>Number: {runner?.number}</p>
          <p>Name: {runner?.name}</p>
          {runner?.email && <p>Email: {runner?.email}</p>}
          {runner?.studentId && <p>Student ID: {runner?.studentId}</p>}
          <p>Laps: {laps}</p>
        </div>
        <div>
          <button onClick={() => logout()}>Logout</button>
        </div>
      </main>
    </>
  );
}
