import useAuth from '@/lib/hooks/useAuth';
import Loading from '@/components/Loading';
import Head from '@/components/Head';
import NewLapOverlay from '@/components/NewLapOverlay';
import useRunner from '@/lib/hooks/useRunner';
import useRemoteConfig from '@/lib/firebase/useRemoteConfig';
import { useEffect } from 'react';
import router from 'next/router';
import { themedErrorToast } from '@/lib/utils';
import RunnerStat from '@/components/Runner/RunnerStat';
import { defaultDistancePerLap } from '@/lib/firebase/remoteConfigDefaultValues';

export default function RunnerIndex() {
  const { isLoggedIn, logout } = useAuth();
  const { runner, lapCount, position } = useRunner();
  const [distancePerLap] = useRemoteConfig('distancePerLap', defaultDistancePerLap);

  useEffect(() => {
    // If the runner does not exist, logout and redirect to login
    if (runner === null) {
      themedErrorToast('Dein Account ist nicht als Läufer registriert');
      logout();
      router.push('/');
      return;
    }
  }, [runner, logout]);

  // While loading, show loading screen
  if (!isLoggedIn) {
    return <Loading />;
  }

  return (
    <>
      <Head title="Läufer" />
      <main className="hero min-h-screen bg-base-200">
        <NewLapOverlay />
        <div className="flex flex-col landscape:flex-row gap-3 mb-10 landscape:mb-0">
          <RunnerStat value={runner?.number} label="Nr." />
          <div className="divider divider-vertical landscape:divider-horizontal my-0" />
          <RunnerStat value={lapCount} label="Runden" />
          <div className="divider divider-vertical landscape:divider-horizontal my-0" />
          <RunnerStat value={position} label="Platz" />
          <div className="divider divider-vertical landscape:divider-horizontal my-0" />
          <RunnerStat
            value={
              lapCount &&
              ((lapCount * distancePerLap) / 1000).toFixed(
                (lapCount * distancePerLap) / 1000 < 10
                  ? 2
                  : (lapCount * distancePerLap) / 1000 < 100
                  ? 1
                  : 0
              )
            }
            label="km"
          />
        </div>
      </main>
    </>
  );
}
