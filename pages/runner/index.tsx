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
import Loading from "../../components/Loading";
import Head from "../../components/Head";
import Menu from "../../components/Menu";

export default function Runner() {
  const { isLoggedIn, user } = useAuth();
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
        <Menu
          navItems={[
            { name: "Start", href: "/runner", icon: "HomeIcon" },
            {
              name: "Leaderboard",
              href: "/runner/leaderboard",
              icon: "TrendingUpIcon",
            },
            { name: "Graphen", href: "/runner/graphs", icon: "ChartBarIcon" },
            { name: "Account", href: "/runner/account", icon: "UserIcon" },
          ]}
        />
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
