import useAuth from '@/lib/hooks/useAuth';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Head from '@/components/Head';
import NewLapOverlay from '@/components/NewLapOverlay';
import useRunner from '@/lib/hooks/useRunner';
import useRemoteConfig from '@/lib/hooks/useRemoteConfig';
import { getRunnerPosition } from '@/lib/firebase/frontendUtils';

export default function RunnerIndex() {
  const { isLoggedIn, user } = useAuth();
  const { runner, lapCount } = useRunner();
  const { distancePerLap } = useRemoteConfig();
  const [position, setPosition] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!runner || lapCount == 0) {
      return;
    }

    getRunnerPosition({
      ...runner,
      lapCount,
    }).then((position) => {
      setPosition(position);
    });
  }, [runner, lapCount]);


  if (!user || !runner) {
    return <Loading />;
  }

  return (
    <>
      <Head title="Läufer" />
      <main className="hero min-h-screen bg-base-200">
        <NewLapOverlay />
        <div className="flex w-full justify-center pb-20 lg:pb-0">
          <div className="flex flex-col lg:w-1/2 lg:flex-row lg:justify-evenly">
            <div>
              <h1 className="text-center text-3xl font-bold sm:text-5xl">
                <div className="inline text-base-300">
                  {'0'.repeat(3 - runner.number.toString().length)}
                </div>
                {runner.number.toString()}
              </h1>
              <h2 className="text-base-400 text-center text-sm font-bold opacity-80 sm:text-xl">
                Nr.
              </h2>
            </div>
            <div className="divider divider-vertical lg:divider-horizontal" />
            <div>
              <h1 className="text-center text-3xl font-bold sm:text-5xl">
                <div className="inline text-base-300">
                  {'0'.repeat(3 - lapCount.toString().length)}
                </div>
                {lapCount}
              </h1>
              <h2 className="text-base-400 text-center text-sm font-bold opacity-80 sm:text-xl">
                {lapCount === 1 ? 'Runde' : 'Runden'}
              </h2>
            </div>
            <div className="divider divider-vertical lg:divider-horizontal" />
            <div>
              <h1 className="text-center text-3xl font-bold sm:text-5xl">
                {position ? (
                  <>
                    <div className="inline text-base-300">
                      {'0'.repeat(3 - position.toString().length)}
                    </div>
                    {position}
                  </>
                ) : (
                  <div className="inline text-base-300">000</div>
                )}
              </h1>
              <h2 className="text-base-400 text-center text-sm font-bold opacity-80 sm:text-xl">
                Platz
              </h2>
            </div>
            <div className="divider divider-vertical lg:divider-horizontal" />
            <div>
              <h1 className="text-center text-3xl font-bold sm:text-5xl">
                {((lapCount * distancePerLap) / 1000).toFixed(
                  (lapCount * distancePerLap) / 1000 < 10
                    ? 2
                    : (lapCount * distancePerLap) / 1000 < 100
                    ? 1
                    : 0
                )}
              </h1>
              <h2 className="text-base-400 text-center text-sm font-bold opacity-80 sm:text-xl">
                km
              </h2>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
