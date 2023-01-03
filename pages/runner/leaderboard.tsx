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
import Menu from "../../components/Menu";
import Icon from "../../components/Icon";

export default function Runner() {
  const { isLoggedIn, user } = useAuth();
  const [distancePerLap, setDistancePerLap] = useState(100);
  const [runners, setRunners] = useState<Runner[] | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      return;
    }
    getRunners()
      .then((runners) => {
        setRunners(runners);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [isLoggedIn, user]);

  async function getRunners(): Promise<Runner[]> {
    const q = query(collection(db, "runners"));
    const querySnapshot = await getDocs(q);
    const runners = querySnapshot.docs.map(async (doc) => {
      const id = doc.id;
      const data = doc.data();
      const runner = { id, ...data } as Runner;
      runner.lapCount = await getLapCount(id);
      return runner;
    });
    const runnersWithLapCount = await Promise.all(runners);
    return runnersWithLapCount;
  }

  async function getLapCount(runnerId: string): Promise<number> {
    const q = query(collection(db, "laps"), where("runnerId", "==", runnerId));
    const lapCount = await getCountFromServer(q);
    return lapCount.data().count;
  }

  if (!isLoggedIn || !user || !runners) {
    return <Loading />;
  }

  return (
    <>
      <Head title="Läufer" />
      <main className="hero flex flex-col min-h-screen bg-base-200">
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
        <div className="my-10 w-full max-w-2xl mx-3">
          <div className="form-control">
            <div className="input-group input-group-sm">
              <div className="flex flex-row gap-3 w-full">
                <select className="select select-bordered select-sm grow">
                  <option selected value={""}>
                    Klasse
                  </option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10A</option>
                  <option>10B</option>
                  <option>10C</option>
                  <option>Q1</option>
                  <option>Q2</option>
                </select>
                <select className="select select-bordered select-sm grow">
                  <option selected value={""}>
                    Haus
                  </option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10A</option>
                  <option>10B</option>
                  <option>10C</option>
                  <option>Q1</option>
                  <option>Q2</option>
                </select>
                <input
                  type="text"
                  placeholder="Name"
                  className="input input-bordered input-sm grow"
                />
                <button className="btn btn-sm btn-primary">Suchen</button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col max-w-2xl justify-center">
          <div className="flex flex-col w-full gap-3">
            {runners.map((runner, position) => (
              <div className="stats shadow" key={runner.id}>
                <div className="stat">
                  <div className="stat-title">Startnummer</div>
                  <div className="stat-value text-center">{runner.number}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Name</div>
                  <div className="stat-value">{runner.name}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">
                    {runner.lapCount == 1 ? "Runde" : "Runden"}
                  </div>
                  <div className="stat-value text-center">
                    {runner.lapCount}
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-title">Platz</div>
                  <div className="stat-value text-center">{position}.</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Strecke</div>
                  <div className="stat-value text-center">
                    {runner.lapCount || 0 * distancePerLap}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
