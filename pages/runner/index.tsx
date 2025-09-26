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
          runner: {...runner, goal: runner.goal || null},
        },
      };
    })
    .catch(() => {
      return {
        redirect: {
          destination: '/runner-not-found',
          permanent: false,
        },
      };
    });
});

function RunnerIndexPage({ runner }: { runner: Runner | null }) {
  const [lapCount, setLapCount] = useState<number | undefined>(undefined);
  const [newGoal, setNewGoal] = useState<string>('40');

  const [distancePerLap] = useRemoteConfig(
    'distancePerLap',
    defaultDistancePerLap
  );

  useEffect(() => {
    if (!runner?.id) {
      return;
    }

    if (!runner?.goal) {
      // Show set goal dialog
      console.log('No goal set, showing dialog');
      const goalDialog = document.getElementById('set_goal') as HTMLDialogElement;
      if (goalDialog) {
        goalDialog.showModal();
      }
    }

    syncLapCount(runner.id, setLapCount);
  }, [runner]);

  if (!runner?.id) {
    return <Loading />;
  }

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

  return (
    <>
      <Head title="Läufer" />

      <Menu navItems={runnerNavItems} />

      <NewLapOverlay lapCount={lapCount} />

      <dialog id="set_goal" className="modal">
        <div className="modal-box flex flex-col border-base-300 rounded-box border p-6 gap-4">
          <h1 className="text-4xl font-bold">
            Willkommen zum 24-Stunden-Lauf!
          </h1>
          <p className="text-lg">
            Wir freuen uns, dass du dabei bist! Bevor es losgeht, gib hier{' '}
            <b>dein Rundenziel</b> ein:
          </p>
          <input
            className="input-bordered w-full input input-lg py-14 text-center text-7xl! font-mono"
            type="number"
            value={newGoal}
            inputMode="numeric"
            min={0}
            onChange={(e) => setNewGoal(e.target.value)}
          />
          <button
            className="btn-primary btn-lg btn w-full"
            disabled={Number.isNaN(parseInt(newGoal))}
            onClick={() => setGoalHandler(parseInt(newGoal))}
          >
            Los geht&apos;s!
          </button>
        </div>
        <div className="modal-backdrop" />
      </dialog>

      <main className="flex items-center">
        <div className="m-auto grid h-fit max-w-xl grid-cols-1 gap-14 landscape:grid-cols-3">
          <Stat value={runner?.number} label="Startnummer" />
          <Stat value={lapCount} label="B'Hof-Runden" />
          <Stat
            value={
              lapCount &&
              formatKilometer(lapCount * distancePerLap)
                .toString()
                .replace('.', ',')
            }
            label="Strecke in km"
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
