import { useEffect, useState } from "react";
import Head from "components/Head";
import Loading from "components/Loading";
import useAuth from "lib/hooks/useAuth";
import AssistantMenu from "components/AssistantMenu";
import useLaps from "lib/hooks/useLaps";
import useRunners from "lib/hooks/useRunners";
import Icon from "components/Icon";
import useStaff from "lib/hooks/useStaff";
import useStudents from "lib/hooks/useStudents";
import Link from "next/link";
import Lap from "lib/interfaces/lap";

export default function AssistantDeleteRound() {
  const { isLoggedIn, user } = useAuth();
  const { laps, deleteLap } = useLaps();
  const { runners, getRunnerName } = useRunners();
  const { staff } = useStaff();
  const { students } = useStudents();

  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  if (!user || !laps || !runners || !staff || !students) {
    return <Loading />;
  }

  function filter(lap: Lap): boolean {
    return (
      !filterName ||
      getRunnerName(lap.runnerId)
        .toLowerCase()
        .includes(filterName.toLowerCase())
    );
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
        <AssistantMenu />
        <div className="flex gap-3 flex-col h-screen justify-center items-center lg:items-start w-full lg:w-[42rem]">
          <div className="searchbox">
            <div className="inputElementsContainer">
              <button className="homeButton">
                <Link href={"/runner"}>
                  <Icon name="HomeIcon" />
                </Link>
              </button>
              <input
                type="text"
                placeholder="Suchen..."
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
          </div>
          <div className="verticalList gap-2">
            {laps
              .sort((a, b) => {
                return (
                  // @ts-ignore
                  b.timestamp - a.timestamp
                );
              })
              .filter((lap) => {
                return filter(lap);
              })
              .map((lap) => {
                return (
                  <div
                    key={lap.id}
                    className="alert shadow py-2 px-3 rounded-full bg-base-100"
                  >
                    <div className="whitespace-nowrap overflow-hidden">
                      <button
                        className="btn btn-ghost btn-circle btn-sm text-error"
                        onClick={() => deleteLapHandler(lap.id)}
                      >
                        <Icon name="XCircleIcon" />
                      </button>
                      <span className="overflow-hidden text-ellipsis">
                        <span className="font-bold">
                          {"0".repeat(
                            3 - runners[lap.runnerId]?.number.toString().length
                          )}
                          {runners[lap.runnerId]?.number}
                          <span>
                            , {getRunnerName(lap.runnerId)},{" "}
                            {lap.timestamp.toDate().getHours().toString() +
                              ":" +
                              lap.timestamp
                                .toDate()
                                .getMinutes()
                                .toString()}{" "}
                            {lap.timestamp.toDate().getDay() ==
                              new Date().getDay() &&
                            lap.timestamp.toDate().getMonth() ==
                              new Date().getMonth() &&
                            lap.timestamp.toDate().getFullYear() ==
                              new Date().getFullYear()
                              ? "heute"
                              : lap.timestamp
                                  .toDate()
                                  .toLocaleDateString("de-DE")}
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </main>
    </>
  );
}
