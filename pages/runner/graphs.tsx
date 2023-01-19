import useAuth from "lib/hooks/useAuth";
import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
} from "@firebase/firestore";
import { db } from "lib/firebase";
import { useEffect, useState } from "react";
import { type Runner } from "lib/interfaces/runner";
import router from "next/router";
import Link from "next/link";
import Loading from "components/Loading";
import Head from "components/Head";
import RunnerMenu from "components/RunnerMenu";

export default function Runner() {
  const { isLoggedIn, user, logout } = useAuth();
  const [laps, setLaps] = useState(0);
  const [runner, setRunner] = useState<Runner | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      return;
    }
    getRunner().catch((error) => {
      console.log("Error getting documents: ", error);
    });
  }, [isLoggedIn, user]);

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

  if (!isLoggedIn || !user || !runner) {
    return <Loading />;
  }

  return (
    <>
      <Head title="Läufer Details" />
      <main className="hero flex flex-col min-h-screen bg-base-200">
        <RunnerMenu />
        {/*
        Show detailed information about the runner
        - number of laps over time (graph)
        - number of laps in reference to the time of day (graph)
        - progress towards different goals (like in houses or groups)
        */}
      </main>
    </>
  );
}
