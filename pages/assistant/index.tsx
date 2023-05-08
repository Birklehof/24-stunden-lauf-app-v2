import { useEffect, useState } from "react";
import Head from "@/components/Head";
import Loading from "@/components/Loading";
import useAuth from "@/lib/hooks/useAuth";
import Icon from "@/components/Icon";
import useCollectionAsList from "@/lib/hooks/useCollectionAsList";
import useCollectionAsDict from "@/lib/hooks/useCollectionAsDict";
import { Runner, Lap } from "@/lib/interfaces";
import { themedPromiseToast } from "@/lib/utils";
import { createLap, deleteLap } from "@/lib/firebaseUtils";

export default function AssistantIndex() {
  const [laps, lapsLoading, lapsError] = useCollectionAsList<Lap>(
    "apps/24-stunden-lauf/laps"
  );
  const [runners, runnersLoading, runnersError] = useCollectionAsDict<Runner>(
    "apps/24-stunden-lauf/runners"
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
        (document.getElementById("number") as HTMLInputElement).focus();
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
        <div className="flex flex-row h-1/5 items-center gap-2 lg:w-1/2 justify-around">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="card max-w-md shadow-xl bg-base-100 ml-2 lg:p-0">
              <div className="card-body p-2">
                <input
                  id="number"
                  name="number"
                  className={`font-medium font-serif box-border input input-bordered rounded-box w-full max-w-[18rem] text-center text-4xl md:text-7xl tracking-widest h-full ${
                    Object.values(runners).find(
                      (runner) => runner.number == number
                    ) != undefined
                      ? "input-success"
                      : "input-error"
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
                    if (e.key === "Enter") {
                      themedPromiseToast(createNewLapHandler, {
                        pending: "Runde wird hinzugefügt",
                        success: "Erfolgreich hinzugefügt",
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
            <div className="w-full text-sm text-center">
              Drücke <kbd className="kbd kbd-sm">Enter</kbd>, um eine Runde zu
              zählen
            </div>
          </div>
          <div className="flex flex-start h-screen pr-2 lg:px-0 w-1/2 justify-center">
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
                      {"0".repeat(
                        3 - runners[lap.runnerId]?.number.toString().length
                      )}
                    </span>
                    <span className="pr-3 font-semibold">
                      {runners[lap.runnerId]?.number}
                    </span>
                    <span className="whitespace-nowrap overflow-hidden">
                      <span className="overflow-hidden text-ellipsis font-semibold hidden md:inline">
                        {runners[lap.runnerId]?.name || "Unbekannt"}
                      </span>
                    </span>
                    <div className="spacer" />
                    <button
                      className="btn btn-outline btn-error btn-square btn-sm text-error hidden md:flex"
                      aria-label="Runde löschen"
                      onClick={() => deleteLapHandler(lap.id)}
                    >
                      <Icon name="TrashIcon" />
                    </button>
                  </div>
                ))}
              <div className="w-full text-sm text-center">
                Neuesten 30 Runden
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
