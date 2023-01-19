import useAuth from "lib/hooks/useAuth";
import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
} from "@firebase/firestore";
import { app, db } from "lib/firebase";
import { useEffect, useState } from "react";
import { type Runner } from "lib/interfaces/runner";
import Loading from "components/Loading";
import Head from "components/Head";
import RunnerMenu from "components/RunnerMenu";
import useRemoteConfig from "lib/hooks/useRemoteConfig";
import useRunner from "lib/hooks/useRunner";

export default function Runner() {
  const { isLoggedIn, user } = useAuth();
  const { runner } = useRunner();
  const { gradeLevels, houses, distancePerLap } = useRemoteConfig();
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
    const q = query(collection(db, "/apps/24-stunden-lauf/runners"));
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
    const q = query(
      collection(db, "/apps/24-stunden-lauf/laps"),
      where("runnerId", "==", runnerId)
    );
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
        <RunnerMenu />
        <div className="my-10 w-full max-w-2xl mx-3">
          <div className="form-control">
            <div className="input-group input-group-sm">
              <div className="flex flex-row gap-3 w-full">
                <select className="select select-bordered select-sm grow">
                  <option value={""}>Klasse</option>
                  {gradeLevels.map((gradeLevel) => (
                    <option key={gradeLevel}>{gradeLevel}</option>
                  ))}
                </select>
                <select className="select select-bordered select-sm grow">
                  <option value={""}>Haus</option>
                  {houses.map((house) => (
                    <option key={house}>{house}</option>
                  ))}
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
