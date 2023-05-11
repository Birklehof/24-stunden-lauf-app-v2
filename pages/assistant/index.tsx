import { useEffect, useState } from 'react';
import Head from '@/components/Head';
import Loading from '@/components/Loading';
import useAuth from '@/lib/hooks/useAuth';
import Icon from '@/components/Icon';
import useCollectionAsList from '@/lib/hooks/useCollectionAsList';
import useCollectionAsDict from '@/lib/hooks/useCollectionAsDict';
import { Runner, Lap } from '@/lib/interfaces';
import { themedPromiseToast } from '@/lib/utils';
import { createLap, deleteLap } from '@/lib/firebaseUtils';
import ListItem from '@/components/ListItem';

export default function AssistantIndex() {
  const [laps, lapsLoading, lapsError] = useCollectionAsList<Lap>(
    'apps/24-stunden-lauf/laps'
  );
  const [runners, runnersLoading, runnersError] = useCollectionAsDict<Runner>(
    'apps/24-stunden-lauf/runners'
  );

  const { isLoggedIn, user } = useAuth();

  const [number, setNumber] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  if (!user || lapsLoading || runnersLoading) {
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
      })
      .finally(() => {
        setSubmitting(false);

        // Focus input
        (document.getElementById('number') as HTMLInputElement).focus();
      });
  }

  async function deleteLapHandler(lapId: string) {
    try {
      await deleteLap(lapId);
    } catch (e: any) {
      if (e instanceof Error) {
        alert(e.message);
        return;
      }
      throw e;
    }
  }

  return (
    <>
      <Head title="Assistent" />
      <main className="main">
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
                        success: 'Erfolgreich hinzugefügt',
                        error: {
                          render({ data }) {
                            if (data instanceof Error) {
                              return data.message;
                            }
                          },
                        },
                      });
                    }
                  }}
                  type="text"
                  value={Number(number).toString()}
                  min={0}
                  required
                />
              </div>
            </div>
            <div className="w-full text-center text-sm">
              Drücke <kbd className="kbd kbd-sm">Enter</kbd>, um eine Runde zu
              zählen
            </div>
          </section>
          <section className="vertical-list">
            {laps
              .sort((a, b) => {
                return (
                  // @ts-ignore
                  b.timestamp - a.timestamp
                );
              })
              .slice(0, 30)
              .map((lap) => (
                <ListItem
                  key={lap.id}
                  number={runners[lap.runnerId]?.number}
                  mainContent={runners[lap.runnerId]?.name || 'Unbekannt'}
                >
                  <button
                    className="btn-outline btn-error btn-square btn-sm btn hidden text-error md:flex"
                    aria-label="Runde löschen"
                    onClick={() => deleteLapHandler(lap.id)}
                  >
                    <Icon name="TrashIcon" />
                  </button>
                </ListItem>
              ))}
            <div className="w-full text-center text-sm">Neuesten 30 Runden</div>
          </section>
        </div>
      </main>
    </>
  );
}
