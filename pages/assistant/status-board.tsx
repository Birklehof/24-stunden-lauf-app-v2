/* eslint-disable no-undef */
import ConfettiCanvas from '@/components/Confetti';
import Head from '@/components/Head';
import ListItem from '@/components/ListItem';
import { Lap } from '@/lib/interfaces';
import { syncNewestLaps } from '@/lib/utils/firebase/frontend';
import { useEffect, useState } from 'react';

const startDate = new Date(process.env.NEXT_PUBLIC_START_TIME as string);

function StatusBoardPage() {
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

      {remainingSeconds <= 0 && <ConfettiCanvas timeoutSeconds={60 * 60} />}

      <main className="flex flex-col justify-center w-full h-screen items-center">
        <fieldset className="fieldset border-base-300 rounded-box border p-4 h-fit w-fit mt-2">
          <legend className="fieldset-legend text-lg font-semibold -mb-5">
            {remainingSeconds > 24 * 60 * 60
              ? 'Start in'
              : 'Verbleibende Zeit'}
          </legend>
          <div className="grid grid-flow-col gap-5 text-center auto-cols-max mx-auto">
            <div className="flex flex-col p-4 rounded-box">
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
            <div className="flex flex-col p-4 rounded-box">
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
            <div className="flex flex-col p-4 rounded-box">
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
        <ul className="list h-dvh overflow-hidden col-span-3 gap-6">
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
                    extraLarge={true}
                    animated={true}
                    number={lap.runnerData?.number || 0}
                    mainContent={lap.runnerData?.name || 'Unbekannt'}
                  />
                ))}
            </>
          ) : (
            <li className="p-4 opacity-60 tracking-wide text-center">
              Noch keine Runden gezählt
            </li>
          )}
        </ul>
      </main>
    </>
  );
}

export default StatusBoardPage;
