import { useEffect, useState } from "react";
import Head from "@/components/Head";
import Loading from "@/components/Loading";
import useAuth from "@/lib/hooks/useAuth";
import AssistantMenu from "@/components/AssistantMenu";
import useLaps from "@/lib/hooks/useLaps";
import useRunners from "@/lib/hooks/useRunners";
import Icon from "@/components/Icon";
import useStaff from "@/lib/hooks/useStaff";
import useStudents from "@/lib/hooks/useStudents";
import Link from "next/link";
import Lap from "@/lib/interfaces/lap";

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
    // Filter laps by runner name, if the filterName is a number, filter by runner number (true = show lap)

    if (!filterName) {
      return true;
    } else if (!isNaN(Number(filterName))) {
      return !filterName || runners[lap.runnerId]?.number == Number(filterName);
    }

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
        <div className="hidden lg:flex">
          <AssistantMenu />
        </div>
        <div className="flex gap-3 flex-col h-screen justify-center items-center lg:items-start w-full lg:w-[42rem]">
          <div className="searchbox">
            <div className="inputElementsContainer">
              <button className="btn btn-circle btn-ghost btn-sm lg:hidden">
                <Link href={"/assistant"}>
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
          <div className="verticalList !pt-20 !gap-2">
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
                    className="alert shadow py-1 rounded-full bg-base-100 flex flex-row justify-between"
                  >
                    <div className="whitespace-nowrap overflow-hidden">
                      <span className="overflow-hidden text-ellipsis">
                        <span>
                          {"0".repeat(
                            3 - runners[lap.runnerId]?.number.toString().length
                          )}
                        </span>
                        <span className="font-bold">
                          {runners[lap.runnerId]?.number}{" "}
                          {getRunnerName(lap.runnerId)},{" "}
                        </span>
                        <span>
                          {lap.timestamp.toDate().getDay() ==
                            new Date().getDay() &&
                          lap.timestamp.toDate().getMonth() ==
                            new Date().getMonth() &&
                          lap.timestamp.toDate().getFullYear() ==
                            new Date().getFullYear()
                            ? "heute"
                            : "am " +
                              lap.timestamp
                                .toDate()
                                .toLocaleDateString("de-DE")}{" "}
                          {lap.timestamp.toDate().getHours().toString() +
                            ":" +
                            lap.timestamp.toDate().getMinutes().toString()}{" "}
                        </span>
                      </span>
                    </div>
                    <button
                      className="btn btn-ghost btn-circle btn-sm text-error"
                      aria-details="Runde löschen"
                      onClick={() => deleteLapHandler(lap.id)}
                    >
                      <Icon name="TrashIcon" />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </main>
    </>
  );
}
