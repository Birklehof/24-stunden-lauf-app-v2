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
  const { runners, getRunnerName } = useRunners();
  const { staff } = useStaff();
  const { classes, houses, distancePerLap } = useRemoteConfig();
  const { students } = useStudent();

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
      !getRunnerName(runner.id).toLowerCase().includes(filterName.toLowerCase())
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
          <div className="verticalList">
            {lapCountByRunnerId
              .filter((lapCountWithRunnerId) => {
                return (
                  runners[lapCountWithRunnerId.runnerId] &&
                  filter(runners[lapCountWithRunnerId.runnerId])
                );
              })
              .map((lapCountWithRunnerId, position) => {
                return (
                  <div
                    className="shadow-md bg-base-100 rounded-xl flex flex-row justify-around items-center h-16 lg:h-16 w-full"
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
                        {getRunnerName(lapCountWithRunnerId.runnerId)}
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
            <div className="pt-3 w-full text-sm text-center">
              Keine weiteren Läufer
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
