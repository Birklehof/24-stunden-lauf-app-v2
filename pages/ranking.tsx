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
import { assistantNavItems, filterRunner, runnerNavItems } from '@/lib/utils';
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

  function scrollToUser() {
    if (user.email == null) {
      return;
    }
    document.getElementById(user.email)?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    });
  }

  return (
    <>
      <Head title="Läufer" />

      <SearchBar
        info={'Stand '
          .concat(
            new Date(lastUpdated)
              .toLocaleDateString('de-DE', {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
                timeZone: 'Europe/Berlin',
              })
              .toString()
          )
          .concat(' ')
          .concat(
            new Date(lastUpdated)
              .toLocaleString('de-DE', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Europe/Berlin',
              })
              .toString()
          )
          .concat(' Uhr')}
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

      {user.id === process.env.NEXT_PUBLIC_ASSISTANT_ACCOUNT_UID ? (
        <Menu navItems={assistantNavItems} />
      ) : (
        <Menu navItems={runnerNavItems} />
      )}

      <main>
        <SearchBarPlaceholder />

        <div className="flex w-full flex-col items-center justify-start bg-base-100">
          <div className="vertical-list max-w-xl ">
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
                    id={runnerWithLapCount.email}
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
            <div className="w-full border-t-2 border-t-base-content p-3 text-center">
              Keine weiteren Läufer
            </div>
          </div>

          {user.email !== null && (
            <div className="tooltip tooltip-left" data-tip="Zu meinem Ergebnis">
              <button
                className="btn-primary btn-circle btn-outline btn fixed bottom-20 right-4 z-50 aspect-square shadow-md border-2"
                onClick={scrollToUser}
                aria-label="Zu meinem Ergebnis"
              >
                <Icon name="UserIcon" />
              </button>
            </div>
          )}
        </div>

        <div className="grow" />

        <MenuPlaceholder />
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
