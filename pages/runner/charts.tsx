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

// Incremental static regeneration to reduce load on backend
export async function getStaticProps() {
  const runners = await getRunnersArray();

  // Count how many laps each house has, the house is a property of the runner
  const lapCountByHouse: { [key: string]: number } = runners.reduce(
    (acc: { [key: string]: number }, cur) => ({
      ...acc,
      // @ts-ignore
      [cur.type == 'student'
        ? cur.house || ''
        : 'Extern (Mitarbeiter + Gäste)']:
        (acc[
          cur.type == 'student'
            ? cur.house || ''
            : 'Extern (Mitarbeiter + Gäste)'
        ] || 0) + (cur.laps || 0),
    }),
    {}
  );

  // Count how many laps each house has on average, the house is a property of the runner
  const runnersPerHouse: { [key: string]: number } = runners.reduce(
    (acc: { [key: string]: number }, cur) => ({
      ...acc,
      // @ts-ignore
      [cur.type == 'student'
        ? cur.house || ''
        : 'Extern (Mitarbeiter + Gäste)']:
        (acc[
          cur.type == 'student'
            ? cur.house || ''
            : 'Extern (Mitarbeiter + Gäste)'
        ] || 0) + 1,
    }),
    {}
  );
  const averageLapCountByHouse: { [key: string]: number } = Object.fromEntries(
    Object.entries(lapCountByHouse).map(([house, lapCount]) => [
      house,
      lapCount / runnersPerHouse[house],
    ])
  );

  // Count how many laps each class has, the class is a property of the runner
  const lapCountByClass: { [key: string]: number } = runners.reduce(
    (acc, cur) => ({
      ...acc,
      // @ts-ignore
      [cur.class || '']: (acc[cur.class || ''] || 0) + (cur.laps || 0),
    }),
    {}
  );
  delete lapCountByClass[''];

  // Count how many laps each class has on average, the class is a property of the runner
  const runnersPerClass: { [key: string]: number } = runners.reduce(
    (acc, cur) => ({
      ...acc,
      // @ts-ignore
      [cur.class || '']: (acc[cur.class || ''] || 0) + 1,
    }),
    {}
  );
  const averageLapCountByClass: { [key: string]: number } = Object.fromEntries(
    Object.entries(lapCountByClass).map(([grade, lapCount]) => [
      grade,
      lapCount / runnersPerClass[grade],
    ])
  );

  // Get the 24 hours before the end of the event
  const hoursBeforeEnd = Array.from({ length: 24 }, (_, i) => i + 1).map(
    (i) => {
      const date = new Date(process.env.NEXT_PUBLIC_START_TIME as string); // TODO: Change to not be hardcoded
      date.setHours(date.getHours() - i);
      return date;
    }
  );

  // For each hour, get the number of laps
  const lapCountByHour = Object.fromEntries(
    await Promise.all(
      hoursBeforeEnd.map(async (date) => {
        const label = date.toLocaleString('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Berlin',
        });

        return [label, await getLapsInHour(date)];
      })
    )
  );

  return {
    props: {
      runnerCount: runners.length,
      lapsTotal: runners.reduce(
        (acc, cur) => acc + (cur.laps || 0),
        0
      ),
      lapCountByHour: JSON.parse(JSON.stringify(lapCountByHour)),
      lapCountByHouse: JSON.parse(JSON.stringify(lapCountByHouse)),
      averageLapCountByHouse: JSON.parse(
        JSON.stringify(averageLapCountByHouse)
      ),
      lapCountByClass: JSON.parse(JSON.stringify(lapCountByClass)),
      averageLapCountByClass: JSON.parse(
        JSON.stringify(averageLapCountByClass)
      ),
    },
    revalidate: 60 * 3,
  };
}

function RunnerGraphsPage({
  runnerCount,
  lapsTotal,
  lapCountByHour,
  lapCountByHouse,
  averageLapCountByHouse,
  lapCountByClass,
  averageLapCountByClass,
}: {
  runnerCount: number;
  lapsTotal: number;
  lapCountByHour: { [hour: string]: number };
  lapCountByHouse: { [key: string]: number };
  averageLapCountByHouse: { [key: string]: number };
  lapCountByClass: { [key: string]: number };
  averageLapCountByClass: { [key: string]: number };
}) {
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

  const [textColor, setTextColor] = useState<string>('black');
  const [cardColor, setCardColor] = useState<string>('white');

  useEffect(() => {
    const style = getComputedStyle(document.body);
    setTextColor(style.getPropertyValue('--color-base-content'));
    setCardColor(style.getPropertyValue('--color-base-100'));
  }, []);

  useEffect(() => {
    if (user.email) {
      getRunner(user.email)
        .then(async (runner) => {
          setRunner(runner);
        })
        .catch(() => {
          router.push('/runner-not-found');
        });
    }
  }, [user, router]);

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

  Chart.register({
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  });

  const lapCountByHourData = {
    labels: Object.keys(lapCountByHour).reverse(),
    datasets: [
      {
        label: 'Laps',
        data: Object.values(lapCountByHour).reverse(),
        fill: 'start',
        backgroundColor: 'rgba(165, 192, 42, 0.4)',
        borderColor: 'rgba(165, 192, 42, 1)',
        borderWidth: 1.5,
        tension: 0.4,
      },
    ],
  };

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

  const averageLapCountByHouseData = {
    labels: Object.keys(lapCountByHouse).map((house) => {
      // @ts-ignore
      return (
        houseAbbreviationTranslations.find(
          (translation) => translation.name === house
        )?.abbreviation ||
        house ||
        'Sonstige'
      );
    }),
    datasets: [
      {
        label: 'Laps',
        data: Object.values(averageLapCountByHouse),
        fill: 'start',
        backgroundColor: colors,
        borderColor: cardColor,
      },
    ],
  };

  const lapCountByHouseData = {
    labels: Object.keys(lapCountByHouse).map((house) => {
      // @ts-ignore
      return (
        houseAbbreviationTranslations.find(
          (translation) => translation.name === house
        )?.abbreviation ||
        house ||
        'Sonstige'
      );
    }),
    datasets: [
      {
        label: 'Laps',
        data: Object.values(lapCountByHouse),
        fill: 'start',
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
        fill: 'start',
        backgroundColor: colors,
        borderColor: cardColor,
      },
    ],
  };

  const averageLapCountByClassData = {
    labels: Object.keys(lapCountByClass),
    datasets: [
      {
        label: 'Laps',
        data: Object.values(averageLapCountByClass),
        fill: 'start',
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
        fill: 'start',
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
      xAxis: {
        display: false,
      },
    },
    animation: false,
  };

  const pieOptions = {
    aspectRatio: 0.75,
    hoverOffset: 2,
    clip: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          font: {
            size: 14,
          },
        },
      },
    },
    animation: false,
  };

  if (!runner || !user) {
    return <Loading />;
  }

  return (
    <>
      <Head title="Läufer Details" />

      {(lapCount != undefined && runner.goal != undefined && (lapCount >= runner?.goal)) && <ConfettiCanvas />}

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
            {runner?.goal ? (
              <progress
                className="progress progress-primary h-5 rounded-full bg-accent shadow-inner"
                value={
                  lapCount
                }
                max={runner?.goal || 0}
              ></progress>
            ) : (
              <div className="skeleton h-6 w-full"></div>
            )}
          </div>
          <p className="font-semibold ml-2">
            {lapCount || 'NaN'}{' '}
            / {runner?.goal || 'NaN'} Runden
          </p>
        </fieldset>

        <div className="flex flex-col gap-4 max-w-4xl w-full">
          <div className="grid grid-cols-2 gap-3 gap-y-9 md:grid-cols-4">
            <div className="card card-compact flex items-center justify-center">
              <Stat value={runnerCount} label="Teilnehmer" />
            </div>
            <div className="card card-compact flex items-center justify-center">
              <Stat value={lapsTotal} label="Runden gesamt" />
            </div>
            <div className="card card-compact flex items-center justify-center">
              <Stat
                value={(lapsTotal / runnerCount)
                  .toFixed(1)
                  .toString()
                  .replace('.', ',')}
                label="Ø Runden pro Teilnehmer"
              />
            </div>
            <div className="card card-compact flex items-center justify-center">
              <Stat
                value={
                  lapsTotal &&
                  formatKilometer(lapsTotal * distancePerLap)
                    .toString()
                    .replace('.', ',')
                }
                label="km Gesamtstrecke"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 max-w-4xl w-full">
          <h2 className="px-8 text-center text-xl font-semibold">
            Rundenverlauf
          </h2>
          {/* @ts-ignore */}
          <Line data={lapCountByHourData} options={lineOptions} />
        </div>

        <div className="flex flex-col gap-2 w-full max-w-sm">
          <h2 className="px-8 text-center text-xl font-semibold">
            Ø Runden pro Haus
          </h2>
          {/* @ts-ignore */}
          <Pie data={averageLapCountByHouseData} options={pieOptions} />
        </div>

        <div className="flex flex-col gap-2 w-full max-w-sm">
          <h2 className="px-8 text-center text-xl font-semibold">
            Ø Runden pro Klasse
          </h2>
          {/* @ts-ignore */}
          <Pie data={averageLapCountByClassData} options={pieOptions} />
        </div>

        <div className="flex flex-col gap-2 w-full max-w-sm">
          <h2 className="px-8 text-center text-xl font-semibold">
            Runden pro Haus
          </h2>
          {/* @ts-ignore */}
          <Pie data={lapCountByHouseData} options={pieOptions} />
        </div>

        <div className="flex flex-col gap-2 w-full max-w-sm">
          <h2 className="px-8 text-center text-xl font-semibold">
            Runden pro Klasse
          </h2>
          {/* @ts-ignore */}
          <Pie data={lapCountByClassData} options={pieOptions} />
        </div>
      </main>
    </>
  );
}

export default withUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Loading,
  // @ts-ignore
})(RunnerGraphsPage);
