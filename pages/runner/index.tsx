import useAuth from '@/lib/hooks/useAuth';
import Loading from '@/components/Loading';
import Head from '@/components/Head';
import NewLapOverlay from '@/components/NewLapOverlay';
import useRunner from '@/lib/hooks/useRunner';
import useRemoteConfig from '@/lib/hooks/useRemoteConfig';
import { useEffect } from 'react';
import router from 'next/router';
import { themedErrorToast } from '@/lib/utils';

export default function RunnerIndex() {
  const { isLoggedIn, logout } = useAuth();
  const { runner, lapCount, position } = useRunner();
  const { distancePerLap } = useRemoteConfig();

  useEffect(() => {
    // If the runner does not exist, logout and redirect to login
    if (runner === null) {
      themedErrorToast('Dein Account ist nicht als Läufer registriert');
      logout();
      router.push('/');
      return;
    }
  }, [runner]);

  // While loading, show loading screen
  if (!isLoggedIn) {
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
              {runner ? (
              <h1 className="text-center text-3xl font-bold sm:text-5xl">
                <div className="inline text-base-300">
                  {'0'.repeat(3 - runner.number.toString().length)}
                </div>
                {runner.number.toString()}
              </h1>) : (
                <span className="loading loading-dots loading-lg" />
              )}
              <h2 className="text-base-400 text-center text-sm font-bold opacity-80 sm:text-xl">
                Nr.
              </h2>
            </div>
            <div className="divider divider-vertical lg:divider-horizontal" />
            <div>
              {lapCount !== undefined ? (
              <h1 className="text-center text-3xl font-bold sm:text-5xl">
                <div className="inline text-base-300">
                  {'0'.repeat(3 - lapCount.toString().length)}
                </div>
                {lapCount}
              </h1> ) : (
                <span className="loading loading-dots loading-lg" />
              )}
              <h2 className="text-base-400 text-center text-sm font-bold opacity-80 sm:text-xl">
                {lapCount === 1 ? 'Runde' : 'Runden'}
              </h2>
            </div>
            <div className="divider divider-vertical lg:divider-horizontal" />
            <div>
              <h1 className="text-center text-3xl font-bold sm:text-5xl">
                {position !== undefined ? (
                  <>
                    <div className="inline text-base-300">
                      {'0'.repeat(3 - position.toString().length)}
                    </div>
                    {position}
                  </>
                ) : (
                  <span className="loading loading-dots loading-lg" />
                )}
              </h1>
              <h2 className="text-base-400 text-center text-sm font-bold opacity-80 sm:text-xl">
                Platz
              </h2>
            </div>
            <div className="divider divider-vertical lg:divider-horizontal" />
            <div>
                {lapCount !== undefined ? (
                  <h1 className="text-center text-3xl font-bold sm:text-5xl">
                {((lapCount * distancePerLap) / 1000).toFixed(
                  (lapCount * distancePerLap) / 1000 < 10
                    ? 2
                    : (lapCount * distancePerLap) / 1000 < 100
                    ? 1
                    : 0
                )}
              </h1>) : (
                <span className="loading loading-dots loading-lg" />
              )}
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
