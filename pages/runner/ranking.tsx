import useAuth from "lib/hooks/useAuth";
import { useEffect, useState } from "react";
import { type Runner } from "lib/interfaces/runner";
import Loading from "components/Loading";
import Head from "components/Head";
import RunnerMenu from "components/RunnerMenu";
import useRemoteConfig from "lib/hooks/useRemoteConfig";
import useRanking from "lib/hooks/useRanking";
import Icon from "components/Icon";
import Link from "next/link";
import useStudent from "lib/hooks/useStudents";
import useRunners from "lib/hooks/useRunners";
import useStaff from "lib/hooks/useStaff";

export default function RunnerRanking() {
  const { isLoggedIn, user } = useAuth();
  const { lapCountByRunnerId } = useRanking();
  const { runners } = useRunners();
  const { staff } = useStaff();
  const { classes, houses, distancePerLap } = useRemoteConfig();
  const { students } = useStudent();

  const [filterClasses, setFilterClasses] = useState("");
  const [filterHouse, setFilterHouse] = useState("");
  const [filterName, setFilterName] = useState("");

  function filter(runner: Runner): boolean {
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
      !runner.name.toLowerCase().includes(filterName.toLowerCase())
    ) {
      return false;
    }

    return true;
  }

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  if (!user || !runners || !staff || !students || !lapCountByRunnerId) {
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
          <div className="menu menu-horizontal bg-base-100 p-2 rounded-full z-40 lg:block top-3 shadow-2xl absolute w-[calc(100%-1rem)] lg:w-[42rem]">
            <div className="form-control flex flex-row gap-3 justify-between w-full">
              <button className="btn btn-circle btn-ghost btn-sm rounded-full lg:hidden">
                <Link href={"/runner"}>
                  <Icon name="HomeIcon" />
                </Link>
              </button>
              <input
                type="text"
                placeholder="Suchen..."
                className="input input-bordered input-sm rounded-full grow w-10"
                onChange={(e) => setFilterName(e.target.value)}
              />
              <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-circle btn-ghost btn-sm">
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
          <div className="flex flex-col items-start overflow-y-auto h-screen px-2 lg:px-0 w-full pt-20 pb-3">
            <div className="flex flex-col gap-3 w-full">
              {lapCountByRunnerId.map((lapCountWithRunnerId, position) => {
                if (
                  !runners[lapCountWithRunnerId.runnerId] ||
                  !filter(runners[lapCountWithRunnerId.runnerId])
                ) {
                  return null;
                }
                return (
                  <div
                    className="shadow-md bg-base-100 rounded-xl flex flex-row justify-around items-center h-16 lg:h-16"
                    key={lapCountWithRunnerId.runnerId}
                  >
                    <div className="stat w-[12%] overflow-hidden py-0 px-0 grow">
                      <div className="stat-value text-center text-2xl lg:text-3xl">
                        <div className="inline text-base-300">
                          {"0".repeat(3 - (position + 1).toString().length)}
                        </div>
                        {(position + 1).toString()}
                      </div>
                    </div>
                    <div className="stat w-6/12 py-0 px-0 grow">
                      <div className="stat-value overflow-hidden text-ellipsis text-2xl lg:text-3xl">
                        {position < 3 && (
                          <span
                            aria-label="Erster Platz"
                            className="inline-block text-sm lg:text-xl -translate-y-1"
                          >
                            {["🥇", "🥈", "🥉"][position]}
                          </span>
                        )}
                        {runners[lapCountWithRunnerId.runnerId]?.name}
                        {students[
                          runners[lapCountWithRunnerId.runnerId]?.studentId ||
                            ""
                        ]?.firstName
                          .concat(" ")
                          .concat(
                            students[
                              runners[lapCountWithRunnerId.runnerId]
                                ?.studentId || ""
                            ]?.lastName
                          )}
                        {staff[
                          runners[lapCountWithRunnerId.runnerId]?.staffId || ""
                        ]?.firstName
                          .concat(" ")
                          .concat(
                            staff[
                              runners[lapCountWithRunnerId.runnerId]?.staffId ||
                                ""
                            ]?.lastName
                          )}
                      </div>
                    </div>
                    <div className="stat w-3/12 overflow-hidden py-0 px-0">
                      <div className="flex flex-row justify-around">
                        <div>
                          <div className="stat-value text-center text-xl lg:text-2xl">
                            {lapCountWithRunnerId.lapCount
                              .toString()
                              .padStart(3, "0")}
                          </div>
                          <div className="stat-title text-center text-xs">
                            Runden
                          </div>
                        </div>
                        <div className="hidden sm:block">
                          <div className="stat-value text-center text-xl lg:text-2xl">
                            {(
                              (lapCountWithRunnerId.lapCount * distancePerLap) /
                              1000
                            ).toFixed(2)}
                          </div>
                          <div className="stat-title text-center text-xs">
                            km
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pt-3 w-full text-sm text-center">
              Keine weiteren Läufer
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
