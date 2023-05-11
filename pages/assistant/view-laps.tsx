import { useEffect, useState } from 'react';
import Head from '@/components/Head';
import Loading from '@/components/Loading';
import useAuth from '@/lib/hooks/useAuth';
import Icon from '@/components/Icon';
import useCollectionAsList from '@/lib/hooks/useCollectionAsList';
import useCollectionAsDict from '@/lib/hooks/useCollectionAsDict';
import { Runner, Lap } from '@/lib/interfaces';
import { deleteLap } from '@/lib/firebaseUtils';
import SearchBar from '@/components/SearchBar';
import ListItem from '@/components/ListItem';

export default function AssistantViewLaps() {
  const [laps, lapsLoading, lapsError] = useCollectionAsList<Lap>(
    'apps/24-stunden-lauf/laps'
  );
  const [runners, runnersLoading, runnersError] = useCollectionAsDict<Runner>(
    'apps/24-stunden-lauf/runners'
  );

  const { isLoggedIn, user } = useAuth();

  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  if (!user || lapsLoading || runnersLoading) {
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
      !runners[lap.runnerId].name
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
        <SearchBar searchValue={filterName} setSearchValue={setFilterName} />
        {/* <div className="searchbox">
          <div className="input-elements-container">
            <input
              type="text"
              placeholder="Suchen..."
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
        </div> */}
        <div className="vertical-list !gap-2 !pt-20">
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
                <ListItem
                  key={lap.id}
                  number={runners[lap.runnerId]?.number}
                  mainContent={runners[lap.runnerId]?.name || 'Unbekannt'}
                  secondaryContent={
                    (lap.timestamp.toDate().getDay() == new Date().getDay() &&
                    lap.timestamp.toDate().getMonth() ==
                      new Date().getMonth() &&
                    lap.timestamp.toDate().getFullYear() ==
                      new Date().getFullYear()
                      ? 'heute'
                      : 'am ' +
                        lap.timestamp.toDate().toLocaleDateString('de-DE')) +
                    ' ' +
                    lap.timestamp.toDate().getHours().toString() +
                    ':' +
                    lap.timestamp.toDate().getMinutes().toString()
                  }
                >
                  <button
                    className="btn-outline btn-error btn-square btn-sm btn text-error"
                    aria-label="Runde löschen"
                    onClick={() => deleteLapHandler(lap.id)}
                  >
                    <Icon name="TrashIcon" />
                  </button>
                </ListItem>
              );
            })}
          <div className="w-full text-center text-sm">Keine weiteren Runden</div>
        </div>
      </main>
    </>
  );
}
