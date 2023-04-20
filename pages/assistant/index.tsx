import { useEffect, useState } from "react";
import Head from "@/components/Head";
import Loading from "@/components/Loading";
import useAuth from "@/lib/hooks/useAuth";
import AssistantMenu from "@/components/AssistantMenu";
import useLaps from "@/lib/hooks/useLaps";
import useRunners from "@/lib/hooks/useRunners";
import useStaff from "@/lib/hooks/useStaff";
import useStudents from "@/lib/hooks/useStudents";

export default function AssistantIndex() {
  const { isLoggedIn, user } = useAuth();
  const { laps, createLap } = useLaps();
  const [number, setNumber] = useState(0);
  const { runners, getRunnerName } = useRunners();
  const { staff } = useStaff();
  const { students } = useStudents();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  if (!user || !laps || !runners || !staff || !students) {
    return <Loading />;
  }

  async function createNewLapHandler() {
    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await createLap(number).then(() => {
        setNumber(0);
      });
    } catch (e: any) {
      if (e instanceof Error) {
        alert(e.message);
        setSubmitting(false);
        return;
      }
      throw e;
    }

    setSubmitting(false);

    // Focus input
    (document.getElementById("number") as HTMLInputElement).focus();
  }

  return (
    <>
      <Head title="Assistent" />
      <main className="flex bg-base-200 justify-center h-screen items-center">
        <AssistantMenu />
        <div className="flex flex-row h-1/5 items-center gap-2 lg:w-1/2 justify-around">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="card max-w-md shadow-lg bg-base-100 ml-2 lg:p-0">
              <div className="card-body p-2">
                <input
                  id="number"
                  name="number"
                  className={`font-medium font-serif box-border input input-bordered w-full max-w-xs text-center text-5xl md:text-8xl tracking-widest h-full ${
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
                      await createNewLapHandler();
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
                    className="alert shadow py-2 px-3 rounded-full bg-base-100"
                  >
                    <div className="whitespace-nowrap overflow-hidden">
                      <span className="overflow-hidden text-ellipsis">
                        {"0".repeat(
                          3 - runners[lap.runnerId]?.number.toString().length
                        )}
                        <span className="font-bold">
                          {runners[lap.runnerId]?.number}{" "}
                          <span className="hidden md:inline">
                            {getRunnerName(lap.runnerId)}
                          </span>
                        </span>
                      </span>
                    </div>
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
