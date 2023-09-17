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
import { runnerNavItems } from '@/lib/utils';
import Stat from '@/components/Stat';
import Loading from '@/components/Loading';
import { Md5 } from 'ts-md5';
import Icon from '@/components/Icon';
import StatDivider from '@/components/StatDivider';

// Incremental static regeneration to reduce load on backend
export async function getStaticProps() {
  const runnersWithLapCount = await getRunnersWithLapCount();

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
  runnerCount,
  lapsTotal,
  lastUpdated,
  lapCountByHour,
  lapCountByHouse,
  lapCountByClass,
}: {
  runnerCount: number;
  lapsTotal: number;
  lastUpdated: number;
  lapCountByHour: { [hour: string]: number };
  lapCountByHouse: { [key: string]: number };
  lapCountByClass: { [key: string]: number };
}) {
  const user = useUser();

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
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
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
    labels: Object.keys(lapCountByHouse),
    datasets: [
      {
        label: 'Laps',
        data: Object.values(lapCountByHouse),
        fill: 'start',
        backgroundColor: Object.keys(lapCountByHouse).map((house) =>
          stringToColour(house)
        ),
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
      },
      y: {
        border: {
          display: false,
        },
        grid: {
          display: true,
        },
        ticks: {
          display: true,
        },
      },
      xAxis: {
        display: false,
      },
    },
  };

  const pieOptions = {
    hoverOffset: 2,
    clip: false,
    plugin: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <>
      <Head title="Läufer Details" />
      <Menu navItems={runnerNavItems} signOut={user.signOut} />
      <main className="main relative flex flex-col gap-14 overflow-auto">
        <div className="absolute flex w-full justify-center gap-1 text-sm">
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
        <section className="hero min-h-screen bg-base-200 pb-14 landscape:min-h-min landscape:pt-[33vh]">
          <div className="flex flex-col gap-x-3 gap-y-5 landscape:mb-0 landscape:flex-row">
            <Stat value={runnerCount} label="Teilnehmer" />
            <StatDivider />
            <Stat value={lapsTotal} label="Runden gesamt" />
            <StatDivider />
            <Stat
              value={Math.ceil(lapsTotal / runnerCount)}
              label="Ø Runden pro Teilnehmer"
            />
            <StatDivider />
            <Stat
              value={
                lapsTotal &&
                ((lapsTotal * distancePerLap) / 1000).toFixed(
                  (lapsTotal * distancePerLap) / 1000 < 10
                    ? 2
                    : (lapsTotal * distancePerLap) / 1000 < 100
                    ? // eslint-disable-next-line indent
                      1
                    : // eslint-disable-next-line indent
                      0
                )
              }
              label="km Gesamtstrecke"
            />
          </div>
        </section>
        {/* <section>
          <h2 className="card-title">Persönlicher Fortschritt</h2>
          <progress
            className="progress-primary progress h-5 w-full rounded-full bg-base-200 shadow-inner"
            value="40"
            max="100"
          ></progress>
        </section>
        <section className="hero h-full bg-base-200">
          <div className="flex flex-col gap-x-3 gap-y-5 landscape:mb-0 landscape:flex-row">
            <Stat value={0} label="Ø Runden pro Stunde" />
            <div className="divider divider-vertical my-0 landscape:divider-horizontal" />
            <Stat value={0} label="Ø km pro Stunde" />
            <div className="divider divider-vertical my-0 landscape:divider-horizontal" />
            <Stat value={0} label="Ø km pro Stunde" />
          </div>
        </section> */}

        <section className="-mt-14 mb-16 flex w-full max-w-2xl flex-col justify-center gap-8 py-3 md:gap-16">
          <article>
            <h2 className="mb-1 text-center text-xl font-semibold md:mb-4 md:text-3xl">
              Rundenverlauf
            </h2>
            <Line data={lapCountByHourData} options={lineOptions} />
          </article>
          <article>
            <h2 className="mb-1 text-center text-xl font-semibold md:mb-4 md:text-3xl">
              Runden pro Haus
            </h2>
            {/* @ts-ignore */}
            <Pie data={lapCountByHouseData} options={pieOptions} />
          </article>

          <article>
            <h2 className="mb-1 text-center text-xl font-semibold md:mb-4 md:text-3xl">
              Runden pro Klasse
            </h2>
            {/* @ts-ignore */}
            <Pie data={lapCountByClassData} options={pieOptions} />
          </article>
        </section>

        {/* <div className="flex flex-col items-start overflow-y-auto h-screen px-2 lg:px-0 pt-2 pb-2 gap-2">
          <div className="card bg-base-100 shadow-xl w-full">
            <div className="card-body">
              <h2 className="card-title">Runden pro Stunde (alle)</h2>
              <Line data={dataAll} options={options} />
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl w-full">
            <div className="card-body">
              <h2 className="card-title">Runden pro Stunde (persönlich)</h2>
              <Line data={dataPersonal} options={options} />
            </div>
          </div>
        </div> */}
      </main>
    </>
  );
}

export default withUser({
  // whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Loading,
  // @ts-ignore
})(RunnerGraphsPage);
