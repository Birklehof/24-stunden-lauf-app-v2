import { useState } from 'react';
import Head from '@/components/Head';
import Loading from '@/components/Loading';
import Icon from '@/components/Icon';
import { Lap, Runner } from '@/lib/interfaces';
import {
  assistantNavItems,
  themedErrorToast,
} from '@/lib/utils/';
import { deleteLap } from '@/lib/utils/firebase/frontend';
import ListItem from '@/components/ListItem';
import { AuthAction, useUser, withUser } from 'next-firebase-auth';
import Menu from '@/components/Menu';
import { getRunnersDict } from '@/lib/utils/firebase/backend';
import { functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';

export async function getStaticProps() {
  const runners = await getRunnersDict();

  return {
    props: {
      runners: JSON.parse(JSON.stringify(runners)),
    },
    revalidate: 60 * 10,
  };
}

function AssistantIndexPage({
  runners,
}: {
  runners: { [id: string]: Runner };
}) {
  const user = useUser();
  const [createdLaps, setCreatedLaps] = useState<Lap[]>([]);

  const [number, setNumber] = useState(0);

  const createLap = httpsCallable(functions, 'createLap');

  async function createNewLapHandler() {
    setNumber(0);

    await createLap({ number })
      .then((result) => {
        const newLap = result.data as Lap;

        // Add new lap to list
        setCreatedLaps([newLap, ...createdLaps]);
      })
      .catch((error) => {
        themedErrorToast(`[${number}] ${error.message}`, {
          position: 'bottom-center',
          autoClose: 3000,
          draggable: true,
          hideProgressBar: true,
        });
      });
  }

  async function deleteLapHandler(lapId: string) {
    await deleteLap(lapId)
      .then(() => {
        // Focus input field
        document.getElementById('number')?.focus();
        // Filer out deleted lap
        setCreatedLaps(createdLaps?.filter((lap) => lap.id !== lapId) || null);
      })
      .catch((error) => {
        themedErrorToast(error.message, {
          position: 'bottom-center',
          autoClose: 3000,
          draggable: true,
          hideProgressBar: true,
        });
      });
  }

  return (
    <>
      <Head title="Assistent" />
      <main className="main !py-0">
        <Menu navItems={assistantNavItems} signOut={user.signOut} />
        <div className="grid !h-screen w-full grid-cols-2 justify-around landscape:pl-10">
          <section className="flex flex-col items-center justify-center gap-2">
            <div className="card rounded-xl bg-base-100 shadow-xl">
              <div className="card-body p-2">
                <input
                  aria-label="Startnummer"
                  id="number"
                  name="number"
                  className={`font-serif input-bordered input rounded-box box-border h-full w-full max-w-[18rem] text-center text-5xl font-medium tracking-widest sm:text-9xl ${
                    Object.values(runners).find(
                      (runner) => runner.number == number
                    ) != undefined
                      ? 'input-success'
                      : 'input-error'
                  }`}
                  autoFocus
                  onChange={(e) => {
                    e.preventDefault();
                    if (!isNaN(+e.target.value)) {
                      setNumber(+e.target.value);
                    }
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      await createNewLapHandler();
                    }
                  }}
                  type="text"
                  value={Number(number).toString()}
                  min={0}
                  required
                  inputMode="numeric"
                />
              </div>
            </div>
            <div className="w-full text-center text-sm">
              Drücke <kbd className="kbd kbd-sm bg-neutral">Enter</kbd>, um eine
              Runde zu zählen
            </div>
          </section>
          <section className="vertical-list !flex">
            {createdLaps.length > 0 ? (
              <>
                {createdLaps
                  .sort((a, b) => {
                    return (
                      // @ts-ignore
                      b.createdAt - a.createdAt
                    );
                  })
                  .map((lap) => (
                    <ListItem
                      key={lap.id + lap.createdAt}
                      glass={lap.id === 'temp'}
                      number={runners[lap.runnerId]?.number}
                      mainContent={runners[lap.runnerId]?.name || 'Unbekannt'}
                    >
                      <button
                        disabled={!lap.id}
                        className="btn-outline btn-error btn-square btn-sm btn hidden text-error md:flex"
                        aria-label="Runde löschen"
                        onClick={async () => await deleteLapHandler(lap.id)}
                      >
                        <Icon name="TrashIcon" />
                      </button>
                    </ListItem>
                  ))}
                <div className="w-full text-center text-sm">
                  Zuletzt erstellte Runden
                </div>
              </>
            ) : (
              <div className="w-full text-center text-sm">
                Du hast noch keine Runden gezählt
              </div>
            )}
          </section>
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
})(AssistantIndexPage);
