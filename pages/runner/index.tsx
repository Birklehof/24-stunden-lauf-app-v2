import Loading from '@/components/Loading';
import Head from '@/components/Head';
import NewLapOverlay from '@/components/NewLapOverlay';
import useRemoteConfig from '@/lib/firebase/useRemoteConfig';
import Stat from '@/components/Stat';
import { defaultDistancePerLap } from '@/lib/firebase/remoteConfigDefaultValues';
import { getRunner } from '@/lib/utils/firebase/backend';
import { Runner } from '@/lib/interfaces';
import { AuthAction, useUser, withUser, withUserSSR } from 'next-firebase-auth';
import { getPosition, syncLapCount } from '@/lib/utils/firebase/frontend';
import { useEffect, useState } from 'react';
import Menu from '@/components/Menu';
import { runnerNavItems } from '@/lib/utils/';
import StatDivider from '@/components/StatDivider';

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
  const user = useUser();

  const [lapCount, setLapCount] = useState<number | undefined>(undefined);
  const [position, setPosition] = useState<number | undefined>(undefined);

  const [distancePerLap] = useRemoteConfig(
    'distancePerLap',
    defaultDistancePerLap
  );

  useEffect(() => {
    if (!runner.id) {
      return;
    }
    syncLapCount(runner.id, setLapCount);
  }, [runner]);

  useEffect(() => {
    if (!lapCount) {
      return;
    }

    getPosition(lapCount).then((position) => {
      setPosition(position);
    });
  }, [lapCount]);

  return (
    <>
      <Head title="Läufer" />
      <main className="hero min-h-screen bg-base-200 pb-16">
        <Menu navItems={runnerNavItems} signOut={user.signOut} />
        <NewLapOverlay lapCount={lapCount} />
        <div className="flex flex-col gap-x-3 gap-y-5 landscape:mb-0 landscape:flex-row">
          <Stat value={runner?.number} label="Nr." />
          <StatDivider />
          <Stat value={lapCount} label="Runden" />
          <StatDivider />
          <Stat value={position} label="Platz" />
          <StatDivider />
          <Stat
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
