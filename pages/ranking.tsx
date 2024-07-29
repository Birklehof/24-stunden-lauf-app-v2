import { useState } from 'react';
import Loading from '@/components/Loading';
import Head from '@/components/Head';
import useRemoteConfig from '@/lib/firebase/useRemoteConfig';
import { RunnerWithLapCount } from '@/lib/interfaces';
import SearchBar from '@/components/SearchBar';
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
} from '@/lib/utils';
import Menu from '@/components/Menu';
import MenuPlaceholder from '@/components/MenuPlaceholder';
import SearchBarPlaceholder from '@/components/SearchBarPlaceholder';

// Incremental static regeneration to reduce load on backend
export async function getStaticProps() {
  return {
    props: {
      runnersWithLapCount: JSON.parse(
        JSON.stringify(await getRunnersWithLapCount())
      ),
      lastUpdated: Date.now(),
    },
    revalidate: 60 * 3, // Revalidate at most every 3 minutes
  };
}

function RankingPage({
  runnersWithLapCount,
  lastUpdated,
}: {
  runnersWithLapCount: RunnerWithLapCount[];
  lastUpdated: number;
}) {
  const user = useUser();

  const [classes] = useRemoteConfig('classes', defaultClasses);
  const [houses] = useRemoteConfig('houses', defaultHouses);

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

  return (
    <>
      <Head title="Läufer" />

      {user.id === process.env.NEXT_PUBLIC_ASSISTANT_ACCOUNT_UID ? (
        <Menu navItems={assistantNavItems} />
      ) : (
        <Menu navItems={runnerNavItems} />
      )}

      <main className="flex !h-auto !min-h-[100dvh] min-h-[100vh] w-full flex-col items-center justify-start bg-base-100">
        <SearchBarPlaceholder />
        <SearchBar
          backLink={
            user?.id === process.env.NEXT_PUBLIC_ASSISTANT_ACCOUNT_UID
              ? '/assistant'
              : '/runner'
          }
          searchValue={filterName}
          setSearchValue={setFilterName}
          filters={[
            {
              filerValue: filterType,
              setFilterValue: setFilterType,
              filterOptions: [
                { value: '', label: 'Alle Läufer' },
                { value: 'student', label: 'Schüler' },
                { value: 'staff', label: 'Mitarbeiter' },
                { value: 'other', label: 'Gäste' },
              ],
            },
            {
              filerValue: filterClasses,
              setFilterValue: setFilterClasses,
              filterOptions: [
                { value: '', label: 'Alle Klassen' },
                ...classes.map((_class) => ({
                  value: _class,
                  label: _class,
                })),
              ],
            },
            {
              filerValue: filterHouse,
              setFilterValue: setFilterHouse,
              filterOptions: [
                { value: '', label: 'Alle Häuser' },
                ...houses.map((house) => ({
                  value: house.abbreviation,
                  label: house.name,
                })),
              ],
            },
          ]}
        />

        <div className="vertical-list">
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
                  highlight={runnerWithLapCount.email === user?.email}
                  key={runnerWithLapCount.number}
                  number={getPosition(runnerWithLapCount) + 1}
                  mainContent={runnerWithLapCount.name}
                >
                  <div className="flex w-1/4 flex-row items-center justify-between pr-1">
                    <div className="pr-2">
                      <div className="text-center text-lg md:text-xl">
                        {runnerWithLapCount.lapCount.toString()}
                      </div>
                    </div>
                  </div>
                </ListItem>
              );
            })}
          <div className="w-full p-3 text-center">Keine weiteren Läufer</div>
          <div className="justify-left flex w-full gap-1 px-2 pb-2 pt-10 text-center text-sm">
            <Icon name="InformationCircleIcon" />
            Stand{' '}
            {new Date(lastUpdated).toLocaleDateString('de-DE', {
              weekday: 'long',
              day: '2-digit',
              month: '2-digit',
              timeZone: 'Europe/Berlin',
            })}{' '}
            {new Date(lastUpdated).toLocaleString('de-DE', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Europe/Berlin',
            })}
            Uhr
          </div>
        </div>
      </main>

      <MenuPlaceholder />
    </>
  );
}

export default withUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Loading,
  // @ts-ignore
})(RankingPage);
