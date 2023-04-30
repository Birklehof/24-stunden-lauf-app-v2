import useAuth from "@/lib/hooks/useAuth";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Head from "@/components/Head";
import RunnerMenu from "@/components/RunnerMenu";
import useRemoteConfig from "@/lib/hooks/useRemoteConfig";
import useRanking from "@/lib/hooks/useRanking";
import Icon from "@/components/Icon";
import Link from "next/link";
import useCollectionAsDict from "@/lib/hooks/useCollectionAsDict";
import { getRunnerName } from "@/lib/utils";
import { Student, Runner, Staff } from "@/lib/interfaces";

export default function RunnerRanking() {
  const [runners, runnersLoading, runnersError] = useCollectionAsDict<Runner>(
    "apps/24-stunden-lauf/runners"
  );
  const [students, studentsLoading, studentsError] =
    useCollectionAsDict<Student>("students");
  const [staff, staffLoading, staffError] = useCollectionAsDict<Staff>("staff");

  const { isLoggedIn, user } = useAuth();
  const { lapCountByRunnerId } = useRanking();
  const { classes, houses, distancePerLap } = useRemoteConfig();

  const [filterClasses, setFilterClasses] = useState("");
  const [filterHouse, setFilterHouse] = useState("");
  const [filterName, setFilterName] = useState("");

  function filter(runner: Runner): boolean {
    // Filter runners by class, house and name (true = show runner)

    if (filterClasses || filterHouse) {
      if (runner.studentId) {
        const student = students[runner.studentId];
        if (!student) {
          return false;
        }
        if (filterClasses && student.class !== filterClasses) {
          return false;
        }
        if (filterHouse && student.house !== filterHouse) {
          return false;
        }
      } else {
        return false || (filterHouse == "Extern (Kollegium)" && !filterClasses);
      }
    }

    if (
      filterName &&
      !getRunnerName(runner.id, runners, students, staff)
        .toLowerCase()
        .includes(filterName.toLowerCase())
    ) {
      return false;
    }

    return true;
  }

  function getPosition(runnerId: string): number {
    // Get position of runner in ranking
    const position = lapCountByRunnerId.findIndex(
      (lapCountWithRunnerId) => lapCountWithRunnerId.runnerId === runnerId
    );
    return position;
  }

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  if (
    !user ||
    runnersLoading ||
    studentsLoading ||
    staffLoading ||
    !lapCountByRunnerId
  ) {
    return <Loading />;
  }

  return (
    <>
      <Head title="Läufer" />
      <main className="main">
        <div className="searchbox">
          <div className="input-elements-container">
            <div className="btn btn-circle btn-ghost btn-sm lg:hidden">
              <Link href={"/runner"} aria-label="Home">
                <Icon name="HomeIcon" />
              </Link>
            </div>
            <input
              type="text"
              placeholder="Suchen..."
              onChange={(e) => setFilterName(e.target.value)}
            />
            <div className="dropdown dropdown-bottom dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-circle btn-ghost btn-sm"
                aria-label="Filtern"
              >
                <Icon name="AdjustmentsIcon" />
              </label>
              <div
                tabIndex={0}
                className="dropdown-content menu p-3 shadow bg-base-100 rounded-box flex flex-col gap-3"
              >
                <select
                  className="select select-bordered select-sm grow"
                  onChange={(e) => setFilterClasses(e.target.value)}
                  value={filterClasses}
                >
                  <option value={""}>Alle Klassen</option>
                  {classes.map((_class) => (
                    <option key={_class}>{_class}</option>
                  ))}
                </select>

                <select
                  className="select select-bordered select-sm grow"
                  onChange={(e) => setFilterHouse(e.target.value)}
                  value={filterHouse}
                >
                  <option value={""}>Alle Häuser</option>
                  {houses.map((house) => (
                    <option key={house}>{house}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="vertical-list !pt-20">
          {lapCountByRunnerId
            .filter((lapCountWithRunnerId) => {
              return (
                runners[lapCountWithRunnerId.runnerId] &&
                filter(runners[lapCountWithRunnerId.runnerId])
              );
            })
            .map((lapCountWithRunnerId) => {
              return (
                <div className="list-item" key={lapCountWithRunnerId.runnerId}>
                  <span className="leading-zeros font-semibold">
                    {"0".repeat(
                      3 -
                        (
                          getPosition(lapCountWithRunnerId.runnerId) + 1
                        ).toString().length
                    )}
                  </span>
                  <span className="pr-3 font-semibold">
                    {getPosition(lapCountWithRunnerId.runnerId) + 1}
                  </span>
                  {getPosition(lapCountWithRunnerId.runnerId) < 3 && (
                    <span
                      aria-label="Erster Platz"
                      className="inline-block text-sm md:text-md"
                    >
                      {
                        ["🥇", "🥈", "🥉"][
                          getPosition(lapCountWithRunnerId.runnerId)
                        ]
                      }
                    </span>
                  )}
                  <span className="whitespace-nowrap overflow-hidden pr-1">
                    <span className="overflow-hidden text-ellipsis font-semibold">
                      {getRunnerName(
                        lapCountWithRunnerId.runnerId,
                        runners,
                        students,
                        staff
                      )}
                    </span>
                  </span>

                  <div className="spacer" />
                  <span className="flex flex-row items-center pr-3">
                    <div className="pr-1">
                      <div className="stat-value text-center text-lg md:text-xl font-semibold">
                        {runners[lapCountWithRunnerId.runnerId].number}
                      </div>
                      <div className="stat-title text-center text-xs -mt-2">
                        Nr.
                      </div>
                    </div>
                    <div className="pr-1">
                      <div className="stat-value text-center text-lg md:text-xl font-semibold">
                        {lapCountWithRunnerId.lapCount.toString()}
                      </div>
                      <div className="stat-title text-center text-xs -mt-2">
                        Runden
                      </div>
                    </div>
                    <div className="pr-1">
                      <div className="stat-value text-center text-lg md:text-xl font-semibold">
                        {(
                          (lapCountWithRunnerId.lapCount * distancePerLap) /
                          1000
                        ).toFixed(2)}
                      </div>
                      <div className="stat-title text-center text-xs -mt-2">
                        km
                      </div>
                    </div>
                  </span>
                </div>
              );
            })}
          <div className="w-full text-sm text-center">
            Keine weiteren Läufer
          </div>
        </div>
      </main>
    </>
  );
}
