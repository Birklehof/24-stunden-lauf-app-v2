import useAuth from "lib/hooks/useAuth";
import { app, db } from "lib/firebase";
import { useEffect, useState } from "react";
import { type Runner } from "lib/interfaces/runner";
import Loading from "components/Loading";
import Head from "components/Head";
import { getRemoteConfig, getString } from "firebase/remote-config";
import RunnerMenu from "components/RunnerMenu";
import NewLapOverlay from "components/NewLapOverlay";
import useRunner from "lib/hooks/useRunner";

export default function Runner() {
  const { isLoggedIn, user } = useAuth();
  const { runner, laps, position } = useRunner();
  const [distancePerLap, setDistancePerLap] = useState(660);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      return;
    }
    setDistancePerLap(
      parseFloat(getString(getRemoteConfig(app), "distancePerLap"))
    );
  }, [isLoggedIn, user]);

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
                {((laps * distancePerLap) / 1000).toFixed(2)}
              </h1>
              <h2 className="text-xl text-center font-bold text-gray-500">
                km
              </h2>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
