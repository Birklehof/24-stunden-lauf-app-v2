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
      <main className="flex bg-base-200 justify-center min-h-screen">
        <div className="hidden lg:flex">
          <RunnerMenu />
        </div>
        <div className="flex gap-3 flex-col h-screen justify-center items-center lg:items-start w-full lg:w-[42rem]">
          <div className="searchbox">
            <div className="inputElementsContainer">
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
          <div className="verticalList !pt-20">
            {lapCountByRunnerId
              .filter((lapCountWithRunnerId) => {
                return (
                  runners[lapCountWithRunnerId.runnerId] &&
                  filter(runners[lapCountWithRunnerId.runnerId])
                );
              })
              .map((lapCountWithRunnerId) => {
                return (
                  <div
                    className="alert shadow-md bg-base-100 rounded-box flex flex-row justify-around items-center w-full gap-0"
                    key={lapCountWithRunnerId.runnerId}
                  >
                    <div className="w-min pr-2 overflow-hidden py-0 px-0">
                      <div className="text-center text-xl md:text-2xl font-semibold">
                        <span className="inline leading-zeros">
                          {"0".repeat(
                            3 -
                              (
                                getPosition(lapCountWithRunnerId.runnerId) + 1
                              ).toString().length
                          )}
                        </span>
                        {(
                          getPosition(lapCountWithRunnerId.runnerId) + 1
                        ).toString()}
                      </div>
                    </div>
                    <div className="w-8/12 grow p-0">
                      <div className="w-full overflow-hidden text-ellipsis text-xl md:text-2xl font-semibold">
                        {getPosition(lapCountWithRunnerId.runnerId) < 3 && (
                          <span
                            aria-label="Erster Platz"
                            className="inline-block text-sm md:text-md -translate-y-1"
                          >
                            {
                              ["🥇", "🥈", "🥉"][
                                getPosition(lapCountWithRunnerId.runnerId)
                              ]
                            }
                          </span>
                        )}
                        {getRunnerName(
                          lapCountWithRunnerId.runnerId,
                          runners,
                          students,
                          staff
                        )}{" "}
                        <span className="inline-block text-sm md:text-lg -translate-y-[0.15rem]">
                          ({runners[lapCountWithRunnerId.runnerId].number})
                        </span>
                      </div>
                    </div>
                    <div className="stat w-3/12 overflow-hidden p-0">
                      <div className="flex flex-row justify-around">
                        <div>
                          <div className="stat-value text-center text-lg md:text-xl font-semibold">
                            {lapCountWithRunnerId.lapCount
                              .toString()
                              .padStart(3, "0")}
                          </div>
                          <div className="stat-title text-center text-xs -mt-2">
                            Runden
                          </div>
                        </div>
                        <div className="hidden sm:block">
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
                      </div>
                    </div>
                  </div>
                );
              })}
            <div className="w-full text-sm text-center">
              Keine weiteren Läufer
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
