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
import Link from "next/link";
import Loading from "../../components/Loading";
import Head from "../../components/Head";
import router from "next/router";

export default function Runner() {
  const { isLoggedIn, user, logout } = useAuth();
  const [laps, setLaps] = useState(0);
  const [position, setPosition] = useState(0);
  const [distancePerLap, setDistancePerLap] = useState(100);
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
      <Head title="Läufer" />
      <main className="hero min-h-screen bg-base-200">
        <div className="flex w-full justify-center">
          <div className="flex flex-col md:flex-row md:justify-evenly md:w-2/3">
            <div>
              <h1 className="text-5xl text-center font-bold">
                {runner.number}
              </h1>
              <h2 className="text-xl text-center font-bold text-gray-500">
                Startnummer
              </h2>
            </div>
            <div className="divider divider-vertical md:divider-horizontal" />
            <div>
              <h1 className="text-5xl text-center font-bold">{laps}</h1>
              <h2 className="text-xl text-center font-bold text-gray-500">
                {laps === 1 ? "Runde" : "Runden"}
              </h2>
            </div>
            <div className="divider divider-vertical md:divider-horizontal" />
            <div>
              <h1 className="text-5xl text-center font-bold">{position}</h1>
              <h2 className="text-xl text-center font-bold text-gray-500">
                Platz
              </h2>
            </div>
            <div className="divider divider-vertical md:divider-horizontal" />
            <div>
              <h1 className="text-5xl text-center font-bold">
                {laps * distancePerLap}
              </h1>
              <h2 className="text-xl text-center font-bold text-gray-500">
                km gelaufen
              </h2>
            </div>
          </div>
        </div>
        {/* <h1>Läufer</h1>
        <div>
          <p>ID: {runner?.id}</p>
          <p>Number: {runner?.number}</p>
          <p>Name: {runner?.name}</p>
          {runner?.email && <p>Email: {runner?.email}</p>}
          {runner?.studentId && <p>Student ID: {runner?.studentId}</p>}
          <p>Laps: {laps}</p>
        </div> */}
        {/*
        <div> Next to each other
          <div>
            Laps
          </div>
          <div>
            Place
          </div>
          <div>
            Total distance
          </div>
          <div>
            Progress (e.g. progress towards a personal goal)
          </div>
        </div>
        */}
        {/* <div>
          <Link href={`/runner/detailed`}>Details</Link>
          <button onClick={() => logout()}>Logout</button>
        </div> */}
      </main>
    </>
  );
}
