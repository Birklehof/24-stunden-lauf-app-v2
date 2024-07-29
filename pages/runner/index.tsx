import Loading from '@/components/Loading';
import Head from '@/components/Head';
import NewLapOverlay from '@/components/NewLapOverlay';
import useRemoteConfig from '@/lib/firebase/useRemoteConfig';
import Stat from '@/components/Stat';
import { defaultDistancePerLap } from '@/lib/firebase/remoteConfigDefaultValues';
import { getRunner } from '@/lib/utils/firebase/backend';
import { Runner } from '@/lib/interfaces';
import { AuthAction, withUser, withUserSSR } from 'next-firebase-auth';
import { syncLapCount } from '@/lib/utils/firebase/frontend';
import { useEffect, useState } from 'react';
import Menu from '@/components/Menu';
import {
  formatKilometer,
  runnerNavItems,
  themedErrorToast,
} from '@/lib/utils/';
import MenuPlaceholder from '@/components/MenuPlaceholder';

export const getServerSideProps = withUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  // @ts-ignore
})(async ({ user }) => {
  if (!user?.email) {
    return {
      props: {
        runner: null,
      },
    };
  }

  return await getRunner(user?.email)
    .then((runner) => {
      return {
        props: {
          runner,
        },
      };
    })
    .catch(() => {
      return {
        props: {
          runner: null,
        },
      };
    });
});

function RunnerIndexPage({ runner }: { runner: Runner | null }) {
  const [lapCount, setLapCount] = useState<number | undefined>(undefined);
  const [newGoal, setNewGoal] = useState<string>('20');

  const [distancePerLap] = useRemoteConfig(
    'distancePerLap',
    defaultDistancePerLap
  );

  useEffect(() => {
    if (!runner?.id) {
      return;
    }

    syncLapCount(runner.id, setLapCount);
  }, [runner]);

  async function setGoalHandler(newGoal: number) {
    // Make a post request to set the goal
    await fetch('/api/runner/set-goal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goal: newGoal,
      }),
    })
      .then(() => {
        // Reload the page
        window.location.reload();
      })
      .catch((error) => {
        themedErrorToast(error.message);
      });
  }

  if (!runner?.id) {
    return <Loading />;
  }

  if (!runner?.goal) {
    return (
      <>
        <Head title="Läufer" />
        <main className="hero h-full bg-base-100">
          <NewLapOverlay lapCount={lapCount} />
          <div className="flex max-w-md flex-col gap-4 p-8">
            <h1 className="text-2xl font-bold">
              Willkommen zum 24 Stunden Lauf!
            </h1>
            <p>
              Wir freuen uns, dass du dieses Jahr dabei bist. Bevor es losgeht,
              kannst du hier angeben, wie viele Runden du laufen möchtest.
            </p>
            <input
              className="input-bordered input"
              type="number"
              value={newGoal}
              inputMode="numeric"
              min={0}
              onChange={(e) => setNewGoal(e.target.value)}
            />
            <button
              className="btn-primary btn"
              disabled={Number.isNaN(parseInt(newGoal))}
              onClick={() => setGoalHandler(parseInt(newGoal))}
            >
              Los geht&apos;s!
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head title="Läufer" />

      <Menu navItems={runnerNavItems} />

      <NewLapOverlay lapCount={lapCount} />

      <main>
        <div className="m-auto grid h-fit max-w-xl grid-cols-1 gap-10 landscape:grid-cols-3">
          <Stat value={runner?.number} label="Nr." />
          <Stat value={lapCount} label="Runden" />
          <Stat
            value={lapCount && formatKilometer(lapCount * distancePerLap)}
            label="km"
          />
        </div>

        <MenuPlaceholder />
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
