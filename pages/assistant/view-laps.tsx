import { useEffect, useState } from 'react';
import Head from '@/components/Head';
import Loading from '@/components/Loading';
import useAuth from '@/lib/hooks/useAuth';
import Icon from '@/components/Icon';
import useCollectionAsList from '@/lib/hooks/useCollectionAsList';
import useCollectionAsDict from '@/lib/hooks/useCollectionAsDict';
import { Runner, Lap } from '@/lib/interfaces';
import { deleteLap } from '@/lib/firebaseUtils';

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
        <div className="searchbox">
          <div className="input-elements-container">
            <input
              type="text"
              placeholder="Suchen..."
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
        </div>
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
                <div key={lap.id} className="list-item">
                  <span className="leading-zeros font-semibold">
                    {'0'.repeat(
                      3 - runners[lap.runnerId]?.number.toString().length
                    )}
                  </span>
                  <span className="pr-3 font-semibold">
                    {runners[lap.runnerId]?.number}
                  </span>
                  <span className="overflow-hidden whitespace-nowrap pr-1">
                    <span className="overflow-hidden text-ellipsis font-semibold">
                      {runners[lap.runnerId]?.name || 'Unbekannt'}
                    </span>
                  </span>
                  <span className="overflow-hidden whitespace-nowrap">
                    <span className="overflow-hidden text-ellipsis">
                      {lap.timestamp.toDate().getDay() == new Date().getDay() &&
                      lap.timestamp.toDate().getMonth() ==
                        new Date().getMonth() &&
                      lap.timestamp.toDate().getFullYear() ==
                        new Date().getFullYear()
                        ? 'heute'
                        : 'am ' +
                          lap.timestamp
                            .toDate()
                            .toLocaleDateString('de-DE')}{' '}
                      {lap.timestamp.toDate().getHours().toString() +
                        ':' +
                        lap.timestamp.toDate().getMinutes().toString()}
                    </span>
                  </span>
                  <div className="spacer" />
                  <button
                    className="btn-outline btn-error btn-square btn-sm btn text-error"
                    aria-label="Runde löschen"
                    onClick={() => deleteLapHandler(lap.id)}
                  >
                    <Icon name="TrashIcon" />
                  </button>
                </div>
              );
            })}
        </div>
      </main>
    </>
  );
}
