import useAuth from "@/lib/hooks/useAuth";
import { useEffect } from "react";
import Loading from "@/components/Loading";
import Head from "@/components/Head";
import NewLapOverlay from "@/components/NewLapOverlay";
import useRunner from "@/lib/hooks/useRunner";
import useRemoteConfig from "@/lib/hooks/useRemoteConfig";
import useRanking from "@/lib/hooks/useRanking";

export default function RunnerIndex() {
  const { isLoggedIn, user } = useAuth();
  const { runner, laps } = useRunner();
  const { getPosition } = useRanking();
  const { distancePerLap } = useRemoteConfig();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  console.log(laps);

  if (!user || !runner || laps == undefined) {
    return <Loading />;
  }

  return (
    <>
      <Head title="Läufer" />
      <main className="hero min-h-screen bg-base-200">
        <NewLapOverlay />
        <div className="flex w-full justify-center pb-20 lg:pb-0">
          <div className="flex flex-col lg:flex-row lg:justify-evenly lg:w-1/2">
            <div>
              <h1 className="text-3xl sm:text-5xl text-center font-bold">
                <div className="inline text-base-300">
                  {"0".repeat(3 - runner.number.toString().length)}
                </div>
                {runner.number.toString()}
              </h1>
              <h2 className="text-sm sm:text-xl text-center font-bold text-base-400 opacity-80">
                Nr.
              </h2>
            </div>
            <div className="divider divider-vertical lg:divider-horizontal" />
            <div>
              <h1 className="text-3xl sm:text-5xl text-center font-bold">
                <div className="inline text-base-300">
                  {"0".repeat(3 - laps.toString().length)}
                </div>
                {laps}
              </h1>
              <h2 className="text-sm sm:text-xl text-center font-bold text-base-400 opacity-80">
                {laps === 1 ? "Runde" : "Runden"}
              </h2>
            </div>
            <div className="divider divider-vertical lg:divider-horizontal" />
            <div>
              <h1 className="text-3xl sm:text-5xl text-center font-bold">
                <div className="inline text-base-300">
                  {"0".repeat(3 - getPosition(runner).toString().length)}
                </div>
                {getPosition(runner)}
              </h1>
              <h2 className="text-sm sm:text-xl text-center font-bold text-base-400 opacity-80">
                Platz
              </h2>
            </div>
            <div className="divider divider-vertical lg:divider-horizontal" />
            <div>
              <h1 className="text-3xl sm:text-5xl text-center font-bold">
                {((laps * distancePerLap) / 1000).toFixed(
                  (laps * distancePerLap) / 1000 < 10
                    ? 2
                    : (laps * distancePerLap) / 1000 < 100
                    ? 1
                    : 0
                )}
              </h1>
              <h2 className="text-sm sm:text-xl text-center font-bold text-base-400 opacity-80">
                km
              </h2>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
