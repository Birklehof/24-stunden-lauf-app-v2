import useAuth from "../../hooks/useAuth";
import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
  onSnapshot,
} from "@firebase/firestore";
import { app, db } from "../../firebase";
import { useEffect, useState } from "react";
import { type Runner } from "../../interfaces/runner";
import Loading from "../../components/Loading";
import Head from "../../components/Head";
import { getRemoteConfig, getString } from "firebase/remote-config";
import RunnerMenu from "../../components/RunnerMenu";
import NewLapOverlay from "../../components/NewLapOverlay";

export default function Runner() {
  const { isLoggedIn, user } = useAuth();
  const [laps, setLaps] = useState<number>(0);
  const [position, setPosition] = useState(0);
  const [distancePerLap, setDistancePerLap] = useState(660);
  const [runner, setRunner] = useState<Runner | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      return;
    }
    setDistancePerLap(
      parseFloat(getString(getRemoteConfig(app), "distancePerLap"))
    );
    getRunner().catch((error) => {
      console.log("Error getting documents: ", error);
    });
  }, [isLoggedIn, user]);

  async function getRunner() {
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
  }

  async function getLapCount(runnerId: string) {
    const q = query(collection(db, "laps"), where("runnerId", "==", runnerId));
    const lapCount = await getCountFromServer(q);
    setLaps(lapCount.data().count);

    onSnapshot(q, (query) => {
      setLaps(query.docs.length);
    });
  }

  if (!isLoggedIn || !user || !runner) {
    return <Loading />;
  }

  return (
    <>
      <Head title="Läufer" />
      <main className="hero min-h-screen bg-base-200">
        <NewLapOverlay laps={laps} />
        <RunnerMenu />
        <div className="flex w-full justify-center">
          <div className="flex flex-col lg:flex-row lg:justify-evenly lg:w-1/2">
            <div>
              <h1 className="text-5xl text-center font-bold">
                {runner.number}
              </h1>
              <h2 className="text-xl text-center font-bold text-gray-500">
                Startnummer
              </h2>
            </div>
            <div className="divider divider-vertical lg:divider-horizontal" />
            <div>
              <h1 className="text-5xl text-center font-bold">{laps}</h1>
              <h2 className="text-xl text-center font-bold text-gray-500">
                {laps === 1 ? "Runde" : "Runden"}
              </h2>
            </div>
            <div className="divider divider-vertical lg:divider-horizontal" />
            <div>
              <h1 className="text-5xl text-center font-bold">{position}</h1>
              <h2 className="text-xl text-center font-bold text-gray-500">
                Platz
              </h2>
            </div>
            <div className="divider divider-vertical lg:divider-horizontal" />
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
      </main>
    </>
  );
}
