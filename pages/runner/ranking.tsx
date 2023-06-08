import useAuth from '@/lib/hooks/useAuth';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Head from '@/components/Head';
import useRemoteConfig from '@/lib/hooks/useRemoteConfig';
import { RunnerWithLapCount } from '@/lib/interfaces';
import SearchBar from '@/components/SearchBar';
import ListItem from '@/components/ListItem';
import { getRunnersWithLapCount } from '@/lib/firebase/backendUtils';

export async function getStaticProps() {
  return {
    props: {
      runnersWithLapCount: await getRunnersWithLapCount(),
    },
    revalidate: 60 * 3, // 3 minutes
  };
}

export default function RunnerRanking({
  runnersWithLapCount,
}: {
  runnersWithLapCount: RunnerWithLapCount[];
}) {
  const { isLoggedIn, user } = useAuth();
  const { classes, houses, distancePerLap } = useRemoteConfig();

  const [filterClasses, setFilterClasses] = useState('');
  const [filterHouse, setFilterHouse] = useState('');
  const [filterName, setFilterName] = useState('');

  function filter(runner: RunnerWithLapCount): boolean {
    // Filter runners by class, house and name (true = show runner)

    if (filterClasses || filterHouse) {
      if (runner.type == 'student') {
        if (filterClasses && runner.class !== filterClasses) {
          return false;
        }
        if (filterHouse && runner.house !== filterHouse) {
          return false;
        }
      } else {
        return false || (filterHouse == 'Extern (Kollegium)' && !filterClasses);
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

  function getPosition(runner: RunnerWithLapCount): number {
    // Get position of runner in runnersWithLapCount array
    return runnersWithLapCount
      .sort((a, b) => b.lapCount - a.lapCount)
      .findIndex((runnerWithLapCount) => runnerWithLapCount.lapCount == runner.lapCount); 
  }

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  if (!user) {
    return <Loading />;
  }

  return (
    <>
      <Head title="Läufer" />
      <main className="main">
        <SearchBar
          searchValue={filterName}
          setSearchValue={setFilterName}
          filters={[
            // {
            //   filerValue: filterType,
            //   setFilterValue: setFilterType,
            //   filterOptions: [
            //     { value: '', label: 'Alle Typen' },
            //     { value: 'student', label: 'Schüler' },
            //     { value: 'staff', label: 'Lehrer' },
            //     { value: 'other', label: 'Sonstige' },
            //   ],
            // },
            {
              filerValue: filterClasses,
              setFilterValue: setFilterClasses,
              filterOptions: [
                { value: '', label: 'Alle Klassen' },
                ...classes.map((_class) => ({ value: _class, label: _class })),
              ],
            },
            {
              filerValue: filterHouse,
              setFilterValue: setFilterHouse,
              filterOptions: [
                { value: '', label: 'Alle Häuser' },
                ...houses.map((house) => ({ value: house, label: house })),
              ],
            },
          ]}
        />
        <div className="vertical-list">
          {runnersWithLapCount
            .filter((runnerWithLapCount) => {
              return runnerWithLapCount.lapCount > 0 && filter(runnerWithLapCount);
            })
            .sort((a, b) => b.lapCount - a.lapCount)
            .map((runnerWithLapCount) => {
              return (
                <ListItem
                  key={runnerWithLapCount.number}
                  number={getPosition(runnerWithLapCount) + 1}
                  mainContent={
                    (['🥇', '🥈', '🥉'][getPosition(runnerWithLapCount)] ||
                      '') + runnerWithLapCount.name
                  }
                >
                  <div className="flex w-1/4 flex-row items-center justify-between pr-3">
                    <div className="pr-1">
                      <div className="stat-value text-center text-lg font-semibold md:text-xl">
                        {runnerWithLapCount.number}
                      </div>
                      <div className="stat-title -mt-2 text-center text-xs">
                        Nr.
                      </div>
                    </div>
                    <div className="pr-1">
                      <div className="stat-value text-center text-lg font-semibold md:text-xl">
                        {runnerWithLapCount.lapCount.toString()}
                      </div>
                      <div className="stat-title -mt-2 text-center text-xs">
                        Runden
                      </div>
                    </div>
                    <div className="pr-1">
                      <div className="stat-value text-center text-lg font-semibold md:text-xl">
                        {(
                          (runnerWithLapCount.lapCount * distancePerLap) /
                          1000
                        ).toFixed(2)}
                      </div>
                      <div className="stat-title -mt-2 text-center text-xs">
                        km
                      </div>
                    </div>
                  </div>
                </ListItem>
                // <div className="list-item" key={lapCountWithRunnerId.runnerId}>
                //   <span className="leading-zeros font-semibold">
                //     {'0'.repeat(
                //       3 -
                //         (
                //           getPosition(lapCountWithRunnerId.runnerId) + 1
                //         ).toString().length
                //     )}
                //   </span>
                //   <span className="pr-3 font-semibold">
                //     {getPosition(lapCountWithRunnerId.runnerId) + 1}
                //   </span>
                //   {getPosition(lapCountWithRunnerId.runnerId) < 3 && (
                //     <span
                //       aria-label="Erster Platz"
                //       className="md:text-md inline-block text-sm"
                //     >
                //       {
                //         ['🥇', '🥈', '🥉'][
                //           getPosition(lapCountWithRunnerId.runnerId)
                //         ]
                //       }
                //     </span>
                //   )}
                //   <span className="overflow-hidden whitespace-nowrap pr-1">
                //     <span className="overflow-hidden text-ellipsis font-semibold">
                //       {runners[lapCountWithRunnerId.runnerId].name}
                //     </span>
                //   </span>

                //   <div className="spacer" />

                // </div>
              );
            })}
          <div className="w-full text-center text-sm">
            Keine weiteren Läufer
          </div>
        </div>
      </main>
    </>
  );
}
