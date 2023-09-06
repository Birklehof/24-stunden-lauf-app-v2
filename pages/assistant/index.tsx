import { useEffect, useState } from 'react';
import Head from '@/components/Head';
import Loading from '@/components/Loading';
import useAuth from '@/lib/hooks/useAuth';
import Icon from '@/components/Icon';
import { Lap, Runner } from '@/lib/interfaces';
import { themedPromiseToast } from '@/lib/utils';
import {
  createLap,
  deleteLap,
  getNewestLaps,
} from '@/lib/firebase/frontendUtils';
import ListItem from '@/components/ListItem';
import useCollectionAsDict from '@/lib/hooks/useCollectionAsDict';

export default function AssistantIndex() {
  const [newestLaps, setLaps] = useState<Lap[] | null>(null);
  const [runners, runnersLoading, runnersError] = useCollectionAsDict<Runner>(
    'apps/24-stunden-lauf/runners'
  );

  const { isLoggedIn, user } = useAuth();

  const [number, setNumber] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getNewestLaps(30).then((laps) => {
      setLaps(laps);
    });
  }, []);

  // While loading, show loading screen
  if (!isLoggedIn) {
    return <Loading />;
  }

  async function createNewLapHandler() {
    if (submitting) {
      return;
    }

    setSubmitting(true);

    await createLap(number, runners, user)
      .then(() => {
        setNumber(0);

        getNewestLaps(30).then((laps) => {
          setLaps(laps);
        });
      })
      .finally(() => {
        setSubmitting(false);

        // Focus input
        (document.getElementById('number') as HTMLInputElement).focus();
      });
  }

  return (
    <>
      <Head title="Assistent" />
      <main className="main !py-0">
        <div className="grid !h-screen grid-cols-2 gap-2">
          <section className="flex flex-col items-center justify-center gap-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-2">
                <input
                  id="number"
                  name="number"
                  className={`font-serif input-bordered input rounded-box box-border h-full w-full max-w-[18rem] text-center text-4xl font-medium tracking-widest md:text-7xl ${
                    Object.values(runners).find(
                      (runner) => runner.number == number
                    ) != undefined
                      ? 'input-success'
                      : 'input-error'
                  }`}
                  autoFocus
                  onChange={(e) => {
                    e.preventDefault();
                    if (submitting) {
                      return;
                    }
                    if (!isNaN(+e.target.value)) {
                      setNumber(+e.target.value);
                    }
                  }}
                  onKeyDown={async (e) => {
                    if (submitting) {
                      return;
                    }
                    if (e.key === 'Enter') {
                      themedPromiseToast(createNewLapHandler, {
                        pending: 'Runde wird hinzugefügt',
                        success: 'Runde erfolgreich hinzugefügt',
                        error: {
                          render: ({ data }: any) => {
                            if (data.message) {
                              return data.message;
                            } else if (typeof data === 'string') {
                              return data;
                            }
                            return 'Fehler beim Hinzufügen der Runde';
                          },
                        },
                      });
                    }
                  }}
                  type="text"
                  value={Number(number).toString()}
                  min={0}
                  required
                  inputMode='numeric'
                />
              </div>
            </div>
            <div className="w-full text-center text-sm">
              Drücke <kbd className="kbd kbd-sm">Enter</kbd>, um eine Runde zu
              zählen
            </div>
          </section>
          <section className="vertical-list">
            {newestLaps ? (
              <>
                {newestLaps
                  .sort((a, b) => {
                    return (
                      // @ts-ignore
                      b.timestamp - a.timestamp
                    );
                  })
                  .map((lap) => (
                    <ListItem
                      key={lap.id}
                      number={runners[lap.runnerId]?.number}
                      mainContent={runners[lap.runnerId]?.name || 'Unbekannt'}
                    >
                      <button
                        className="btn-outline btn-error btn-square btn-sm btn hidden text-error md:flex"
                        aria-label="Runde löschen"
                        onClick={async () => {
                          themedPromiseToast(deleteLap(lap.id), {
                            pending: 'Runde wird gelöscht',
                            success: 'Runde erfolgreich gelöscht',
                            error: {
                              render: ({ data }: any) => {
                                if (data.message) {
                                  return data.message;
                                } else if (typeof data === 'string') {
                                  return data;
                                }
                                return 'Fehler beim Löschen der Runde';
                              },
                            },
                          });
                        }}
                      >
                        <Icon name="TrashIcon" />
                      </button>
                    </ListItem>
                  ))}
                <div className="w-full text-center text-sm">
                  Neuesten 30 Runden
                </div>
              </>
            ) : (
              <span className="loading loading-lg" />
            )}
          </section>
        </div>
      </main>
    </>
  );
}
