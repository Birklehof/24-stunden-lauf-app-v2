import { useState } from 'react';
import Head from '@/components/Head';
import Loading from '@/components/Loading';
import Icon from '@/components/Icon';
import { Lap, Runner } from '@/lib/interfaces';
import { assistantNavItems, themedErrorToast } from '@/lib/utils/';
import { deleteLap } from '@/lib/utils/firebase/frontend';
import ListItem from '@/components/ListItem';
import { AuthAction, withUser } from 'next-firebase-auth';
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
        console.error(error);
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
      <Head title="Helfer" />
      <Menu navItems={assistantNavItems} />

      <main className="flex flex-row justify-around">
        <div className="flex justify-center items-center w-fit">
          <fieldset className="fieldset border-base-300 rounded-box border p-4 h-fit">
            <legend className="fieldset-legend text-lg">Runde zählen</legend>
            <input
              aria-label="Startnummer"
              id="number"
              name="number"
              className={`font-mono input input-bordered box-border h-44 w-72 rounded-box text-center text-9xl font-medium ${
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
                  const number = +e.target.value;
                  if (number < 1000) {
                    setNumber(number);
                  }
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
            <div className="label text-xs">
              Drücke <kbd className="kbd kbd-xs">Enter</kbd>, um eine Runde zu
              zählen
            </div>
          </fieldset>
        </div>
        <ul className="list h-[calc(100vh-4rem)] overflow-y-scroll grow max-w-2/3">
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
                  <>
                    {/* Repeat 100 times */}
                    {[...Array(100)].map((_, i) => (
                      <ListItem
                        key={lap.id + lap.createdAt}
                        medals={false}
                        number={runners[lap.runnerId]?.number}
                        mainContent={(
                          runners[lap.runnerId]?.name || 'Unbekannt'
                        ).concat(
                          runners[lap.runnerId]?.class
                            ? ', '.concat(runners[lap.runnerId]?.class || '')
                            : ''
                        )}
                        secondaryContent={
                          new Date(lap.createdAt)
                            .toLocaleTimeString('de-DE')
                            .toString() + ' Uhr'
                        }
                      >
                        <button
                          disabled={!lap.id}
                          className="btn btn-circle btn-ghost btn-sm hidden text-error md:flex"
                          aria-label="Runde löschen"
                          onClick={async () => await deleteLapHandler(lap.id)}
                        >
                          <Icon name="TrashIcon" />
                        </button>
                      </ListItem>
                    ))}
                  </>
                ))}
              <li className="p-4 opacity-60 tracking-wide text-center">
                Zuletzt gezählte Runden
              </li>
            </>
          ) : (
            <li className="p-4 opacity-60 tracking-wide text-center">
              Noch keine Runden gezählt
            </li>
          )}
        </ul>
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
