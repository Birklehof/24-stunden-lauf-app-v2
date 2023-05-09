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
        <div className="flex h-1/5 flex-row items-center justify-around gap-2 lg:w-1/2">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="card ml-2 max-w-md bg-base-100 shadow-xl lg:p-0">
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
          </div>
          <div className="flex-start flex h-screen w-1/2 justify-center pr-2 lg:px-0">
            <div className="vertical-list !gap-2">
              {laps
                .sort((a, b) => {
                  return (
                    // @ts-ignore
                    b.timestamp - a.timestamp
                  );
                })
                .slice(0, 30)
                .map((lap) => (
                  <div key={lap.id} className="list-item">
                    <span className="leading-zeros font-semibold">
                      {'0'.repeat(
                        3 - runners[lap.runnerId]?.number.toString().length
                      )}
                    </span>
                    <span className="pr-3 font-semibold">
                      {runners[lap.runnerId]?.number}
                    </span>
                    <span className="overflow-hidden whitespace-nowrap">
                      <span className="hidden overflow-hidden text-ellipsis font-semibold md:inline">
                        {runners[lap.runnerId]?.name || 'Unbekannt'}
                      </span>
                    </span>
                    <div className="spacer" />
                    <button
                      className="btn-outline btn-error btn-square btn-sm btn hidden text-error md:flex"
                      aria-label="Runde löschen"
                      onClick={() => deleteLapHandler(lap.id)}
                    >
                      <Icon name="TrashIcon" />
                    </button>
                  </div>
                ))}
              <div className="w-full text-center text-sm">
                Neuesten 30 Runden
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
