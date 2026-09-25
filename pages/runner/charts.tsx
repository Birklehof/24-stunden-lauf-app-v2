import Head from '@/components/Head';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import useRemoteConfig from '@/lib/firebase/useRemoteConfig';
import { defaultDistancePerLap } from '@/lib/firebase/remoteConfigDefaultValues';
import { AuthAction, useUser, withUser } from 'next-firebase-auth';
import { getLapsInHour, getRunnersArray } from '@/lib/utils/firebase/backend';
import Menu from '@/components/Menu';
import { formatKilometer, runnerNavItems } from '@/lib/utils';
import Stat from '@/components/Stat';
import Loading from '@/components/Loading';
import { useEffect, useState } from 'react';
import { Runner } from '@/lib/interfaces';
import { getRunner, syncLapCount } from '@/lib/utils/firebase/frontend';
import { useRouter } from 'next/router';
import ConfettiCanvas from '@/components/Confetti';

// Register Chart.js components once, outside the component.
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type NumberMap = Record<string, number>;

export async function getStaticProps() {
  const runners = await getRunnersArray();

  // Count laps by house.
  const lapCountByHouse = runners.reduce<NumberMap>((acc, cur) => {
    const house =
      cur.type === 'student' ? cur.house || '' : 'Extern (Mitarbeiter + Gäste)';

    acc[house] = (acc[house] || 0) + (cur.laps || 0);

    return acc;
  }, {});

  // Count runners by house.
  const runnersPerHouse = runners.reduce<NumberMap>((acc, cur) => {
    const house =
      cur.type === 'student' ? cur.house || '' : 'Extern (Mitarbeiter + Gäste)';

    acc[house] = (acc[house] || 0) + 1;

    return acc;
  }, {});

  // Calculate average laps by house.
  const averageLapCountByHouse = Object.fromEntries(
    Object.entries(lapCountByHouse).map(([house, lapCount]) => [
      house,
      lapCount / runnersPerHouse[house],
    ])
  );

  // Count laps by class.
  const lapCountByClass = runners.reduce<NumberMap>((acc, cur) => {
    const className = cur.class || '';

    if (className) {
      acc[className] = (acc[className] || 0) + (cur.laps || 0);
    }

    return acc;
  }, {});

  // Count runners by class.
  const runnersPerClass = runners.reduce<NumberMap>((acc, cur) => {
    const className = cur.class || '';

    if (className) {
      acc[className] = (acc[className] || 0) + 1;
    }

    return acc;
  }, {});

  // Calculate average laps by class.
  const averageLapCountByClass = Object.fromEntries(
    Object.entries(lapCountByClass).map(([className, lapCount]) => [
      className,
      lapCount / runnersPerClass[className],
    ])
  );

  // Get the 24 hours after the start of the event.
  const hoursAfterStart = Array.from({ length: 24 }, (_, i) => i + 1).map(
    (i) => {
      const date = new Date(process.env.NEXT_PUBLIC_START_TIME as string);

      date.setHours(date.getHours() - i + 24);

      return date;
    }
  );

  // Get the number of laps for each hour.
  const lapCountByHourEntries = await Promise.all(
    hoursAfterStart.map(async (date) => {
      const label = date.toLocaleString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Berlin',
      });

      return [label, await getLapsInHour(date)] as const;
    })
  );

  const lapCountByHour: NumberMap = Object.fromEntries(lapCountByHourEntries);

  return {
    props: {
      runnerCount: runners.length,
      lapsTotal: runners.reduce((acc, cur) => acc + (cur.laps || 0), 0),
      lapCountByHour,
      lapCountByHouse,
      averageLapCountByHouse,
      runnersPerHouse,
      lapCountByClass,
      averageLapCountByClass,
      runnersPerClass,
    },
    revalidate: 10,
  };
}

interface RunnerGraphsPageProps {
  runnerCount: number;
  lapsTotal: number;
  lapCountByHour: NumberMap;
  lapCountByHouse: NumberMap;
  averageLapCountByHouse: NumberMap;
  runnersPerHouse: NumberMap;
  lapCountByClass: NumberMap;
  averageLapCountByClass: NumberMap;
  runnersPerClass: NumberMap;
}

function RunnerGraphsPage({
  runnerCount,
  lapsTotal,
  lapCountByHour,
  lapCountByHouse,
  averageLapCountByHouse,
  runnersPerHouse,
  lapCountByClass,
  averageLapCountByClass,
  runnersPerClass,
}: RunnerGraphsPageProps) {
  const [houseAbbreviationTranslations] = useRemoteConfig<
    {
      name: string;
      abbreviation: string;
    }[]
  >('houseAbbreviationTranslations', []);

  const user = useUser();
  const router = useRouter();

  const [lapCount, setLapCount] = useState<number | undefined>(undefined);
  const [runner, setRunner] = useState<Runner | null>(null);

  const [textColor, setTextColor] = useState('black');

  useEffect(() => {
    const style = getComputedStyle(document.body);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTextColor(
      style.getPropertyValue('--color-base-content').trim() || 'black'
    );
  }, []);

  useEffect(() => {
    if (!user.email) {
      return;
    }

    getRunner(user.email)
      .then((runner) => {
        setRunner(runner);
      })
      .catch(() => {
        router.push('/runner-not-found');
      });
  }, [user.email, router]);

  useEffect(() => {
    if (!runner?.id) {
      return;
    }

    syncLapCount(runner.id, setLapCount);
  }, [runner?.id]);

  const [distancePerLap] = useRemoteConfig(
    'distancePerLap',
    defaultDistancePerLap
  );

  const getHouseLabel = (house: string) => {
    return (
      houseAbbreviationTranslations.find(
        (translation) => translation.name === house
      )?.abbreviation ||
      house ||
      'Sonstige'
    );
  };

  const lapCountByHourData = {
    labels: Object.keys(lapCountByHour).reverse(),
    datasets: [
      {
        label: 'Laps',
        data: Object.values(lapCountByHour).reverse(),
        fill: 'start' as const,
        backgroundColor: 'rgba(165, 192, 42, 0.4)',
        borderColor: 'rgba(165, 192, 42, 1)',
        borderWidth: 1.5,
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 3,
        fill: 'start' as const,
      },
      point: {
        radius: 0,
        hitRadius: 0,
      },
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 14,
          },
        },
      },
      y: {
        min: 0,
        suggestedMax: 10,
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 14,
          },
        },
      },
    },
    animation: false as const,
  };

  if (!runner || !user) {
    return <Loading />;
  }

  const totalDistance = lapsTotal * distancePerLap;

  return (
    <>
      <Head title="Statistiken" />

      {lapCount !== undefined &&
        runner.goal !== undefined &&
        lapCount >= runner.goal && <ConfettiCanvas />}

      <Menu navItems={runnerNavItems} />

      <main className="flex flex-col items-center gap-8 m-2">
        <fieldset className="fieldset border-base-300 rounded-box border p-4 h-fit max-w-md">
          <legend className="fieldset-legend text-lg font-semibold">
            Persönlicher Fortschritt
          </legend>

          <p className="pb-2 text-base">
            Hier siehst du, wie nah du deinem Ziel schon gekommen bist.
          </p>

          <div className="px-1">
            {runner.goal !== undefined ? (
              <progress
                className="progress progress-primary h-5 dark:bg-accent rounded-full shadow-inner"
                value={lapCount ?? 0}
                max={runner.goal}
              />
            ) : (
              <div className="skeleton h-6 w-full" />
            )}
          </div>

          <p className="font-semibold ml-2">
            {lapCount ?? 0} / {runner.goal ?? 'NaN'} Runden
          </p>
        </fieldset>

        <div className="flex flex-col gap-4 max-w-4xl w-full">
          <div className="grid grid-cols-2 gap-3 gap-y-9 md:grid-cols-4">
            <div className="card card-compact flex items-center justify-center">
              <Stat value={runnerCount} label="Läufer*innen" />
            </div>

            <div className="card card-compact flex items-center justify-center">
              <Stat value={lapsTotal} label="Runden gesamt" />
            </div>

            <div className="card card-compact flex items-center justify-center">
              <Stat
                value={
                  runnerCount > 0
                    ? (lapsTotal / runnerCount).toFixed(1).replace('.', ',')
                    : '0'
                }
                label="Ø Runden pro Läufer*in"
              />
            </div>

            <div className="card card-compact flex items-center justify-center">
              <Stat
                value={formatKilometer(totalDistance)
                  .toString()
                  .replace('.', ',')}
                label="km Gesamtstrecke"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 max-w-4xl w-full">
          <h2 className="px-8 text-center text-xl font-semibold">
            Rundenverlauf
          </h2>

          <Line data={lapCountByHourData} options={lineOptions} />
        </div>

        <div className="flex flex-col gap-2 max-w-4xl w-full mb-4">
          <div className="tabs tabs-box w-full bg-base-100">
            {/* Häuser */}
            <input
              type="radio"
              name="stats_tabs"
              className="tab w-1/2 font-bold checked:bg-primary"
              aria-label="Häuser"
              defaultChecked
            />

            <div className="tab-content">
              <div className="overflow-x-auto">
                <table className="table dark:table-zebra">
                  <thead>
                    <tr>
                      <th>Haus</th>
                      <th>
                        Läufer*
                        <br />
                        innen
                      </th>
                      <th>Runden</th>
                      <th>Ø Runden</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Object.entries(lapCountByHouse)
                      .sort(([, a], [, b]) => b - a)
                      .map(([house, totalLaps]) => {
                        const average = averageLapCountByHouse[house];

                        return (
                          <tr key={house}>
                            <td className="font-medium">
                              {getHouseLabel(house)}
                            </td>

                            <td className="text-right">
                              {runnersPerHouse[house]}
                            </td>

                            <td className="text-right font-semibold">
                              {totalLaps}
                            </td>

                            <td className="text-right">
                              {average.toFixed(1).replace('.', ',')}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Klassen */}
            <input
              type="radio"
              name="stats_tabs"
              className="tab w-1/2 font-bold checked:bg-primary"
              aria-label="Klassen"
            />

            <div className="tab-content">
              <div className="overflow-x-auto">
                <table className="table dark:table-zebra">
                  <thead>
                    <tr>
                      <th>Klasse</th>
                      <th>
                        Läufer*
                        <br />
                        innen
                      </th>
                      <th>Runden</th>
                      <th>Ø Runden</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Object.entries(lapCountByClass)
                      .sort(([, a], [, b]) => b - a)
                      .map(([className, totalLaps]) => {
                        const average = averageLapCountByClass[className];

                        return (
                          <tr key={className}>
                            <td className="font-medium">{className}</td>

                            <td className="text-right">
                              {runnersPerClass[className]}
                            </td>

                            <td className="text-right font-semibold">
                              {totalLaps}
                            </td>

                            <td className="text-right">
                              {average.toFixed(1).replace('.', ',')}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default withUser<RunnerGraphsPageProps>({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Loading,
})(RunnerGraphsPage);
