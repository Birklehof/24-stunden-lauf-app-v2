import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import Loading from '@/components/Loading';
import Head from '@/components/Head';
import useRemoteConfig from '@/lib/firebase/useRemoteConfig';
import { RunnerWithLapCount } from '@/lib/interfaces';
import ListItem from '@/components/ListItem';
import { getRunnersWithLapCount } from '@/lib/utils/firebase/backend';
import Icon from '@/components/Icon';
import {
  defaultClasses,
  defaultHouses,
} from '@/lib/firebase/remoteConfigDefaultValues';
import { AuthAction, useUser, withUser } from 'next-firebase-auth';
import {
  assistantNavItems,
  filterRunner,
  runnerNavItems,
  runnerTypes,
} from '@/lib/utils';
import Menu from '@/components/Menu';

// Incremental static regeneration to reduce load on backend
export async function getStaticProps() {
  return {
    props: {
      runnersWithLapCount: JSON.parse(
        JSON.stringify(await getRunnersWithLapCount())
      ),
      lastUpdated: Date.now(),
    },
    revalidate: 10,
  };
}

function RankingPage({
  runnersWithLapCount,
  // eslint-disable-next-line no-unused-vars
  lastUpdated,
}: {
  runnersWithLapCount: RunnerWithLapCount[];
  lastUpdated: number;
}) {
  const user = useUser();

  const [classes] = useRemoteConfig('classes', defaultClasses);
  const [houses] = useRemoteConfig('houses', defaultHouses);

  // Variables for filtering
  const [searchRunnerName, setSearchRunnerName] = useState('');
  const [runnerTypeFilter, setRunnerTypeFilter] = useState<string[]>([]);
  const [runnerClassFilter, setRunnerClassFilter] = useState<string[]>([]);
  const [runnerHouseFilter, setRunnerHouseFilter] = useState<string[]>([]);

  const resetFilter = (
    event: FormEvent,
    setFilters: Dispatch<SetStateAction<string[]>>
  ) => {
    event.preventDefault();
    setFilters([]);
  };

  const handleCheckboxChange = (
    event: FormEvent,
    currentFilters: string[],
    setFilters: Dispatch<SetStateAction<string[]>>
  ) => {
    const { value, checked } = event.target as HTMLInputElement;

    if (checked) {
      setFilters([...currentFilters, value]);
    } else {
      setFilters(currentFilters.filter((item) => item !== value));
    }
  };

  function getPosition(runner: RunnerWithLapCount): number {
    // Get position of runner in runnersWithLapCount array
    return runnersWithLapCount
      .sort((a, b) => b.lapCount - a.lapCount)
      .findIndex(
        (runnerWithLapCount) => runnerWithLapCount.lapCount == runner.lapCount
      );
  }

  function scrollToUser() {
    if (user.email == null) {
      return;
    }
    document
      .getElementById(user.email)
      ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  return (
    <>
      <Head title="Läufer" />

      {user.id === process.env.NEXT_PUBLIC_ASSISTANT_ACCOUNT_UID ? (
        <Menu navItems={assistantNavItems} />
      ) : (
        <Menu navItems={runnerNavItems} />
      )}

      <main className="max-w-xl mx-auto flex pt-4 flex-col gap-2">
        <div className="collapse border border-base-300 rounded-box">
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-sm font-semibold flex items-center gap-2">
            <Icon name="AdjustmentsVerticalIcon" size={5} />
            Filter
          </div>
          <div className="collapse-content flex flex-col gap-2">
            <label className="input w-full mb-3">
              <Icon name="Search" size={4} />
              <input
                type="search"
                className="grow text-lg rounded-box"
                placeholder="Suchen"
                value={searchRunnerName}
                onChange={(e) => setSearchRunnerName(e.target.value)}
              />
            </label>
            <form className="flex flex-row flex-wrap gap-1">
              <input className="btn btn-sm btn-circle" type="reset" value="×" />
              {runnerTypes.map((type) => (
                <input
                  key={type.value}
                  className="btn btn-sm rounded-full"
                  type="checkbox"
                  aria-label={type.name}
                  value={type.value}
                  checked={runnerTypeFilter.includes(type.value)}
                  onChange={(e) =>
                    handleCheckboxChange(
                      e,
                      runnerTypeFilter,
                      setRunnerTypeFilter
                    )
                  }
                />
              ))}
            </form>

            <form className="flex flex-row flex-wrap gap-1">
              <input
                className="btn btn-sm btn-circle"
                type="reset"
                value="×"
                aria-label="Klassenfilter zurücksetzen"
                onClick={(e) => resetFilter(e, setRunnerClassFilter)}
              />
              {classes.map((classItem) => (
                <input
                  key={classItem}
                  className="btn btn-sm rounded-full"
                  type="checkbox"
                  aria-label={classItem}
                  value={classItem}
                  checked={runnerClassFilter.includes(classItem)}
                  onChange={(e) =>
                    handleCheckboxChange(
                      e,
                      runnerClassFilter,
                      setRunnerClassFilter
                    )
                  }
                />
              ))}
            </form>

            <form className="flex flex-row flex-wrap gap-1">
              <input
                className="btn btn-sm btn-circle"
                type="reset"
                value="×"
                aria-label="Häuserfilter zurücksetzen"
                onClick={(e) => resetFilter(e, setRunnerHouseFilter)}
              />
              {houses.map((house) => (
                <input
                  key={house.abbreviation}
                  className="btn btn-sm rounded-full"
                  type="checkbox"
                  aria-label={house.name}
                  value={house.abbreviation}
                  checked={runnerHouseFilter.includes(house.abbreviation)}
                  onChange={(e) =>
                    handleCheckboxChange(
                      e,
                      runnerHouseFilter,
                      setRunnerHouseFilter
                    )
                  }
                />
              ))}
            </form>
          </div>
        </div>

        <ul className="list">
          {runnersWithLapCount
            .filter((runnerWithLapCount) => {
              return filterRunner(runnerWithLapCount, {
                filterType: runnerTypeFilter,
                filterName: searchRunnerName,
                filterClasses: runnerClassFilter,
                filterHouse: runnerHouseFilter,
              });
            })
            .sort((a, b) => b.lapCount - a.lapCount)
            .map((runnerWithLapCount) => {
              return (
                <ListItem
                  id={runnerWithLapCount.email}
                  highlight={runnerWithLapCount.email === user?.email}
                  key={runnerWithLapCount.number}
                  number={getPosition(runnerWithLapCount) + 1}
                  mainContent={runnerWithLapCount.name}
                  secondaryContent={`Nr. ${runnerWithLapCount.number}${
                    runnerWithLapCount.class
                      ? ', ' + runnerWithLapCount.class
                      : ''
                  }${runnerWithLapCount.house ? ', ' + houses.filter((h) => h.abbreviation === runnerWithLapCount.house).map((h) => h.name)[0] : ''}`}
                >
                  <div className="text-lg">
                    {runnerWithLapCount.lapCount.toString()}
                  </div>
                </ListItem>
              );
            })}
          <li className="p-4 opacity-60 tracking-wide text-center">
            Keine weiteren Läufer
          </li>
        </ul>

        {user.email !== null && (
          <button
            className="btn btn-circle btn-outline btn-primary fixed bottom-20 right-4 z-50 aspect-square border-2 shadow-md"
            onClick={scrollToUser}
            aria-label="Zu meinem Ergebnis"
          >
            <Icon name="UserIcon" />
          </button>
        )}

        <div className="grow" />
      </main>
    </>
  );
}

export default withUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Loading,
  // @ts-ignore
})(RankingPage);
