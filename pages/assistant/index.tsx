import { useEffect, useState } from "react";
import Head from "components/Head";
import Loading from "components/Loading";
import useAuth from "lib/hooks/useAuth";
import AssistantMenu from "components/AssistantMenu";
import { Roboto_Slab } from "@next/font/google";
import useLaps from "lib/hooks/useLaps";
import useRunners from "lib/hooks/useRunners";
import Icon from "components/Icon";

const roboto_slab = Roboto_Slab({ subsets: ["latin"] });

export default function AssistantIndex() {
  const { isLoggedIn, user } = useAuth();
  const { laps, createLap } = useLaps();
  const [number, setNumber] = useState(0);
  const { runners } = useRunners();

  useEffect(() => {
    if (!isLoggedIn || !user) {
      return;
    }
  }, [isLoggedIn, user]);

  if (!isLoggedIn || !user) {
    return <Loading />;
  }

  async function createNewLapHandler() {
    try {
      await createLap(number);
    } catch (e: any) {
      if (e instanceof Error) {
        alert(e.message);
        return;
      }
      throw e;
    }
    setNumber(0);
  }

  return (
    <>
      <Head title="Assistent" />
      <main className="flex bg-base-200 justify-center h-screen items-center">
        <AssistantMenu />
        <div className="flex flex-row h-1/5 items-center gap-2 lg:w-1/2 justify-around">
          <div className="card max-w-md shadow-lg bg-base-100 ml-2 lg:p-0">
            <div className="card-body p-2">
              <input
                name={"number"}
                className={
                  roboto_slab.className +
                  " box-border input input-bordered w-full max-w-xs text-center text-5xl md:text-8xl tracking-widest h-full"
                }
                autoFocus
                onChange={(e) => {
                  e.preventDefault();
                  if (!isNaN(+e.target.value)) {
                    setNumber(+e.target.value);
                  }
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    await createNewLapHandler();
                  }
                }}
                type={"text"}
                value={Number(number).toString()}
                min={0}
                required
              />
            </div>
          </div>
          <div className="flex flex-start h-screen pr-2 pt-2 lg:px-0">
            <div className="flex flex-col flex-start gap-1 stack">
              {laps
                .sort((a, b) => {
                  return (
                    // @ts-ignore
                    b.timestamp - a.timestamp
                  );
                })
                .map((lap) => (
                  <div className="alert shadow py-2 px-3 rounded-full bg-base-100">
                    <div className="w-20 md:w-48 whitespace-nowrap overflow-hidden">
                      <span className="text-success">
                        <Icon name="PlusCircleIcon" />
                      </span>
                      <span className="overflow-hidden text-ellipsis">
                        <span className="font-bold">
                          {"0".repeat(
                            3 - runners[lap.runnerId].number.toString().length
                          )}
                          {runners[lap.runnerId].number}
                          <span className="hidden md:inline">
                            , {runners[lap.runnerId].name}
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
