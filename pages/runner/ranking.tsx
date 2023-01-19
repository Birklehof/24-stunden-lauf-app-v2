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
import useRanking from "lib/hooks/useRanking";

export default function Runner() {
  const { isLoggedIn, user } = useAuth();
  const { runner } = useRunner();
  const { runners, lapCountByRunnerId } = useRanking();
  const { gradeLevels, houses, distancePerLap } = useRemoteConfig();

  useEffect(() => {
    if (!isLoggedIn || !user) {
      return;
    }
  }, [isLoggedIn, user]);

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
            {lapCountByRunnerId.map((lapCountWithRunnerId, position) => (
              <div
                className="shadow bg-base-100 rounded-xl flex flex-row justify-between items-center"
                key={
                  runners.find(
                    (runner) => runner.id == lapCountWithRunnerId.runnerId
                  )?.id
                }
              >
                <div className="stat w-2/12">
                  <div className="stat-value text-center">
                    {(position + 1).toString().padStart(3, "0")}.
                  </div>
                </div>
                <div className="stat w-1/2">
                  <div className="stat-value">
                    {runners
                      .find(
                        (runner) => runner.id == lapCountWithRunnerId.runnerId
                      )
                      ?.name.padEnd(20, " ")}
                  </div>
                </div>
                <div className="stat w-2/12">
                  <div className="stat-value text-center">
                    {lapCountWithRunnerId.lapCount.toString().padStart(3, "0")}
                  </div>
                </div>
                <div className="stat w-2/12">
                  <div className="stat-value text-center">
                    {(
                      (lapCountWithRunnerId.lapCount * distancePerLap) /
                      1000
                    ).toFixed(2)}
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
