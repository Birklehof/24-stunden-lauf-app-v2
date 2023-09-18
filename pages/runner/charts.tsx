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
  getRunnersWithLapCount,
} from '@/lib/utils/firebase/backend';
import Menu from '@/components/Menu';
import { formatKilometer, hslToHex, runnerNavItems } from '@/lib/utils';
import Stat from '@/components/Stat';
import Loading from '@/components/Loading';
import { Md5 } from 'ts-md5';
import Icon from '@/components/Icon';
import { useEffect, useState } from 'react';
import { Runner, RunnerWithLapCount } from '@/lib/interfaces';
import { getRunner } from '@/lib/utils/firebase/frontend';

// Incremental static regeneration to reduce load on backend
export async function getStaticProps() {
  const runnersWithLapCount = await getRunnersWithLapCount();

  // const runnersWithLapCount = [
  //   {
  //     id: '1',
  //     name: 'Test',
  //     email: 'paul.maier@s.birklehof.de',
  //     type: 'student',
  //     lapCount: 34,
  //     class: '5a',
  //     house: 'Haupthaus',
  //   },
  //   {
  //     id: '2',
  //     name: 'Test',
  //     type: 'student',
  //     lapCount: 11,
  //     class: '6',
  //     house: 'Test',
  //   },
  //   {
  //     id: '2',
  //     name: 'Test',
  //     type: 'student',
  //     lapCount: 10,
  //     class: '6',
  //     house: 'Why Not',
  //   },
  //   {
  //     id: '2',
  //     name: 'Test',
  //     type: 'student',
  //     lapCount: 12,
  //     class: '7',
  //     house: 'Studio',
  //   },
  //   {
  //     id: '2',
  //     name: 'Test',
  //     type: 'student',
  //     lapCount: 20,
  //     class: '8',
  //     house: 'Haupthaus',
  //   },
  //   {
  //     id: '2',
  //     name: 'Test',
  //     type: 'student',
  //     lapCount: 20,
  //     class: '8',
  //     house: 'Haupthauser',
  //   },
  //   {
  //     id: '2',
  //     name: 'Test',
  //     type: 'student',
  //     lapCount: 20,
  //     class: '8',
  //     house: 'asddasdsads',
  //   },
  //   {
  //     id: '2',
  //     name: 'Test',
  //     type: 'student',
  //     lapCount: 20,
  //     class: '8',
  //     house: 'fsfsadfa',
  //   },
  //   {
  //     id: '2',
  //     name: 'Test',
  //     type: 'student',
  //     lapCount: 20,
  //     class: '8',
  //     house: '423sd',
  //   },
  //   {
  //     id: '2',
  //     name: 'Test',
  //     type: 'student',
  //     lapCount: 20,
  //     class: '8',
  //     house: 'sfsdf fdfwfwe',
  //   }
  // ];

  // Count how many laps each house has, the house is a property of the runner
  const lapCountByHouse: { [key: string]: number } = runnersWithLapCount.reduce(
    (acc: { [key: string]: number }, cur) => ({
      ...acc,
      // @ts-ignore
      [cur.type == 'student' ? cur.house || '' : 'Extern (Kollegium)']:
        (acc[cur.type == 'student' ? cur.house || '' : 'Extern (Kollegium)'] ||
          0) + cur.lapCount,
    }),
    {}
  );
  delete lapCountByHouse[''];

  // Count how many laps each class has, the class is a property of the runner
  const lapCountByClass: { [key: string]: number } = runnersWithLapCount.reduce(
    (acc, cur) => ({
      ...acc,
      // @ts-ignore
      [cur.class || '']: (acc[cur.class || ''] || 0) + cur.lapCount,
    }),
    {}
  );
  delete lapCountByClass[''];

  const n = 23;
  const lapCountByHour = Object.fromEntries(
    await Promise.all(
      Array.from({ length: n }, (_, i) => i + 1).map(async (i) => {
        const currentHour = new Date().getHours();

        const label = new Date(
          (currentHour - i + 2) * 60 * 60 * 1000
        ).toLocaleString('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Berlin',
        });

        return [label, await getLapsInHour(currentHour - i + 1)];
      })
    )
  );

  return {
    props: {
      runnersWithLapCount: JSON.parse(JSON.stringify(runnersWithLapCount)),
      runnerCount: runnersWithLapCount.length,
      lapsTotal: runnersWithLapCount.reduce(
        (acc, cur) => acc + cur.lapCount,
        0
      ),
      lastUpdated: Date.now(),
      lapCountByHour: JSON.parse(JSON.stringify(lapCountByHour)),
      lapCountByHouse: JSON.parse(JSON.stringify(lapCountByHouse)),
      lapCountByClass: JSON.parse(JSON.stringify(lapCountByClass)),
    },
    revalidate: 60 * 3, // Revalidate at most every 3 minutes
  };
}

function RunnerGraphsPage({
  runnersWithLapCount,
  runnerCount,
  lapsTotal,
  lastUpdated,
  lapCountByHour,
  lapCountByHouse,
  lapCountByClass,
}: {
  runnersWithLapCount: RunnerWithLapCount[];
  runnerCount: number;
  lapsTotal: number;
  lastUpdated: number;
  lapCountByHour: { [hour: string]: number };
  lapCountByHouse: { [key: string]: number };
  lapCountByClass: { [key: string]: number };
}) {
  const [houseAbbreviationTranslations] = useRemoteConfig<
    {
      name: string;
      abbreviation: string;
    }[]
  >('houseAbbreviationTranslations', []);

  const user = useUser();
  const [runner, setRunner] = useState<Runner | null>(null);

  const [textColor, setTextColor] = useState<string>('black');
  const [cardColor, setCardColor] = useState<string>('white');

  useEffect(() => {
    const style = getComputedStyle(document.body);
    setTextColor(hslToHex(style.getPropertyValue('--tc')));
    setCardColor(hslToHex(style.getPropertyValue('--b1')));
  }, []);

  useEffect(() => {
    if (user.email) {
      getRunner(user.email).then(async (runner) => {
        setRunner(runner);
      });
    }
  }, [user]);

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

  const stringToColour = (str: string) => {
    let hash = 0;
    // hash the string
    str = Md5.hashStr(str).toString();
    str.split('').forEach((char) => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += value.toString(16).padStart(2, '0');
    }
    return color;
  };

  const lapCountByHouseData = {
    labels: Object.keys(lapCountByHouse).map((house) => {
      // @ts-ignore
      return (
        houseAbbreviationTranslations.find(
          (translation) => translation.name === house
        )?.abbreviation || house
      );
    }),
    datasets: [
      {
        label: 'Laps',
        data: Object.values(lapCountByHouse),
        fill: 'start',
        backgroundColor: Object.keys(lapCountByHouse).map((house) =>
          stringToColour(house)
        ),
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
        backgroundColor: Object.keys(lapCountByClass).map((grade) =>
          stringToColour(grade)
        ),
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
        borderWidth: 2,
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
        },
      },
      y: {
        border: {
          display: false,
        },
        ticks: {
          color: textColor,
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
        },
      },
    },
    animation: false,
  };

  return (
    <>
      <Head title="Läufer Details" />
      <Menu navItems={runnerNavItems} signOut={user.signOut} />

      <main className="main relative flex flex-col overflow-auto">
        <div className="flex w-full max-w-2xl flex-col gap-3 bg-base-200 p-1 portrait:mb-16">
          <div className="card card-compact bg-base-100">
            <div className="card-body">
              <span className="flex gap-1">
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
              </span>
            </div>
          </div>
          <div className="card card-compact bg-base-100">
            <div className="card-body">
              <h2 className="card-title">Fortschritt</h2>
              <p className="pb-2 text-base">
                Hier siehst du, wie nah du deinem Ziel schon gekommen bist.
              </p>
              <progress
                className="progress-primary progress h-5 w-full rounded-full bg-base-200 shadow-inner"
                value={
                  runnersWithLapCount.find(
                    (runnerWithLapCount) =>
                      runnerWithLapCount.email === user?.email
                  )?.lapCount || 0
                }
                max={runner?.goal || 0}
              ></progress>
              <p className="font-semibold">
                {runnersWithLapCount.find(
                  (runnerWithLapCount) =>
                    runnerWithLapCount.email === user?.email
                )?.lapCount || 0}{' '}
                / {runner?.goal || 0} Runden
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="card card-compact flex aspect-square items-center justify-center bg-base-100">
              <Stat value={runnerCount} label="Teilnehmer" />
            </div>
            <div className="card card-compact flex aspect-square items-center justify-center bg-base-100">
              <Stat value={lapsTotal} label="Runden gesamt" />
            </div>
            <div className="card card-compact flex aspect-square items-center justify-center bg-base-100">
              <Stat
                value={Math.ceil(lapsTotal / runnerCount)}
                label="Ø Runden pro Teilnehmer"
              />
            </div>
            <div className="card card-compact flex aspect-square items-center justify-center bg-base-100">
              <Stat
                value={lapsTotal && formatKilometer(lapsTotal * distancePerLap)}
                label="km Gesamtstrecke"
              />
            </div>
          </div>
          <div className="card card-compact bg-base-100">
            <div className="card-body">
              <h2 className="card-title">Rundenverlauf</h2>
              {/* @ts-ignore */}
              <Line data={lapCountByHourData} options={lineOptions} />
            </div>
          </div>
          <div className="card card-compact bg-base-100">
            <div className="card-body pb-5">
              <h2 className="card-title">Runden pro Haus</h2>
              {/* @ts-ignore */}
              <Pie data={lapCountByHouseData} options={pieOptions} />
            </div>
          </div>
          <div className="card card-compact bg-base-100">
            <div className="card-body">
              <h2 className="card-title">Runden pro Klasse</h2>
              {/* @ts-ignore */}
              <Pie data={lapCountByClassData} options={pieOptions} />
            </div>
          </div>
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
