import Loading from '@/components/Loading';
import Head from '@/components/Head';
import NewLapOverlay from '@/components/NewLapOverlay';
import useRemoteConfig from '@/lib/firebase/useRemoteConfig';
import RunnerStat from '@/components/Runner/RunnerStat';
import { defaultDistancePerLap } from '@/lib/firebase/remoteConfigDefaultValues';
import { getRunner } from '@/lib/utils/firebase/backend';
import { Runner } from '@/lib/interfaces';
import { AuthAction, withUser, withUserSSR } from 'next-firebase-auth';
import { db } from '@/lib/firebase';
import { getPosition } from '@/lib/utils/firebase/frontend';
import {
  query,
  collection,
  where,
  getCountFromServer,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export const getServerSideProps = withUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  // @ts-ignore
})(async ({ user }) => {
  // Get the user with the email
  if (user && user.email) {
    const runner = await getRunner(user.email);
    return {
      props: {
        runner,
      },
    };
  }

  return {
    props: {
      runner: null,
    },
  };
});

function RunnerIndexPage({ runner }: { runner: Runner }) {
  const [lapCount, setLapCount] = useState<number | undefined>(undefined);
  const [position, setPosition] = useState<number | undefined>(undefined);

  const [distancePerLap] = useRemoteConfig(
    'distancePerLap',
    defaultDistancePerLap
  );

  useEffect(() => {
    console.log(runner);
    if (!runner.id) {
      return;
    }
    syncLapCount(runner.id);
  }, [runner]);

  useEffect(() => {
    if (!lapCount) {
      return;
    }

    getPosition(lapCount).then((position) => {
      setPosition(position);
    });
  }, [lapCount]);

  async function syncLapCount(runnerId: string) {
    const lapCountQuery = query(
      collection(db, '/apps/24-stunden-lauf/laps'),
      where('runnerId', '==', runnerId)
    );
    const lapCountSnapshot = await getCountFromServer(lapCountQuery);
    const lapCount = lapCountSnapshot.data().count || 0;
    console.log(lapCount);
    setLapCount(lapCount);

    onSnapshot(lapCountQuery, (snapshot) => {
      setLapCount(snapshot.docs.length);
    });
  }

  return (
    <>
      <Head title="Läufer" />
      <main className="hero min-h-screen bg-base-200">
        <NewLapOverlay lapCount={lapCount} />
        <div className="mb-10 flex flex-col gap-x-3 gap-y-5 landscape:mb-0 landscape:flex-row">
          <RunnerStat value={runner?.number} label="Nr." />
          <div className="divider divider-vertical my-0 landscape:divider-horizontal" />
          <RunnerStat value={lapCount} label="Runden" />
          <div className="divider divider-vertical my-0 landscape:divider-horizontal" />
          <RunnerStat value={position} label="Platz" />
          <div className="divider divider-vertical my-0 landscape:divider-horizontal" />
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

export default withUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Loading,
  // @ts-ignore
})(RunnerIndexPage);
