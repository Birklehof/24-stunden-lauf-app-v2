/* eslint-disable no-undef */
import ConfettiCanvas from '@/components/Confetti';
import Head from '@/components/Head';
import ListItem from '@/components/ListItem';
import { Lap, Runner } from '@/lib/interfaces';
import { getRunnersDict } from '@/lib/utils/firebase/backend';
import { syncNewestLaps } from '@/lib/utils/firebase/frontend';
import { useEffect, useState } from 'react';

export async function getStaticProps() {
  const runners = await getRunnersDict();

  return {
    props: {
      runners: JSON.parse(JSON.stringify(runners)),
    },
    revalidate: 60 * 10,
  };
}

const startDate = new Date(process.env.NEXT_PUBLIC_START_TIME as string);

function StatusBoardPage({ runners }: { runners: { [id: string]: Runner } }) {
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);

  useEffect(() => {
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 24);

    const updateRemainingTime = () => {
      const now = new Date();
      const diffInSeconds = Math.max(
        0,
        Math.floor((endDate.getTime() - now.getTime()) / 1000)
      );
      setRemainingSeconds(diffInSeconds);
    };

    updateRemainingTime(); // Initial call
    const intervalId = setInterval(updateRemainingTime, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    syncNewestLaps(15, setLaps);
  }, []);

  return (
    <>
      <Head title="Status Board" />

      {remainingSeconds === 0 && (
        <ConfettiCanvas timeoutSeconds={60 * 60} />
      )}

      <main className="flex flex-row justify-center gap-4 pr-4 scale-150 translate-y-[25%]">
        <ul className="list h-dvh overflow-hidden col-span-3">
          {laps.length > 0 ? (
            <>
              {laps
                .sort((a, b) => {
                  return (
                    // @ts-ignore
                    b.createdAt - a.createdAt
                  );
                })
                .map((lap) => (
                  <ListItem
                    key={lap.id + lap.createdAt}
                    medals={false}
                    animated={true}
                    number={runners[lap.runnerId]?.number}
                    mainContent={(
                      runners[lap.runnerId]?.name || 'Unbekannt'
                    ).concat(
                      runners[lap.runnerId]?.class
                        ? ', '.concat(runners[lap.runnerId]?.class || '')
                        : ''
                    )}
                  />
                ))}
            </>
          ) : (
            <li className="p-4 opacity-60 tracking-wide text-center">
              Noch keine Runden gezählt
            </li>
          )}
        </ul>
        <fieldset className="fieldset border-base-300 rounded-box border p-4 h-fit w-fit mt-2">
          <legend className="fieldset-legend text-lg font-semibold">
            Verbleibende Zeit
          </legend>
          <div className="grid grid-flow-col gap-5 text-center auto-cols-max mx-auto">
            <div className="flex flex-col p-4 dark:bg-white dark:text-black bg-black text-white rounded-box">
              <span className="countdown font-mono text-5xl">
                <span
                  style={
                    {
                      '--value': new Date(
                        remainingSeconds * 1000
                      ).getUTCHours(),
                    } as React.CSSProperties
                  }
                  aria-live="polite"
                  aria-label={'Verbleibende Stunden'}
                >
                  {new Date(remainingSeconds * 1000).getUTCHours()}
                </span>
              </span>
              Stunden
            </div>
            <div className="flex flex-col p-4 dark:bg-white dark:text-black bg-black text-white rounded-box">
              <span className="countdown font-mono text-5xl">
                <span
                  style={
                    {
                      '--value': new Date(
                        remainingSeconds * 1000
                      ).getUTCMinutes(),
                    } as React.CSSProperties
                  }
                  aria-live="polite"
                  aria-label={'Verbleibende Minuten'}
                >
                  {new Date(remainingSeconds * 1000).getUTCMinutes()}
                </span>
              </span>
              Minuten
            </div>
            <div className="flex flex-col p-4 dark:bg-white dark:text-black bg-black text-white rounded-box">
              <span className="countdown font-mono text-5xl">
                <span
                  style={
                    {
                      '--value': new Date(
                        remainingSeconds * 1000
                      ).getUTCSeconds(),
                    } as React.CSSProperties
                  }
                  aria-live="polite"
                  aria-label={'Verbleibende Sekunden'}
                >
                  {new Date(remainingSeconds * 1000).getUTCSeconds()}
                </span>
              </span>
              Sekunden
            </div>
          </div>
        </fieldset>
      </main>
    </>
  );
}

export default StatusBoardPage;
