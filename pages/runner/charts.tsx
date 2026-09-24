import Head from '@/components/Head';
import { Line, Pie } from 'react-chartjs-2';
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
import {
  getLapsInHour,
  getRunnersArray,
} from '@/lib/utils/firebase/backend';
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
      cur.type === 'student'
        ? cur.house || ''
        : 'Extern (Mitarbeiter + Gäste)';

    acc[house] = (acc[house] || 0) + (cur.laps || 0);

    return acc;
  }, {});

  // Count runners by house.
  const runnersPerHouse = runners.reduce<NumberMap>((acc, cur) => {
    const house =
      cur.type === 'student'
        ? cur.house || ''
        : 'Extern (Mitarbeiter + Gäste)';

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

  const lapCountByHour: NumberMap = Object.fromEntries(
    lapCountByHourEntries
  );

  return {
    props: {
      runnerCount: runners.length,
      lapsTotal: runners.reduce(
        (acc, cur) => acc + (cur.laps || 0),
        0
      ),
      lapCountByHour,
      lapCountByHouse,
      averageLapCountByHouse,
      lapCountByClass,
      averageLapCountByClass,
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
  lapCountByClass: NumberMap;
  averageLapCountByClass: NumberMap;
}

function RunnerGraphsPage({
  runnerCount,
  lapsTotal,
  lapCountByHour,
  lapCountByHouse,
  averageLapCountByHouse,
  lapCountByClass,
  averageLapCountByClass,
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
  const [cardColor, setCardColor] = useState('white');

  useEffect(() => {
    const style = getComputedStyle(document.body);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTextColor(
      style.getPropertyValue('--color-base-content').trim() || 'black'
    );

    setCardColor(
      style.getPropertyValue('--color-base-100').trim() || 'white'
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

  const colors = [
    '#68023f',
    '#008169',
    '#ef0096',
    '#00dcb5',
    '#ffcfe2',
    '#003c86',
    '#9400e6',
    '#009ffa',
    '#ff71fd',
    '#7cfffa',
    '#6a0213',
    '#008607',
    '#f60239',
    '#00e307',
    '#ffdc3d',
  ];

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

  const averageLapCountByHouseData = {
    labels: Object.keys(averageLapCountByHouse).map(getHouseLabel),
    datasets: [
      {
        label: 'Laps',
        data: Object.values(averageLapCountByHouse),
        fill: 'start' as const,
        backgroundColor: colors,
        borderColor: cardColor,
      },
    ],
  };

  const lapCountByHouseData = {
    labels: Object.keys(lapCountByHouse).map(getHouseLabel),
    datasets: [
      {
        label: 'Laps',
        data: Object.values(lapCountByHouse),
        fill: 'start' as const,
        backgroundColor: colors,
        borderColor: cardColor,
      },
    ],
  };

  const lapCountByClassData = {
    labels: Object.keys(lapCountByClass),
    datasets: [
      {
        label: 'Laps',
        data: Object.values(lapCountByClass),
        fill: 'start' as const,
        backgroundColor: colors,
        borderColor: cardColor,
      },
    ],
  };

  const averageLapCountByClassData = {
    labels: Object.keys(averageLapCountByClass),
    datasets: [
      {
        label: 'Laps',
        data: Object.values(averageLapCountByClass),
        fill: 'start' as const,
        backgroundColor: colors,
        borderColor: cardColor,
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

  const pieOptions = {
    aspectRatio: 0.75,
    hoverOffset: 2,
    clip: false as const,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
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
      <Head title="Läufer Details" />

      {lapCount !== undefined &&
        runner.goal !== undefined &&
        lapCount >= runner.goal && <ConfettiCanvas />}

      <Menu navItems={runnerNavItems} />

      <main className="flex flex-col items-center gap-7 m-2">
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
                className="progress progress-primary h-5 rounded-full bg-accent shadow-inner"
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
                    ? (lapsTotal / runnerCount)
                        .toFixed(1)
                        .replace('.', ',')
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

        <div className="flex flex-col gap-2 w-full max-w-sm">
          <h2 className="px-8 text-center text-xl font-semibold">
            Ø Runden pro Haus
          </h2>

          <Pie
            data={averageLapCountByHouseData}
            options={pieOptions}
          />
        </div>

        <div className="flex flex-col gap-2 w-full max-w-sm">
          <h2 className="px-8 text-center text-xl font-semibold">
            Ø Runden pro Klasse
          </h2>

          <Pie
            data={averageLapCountByClassData}
            options={pieOptions}
          />
        </div>

        <div className="flex flex-col gap-2 w-full max-w-sm">
          <h2 className="px-8 text-center text-xl font-semibold">
            Runden pro Haus
          </h2>

          <Pie
            data={lapCountByHouseData}
            options={pieOptions}
          />
        </div>

        <div className="flex flex-col gap-2 w-full max-w-sm">
          <h2 className="px-8 text-center text-xl font-semibold">
            Runden pro Klasse
          </h2>

          <Pie
            data={lapCountByClassData}
            options={pieOptions}
          />
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
