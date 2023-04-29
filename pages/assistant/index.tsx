import { useEffect, useState } from "react";
import Head from "@/components/Head";
import Loading from "@/components/Loading";
import useAuth from "@/lib/hooks/useAuth";
import AssistantMenu from "@/components/AssistantMenu";
import Icon from "@/components/Icon";
import useToast from "@/lib/hooks/useToast";
import useCollectionAsList from "@/lib/hooks/useCollectionAsList";
import useCollectionAsDict from "@/lib/hooks/useCollectionAsDict";
import { Runner, Student, Lap, Staff } from "@/lib/interfaces";
import { getRunnerName } from "@/lib/utils";
import { createLap, deleteLap } from "@/lib/firebaseUtils";

export default function AssistantIndex() {
  const [laps, lapsLoading, lapsError] = useCollectionAsList<Lap>(
    "apps/24-stunden-lauf/laps"
  );
  const [runners, runnersLoading, runnersError] = useCollectionAsDict<Runner>(
    "apps/24-stunden-lauf/runners"
  );
  const [students, studentsLoading, studentsError] =
    useCollectionAsDict<Student>("students");
  const [staff, staffLoading, staffError] = useCollectionAsDict<Staff>("staff");

  const { isLoggedIn, user } = useAuth();
  const { promiseToast } = useToast();

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
      <main className="flex bg-base-200 justify-center h-screen items-center">
        <div className="flex flex-row h-1/5 items-center gap-2 lg:w-1/2 justify-around">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="card max-w-md shadow-lg bg-base-100 ml-2 lg:p-0">
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
                      promiseToast(createNewLapHandler, {
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
            <div className="verticalList !gap-2">
              {laps
                .sort((a, b) => {
                  return (
                    // @ts-ignore
                    b.timestamp - a.timestamp
                  );
                })
                .slice(0, 30)
                .map((lap) => (
                  <div
                    key={lap.id}
                    className="alert !pl-0 shadow rounded-box bg-base-100 text-lg"
                  >
                    <div className="whitespace-nowrap overflow-hidden">
                      <span className="overflow-hidden text-ellipsis font-semibold">
                        <span className="px-2">
                          <span className="leading-zeros">
                            {"0".repeat(
                              3 -
                                runners[lap.runnerId]?.number.toString().length
                            )}
                          </span>
                          {runners[lap.runnerId]?.number}
                        </span>

                        <span className="hidden md:inline">
                          {getRunnerName(
                            lap.runnerId,
                            runners,
                            students,
                            staff
                          )}
                        </span>
                      </span>
                    </div>
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
