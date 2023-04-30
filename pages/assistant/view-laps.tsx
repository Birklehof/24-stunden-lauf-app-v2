import { useEffect, useState } from "react";
import Head from "@/components/Head";
import Loading from "@/components/Loading";
import useAuth from "@/lib/hooks/useAuth";
import Icon from "@/components/Icon";
import Link from "next/link";
import useCollectionAsList from "@/lib/hooks/useCollectionAsList";
import useCollectionAsDict from "@/lib/hooks/useCollectionAsDict";
import { Runner, Student, Lap, Staff } from "@/lib/interfaces";
import { getRunnerName } from "@/lib/utils";
import { deleteLap } from "@/lib/firebaseUtils";

export default function AssistantViewLaps() {
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

  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  if (
    !user ||
    lapsLoading ||
    runnersLoading ||
    studentsLoading ||
    staffLoading
  ) {
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
      getRunnerName(lap.runnerId, runners, students, staff)
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
      <main className="main">
        <div className="searchbox">
          <div className="inputElementsContainer">
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
                  className="alert max-w-xl shadow-md !pl-0 rounded-box bg-base-100 flex flex-row justify-between text-lg"
                >
                  <div className="whitespace-nowrap overflow-hidden">
                    <span className="overflow-hidden text-ellipsis font-semibold">
                      <span className="px-2">
                        <span className="leading-zeros">
                          {"0".repeat(
                            3 - runners[lap.runnerId]?.number.toString().length
                          )}
                        </span>
                        {runners[lap.runnerId]?.number}
                      </span>

                      {getRunnerName(lap.runnerId, runners, students, staff)}
                      <span className="pl-2 font-thin">
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
                    className="btn btn-outline btn-error btn-square btn-sm text-error"
                    aria-label="Runde löschen"
                    onClick={() => deleteLapHandler(lap.id)}
                  >
                    <Icon name="TrashIcon" />
                  </button>
                </div>
              );
            })}
        </div>
      </main>
    </>
  );
}
