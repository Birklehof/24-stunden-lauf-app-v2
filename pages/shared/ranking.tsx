import useAuth from '@/lib/hooks/useAuth';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Head from '@/components/Head';
import useRemoteConfig from '@/lib/hooks/useRemoteConfig';
import { Runner, RunnerWithLapCount } from '@/lib/interfaces';
import SearchBar from '@/components/SearchBar';
import ListItem from '@/components/ListItem';
import { getRunnersWithLapCount } from '@/lib/firebase/backendUtils';
import Icon from '@/components/Icon';

// Incremental static regeneration to reduce load on backend
export async function getStaticProps() {
  return {
    props: {
      runnersWithLapCount: await getRunnersWithLapCount(),
      lastUpdated: Date.now(),
    },
    revalidate: 60 * 30, // Revalidate at most every 3 minutes
  };
}

export default function RunnerRanking({
  runnersWithLapCount,
  lastUpdated,
}: {
  runnersWithLapCount: RunnerWithLapCount[];
  lastUpdated: number;
}) {
  const { isLoggedIn } = useAuth();
  const { classes, houses, distancePerLap } = useRemoteConfig();

  // Variables for filtering
  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterClasses, setFilterClasses] = useState('');
  const [filterHouse, setFilterHouse] = useState('');

  function getPosition(runner: RunnerWithLapCount): number {
    // Get position of runner in runnersWithLapCount array
    return runnersWithLapCount
      .sort((a, b) => b.lapCount - a.lapCount)
      .findIndex(
        (runnerWithLapCount) => runnerWithLapCount.lapCount == runner.lapCount
      );
  }

  // While loading, show loading screen
  if (!isLoggedIn) {
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
            {
              filerValue: filterType,
              setFilterValue: setFilterType,
              filterOptions: [
                { value: '', label: 'Alle Typen' },
                { value: 'student', label: 'Schüler' },
                { value: 'staff', label: 'Lehrer' },
                { value: 'other', label: 'Sonstige' },
              ],
            },
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
          {/* Last updated */}
          <div className="flex w-full justify-center gap-1 text-center text-sm">
            <Icon name="InformationCircleIcon" />
            Stand{' '}
            {new Date(lastUpdated).toLocaleDateString('de-DE', {
              weekday: 'long',
              day: '2-digit',
              month: '2-digit',
            })}{' '}
            {new Date(lastUpdated).toLocaleString('de-DE', {
              hour: '2-digit',
              minute: '2-digit',
            })}
            Uhr
          </div>
          {runnersWithLapCount
            .filter((runnerWithLapCount) => {
              return filterRunner(runnerWithLapCount, {
                filterType,
                filterName,
                filterClasses,
                filterHouse,
              });
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

function filterRunner(
  runner: Runner,
  {
    filterType,
    filterName,
    filterClasses,
    filterHouse,
  }: {
    filterType?: string;
    filterName?: string;
    filterClasses?: string;
    filterHouse?: string;
  }
) {
  if (filterType) {
    if (filterType === 'student' && runner.type !== 'student') {
      return false;
    }
    if (filterType === 'staff' && runner.type !== 'staff') {
      return false;
    }
    if (
      filterType === 'other' &&
      (runner.type === 'student' || runner.type === 'staff')
    ) {
      return false;
    }
  }

  if (filterClasses || filterHouse) {
    if (runner.type === 'student') {
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

  return !filterName || runner.name?.includes(filterName);
}
