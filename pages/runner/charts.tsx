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
import { Lap, Runner, RunnerWithLapCount } from '@/lib/interfaces';
import useRemoteConfig from '@/lib/firebase/useRemoteConfig';
import { defaultDistancePerLap } from '@/lib/firebase/remoteConfigDefaultValues';
import { AuthAction, useUser, withUser } from 'next-firebase-auth';
import { getRunnersWithLapCount } from '@/lib/utils/firebase/backend';
import Menu from '@/components/Menu';
import { runnerNavItems, groupLapsByHour } from '@/lib/utils';
import Stat from '@/components/Stat';
import { db } from '@/lib/firebase/admin';
import Loading from '@/components/Loading';
import runner from '.';

// Incremental static regeneration to reduce load on backend
export async function getStaticProps() {
  const runnersWithLapCount = await getRunnersWithLapCount();

  // Count how many laps each house has, the house is a property of the runner
  const lapCountByHouse = runnersWithLapCount.reduce(
    (acc, cur) => ({
      ...acc,
      // @ts-ignore
      [cur.house || '']: (acc[cur.house || ''] || 0) + cur.lapCount,
    }),
    {}
  );

  // Count how many laps each class has, the class is a property of the runner
  const lapCountByClass = runnersWithLapCount.reduce(
    (acc, cur) => ({
      ...acc,
      // @ts-ignore
      [cur.class || '']: (acc[cur.class || ''] || 0) + cur.lapCount,
    }),
    {}
  );

  return {
    props: {
      runnerCount: runnersWithLapCount.length,
      lapsTotal: runnersWithLapCount.reduce(
        (acc, cur) => acc + cur.lapCount,
        0
      ),
      lastUpdated: Date.now(),
      lapCountByHouse,
      lapCountByClass,
    },
    revalidate: 60 * 10, // Revalidate at most every 10 minutes
  };
}

function RunnerGraphsPage({
  runnerCount,
  lapsTotal,
  lastUpdated,
  // lapCountByHour,
  lapCountByHouse,
  lapCountByClass,
}: {
  runnerCount: number;
  lapsTotal: number;
  lastUpdated: number;
  // lapCountByHour: { [key: number]: number };
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

  // All hours from first hour to last hour
  // const firstHour = Number(Object.keys(lapCountByHour)[0]);
  // const lastHour = Number(
  //   Object.keys(lapCountByHour)[Object.keys(lapCountByHour).length - 1]
  // );
  // const allHours = [];
  // for (let i = firstHour; i <= lastHour; i++) {
  //   allHours.push(i);
  // }

  // const lapCountByHourData = {
  //   labels: allHours.map((hour) => hour.toString()),
  //   datasets: [
  //     {
  //       label: 'Laps',
  //       data: allHours.map((hour) => lapCountByHour[hour] || 0),
  //       fill: 'start',
  //       backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //       borderColor: 'rgba(255, 99, 132, 1)',
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  const lapCountByHouseData = {
    labels: Object.keys(lapCountByHouse),
    datasets: [
      {
        label: 'Laps',
        data: Object.values(lapCountByHouse),
        fill: 'start',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
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
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // const sortedGroupedLapsPersonal = groupLapsByHour(
  //   laps.filter((lap: Lap) => lap.runnerId === runner.id)
  // );

  // let dataPersonal = {
  //   labels: allHours.map((hour) => hour.toString()),
  //   datasets: [
  //     {
  //       label: 'Laps',
  //       data: allHours.map((hour) => sortedGroupedLapsPersonal[hour] || 0),
  //       fill: 'start',
  //       backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //       borderColor: 'rgba(255, 99, 132, 1)',
  //       borderWidth: 1,
  //     },
  //   ],
  // };

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
    plugins: {
      legend: {
        display: false,
      },
    },
    borderWidth: 2,
  }

  return (
    <>
      <Head title="Läufer Details" />
      <main className="main gap-14 overflow-auto">
        <Menu navItems={runnerNavItems} signOut={user.signOut} />
        <section className="hero mt-14 h-full bg-base-200">
          <div className="flex flex-col gap-x-3 gap-y-5 landscape:mb-0 landscape:flex-row">
            <Stat value={runnerCount} label="Teilnehmer" />
            <div className="divider divider-vertical my-0 landscape:divider-horizontal" />
            <Stat value={lapsTotal} label="Runden gesamt" />
            <div className="divider divider-vertical my-0 landscape:divider-horizontal" />
            <Stat
              value={Math.ceil(lapsTotal / runnerCount)}
              label="Ø Runden pro Teilnehmer"
            />
            <div className="divider divider-vertical my-0 landscape:divider-horizontal" />
            <Stat
              value={(
                ((lapsTotal / runnerCount) * distancePerLap) /
                1000
              ).toFixed(2)}
              label="km pro Teilnehmer"
            />
            <div className="divider divider-vertical my-0 landscape:divider-horizontal" />
            <Stat
              value={
                lapsTotal &&
                ((lapsTotal * distancePerLap) / 1000).toFixed(
                  (lapsTotal * distancePerLap) / 1000 < 10
                    ? 2
                    : (lapsTotal * distancePerLap) / 1000 < 100
                    ? 1
                    : 0
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
        {/* <section>
          <h2 className="card-title">Runden pro Stunde (alle)</h2>
          <Line data={lapCountByHourData} options={lineOptions} />
        </section> */}
        <section>
          <h2 className="card-title">Runden pro Haus</h2>
          <Pie data={lapCountByHouseData} options={pieOptions} />
        </section>
        <section>
          <h2 className="card-title">Runden pro Klasse</h2>
          <Pie data={lapCountByClassData} options={pieOptions} />
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
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Loading,
  // @ts-ignore
})(RunnerGraphsPage);
