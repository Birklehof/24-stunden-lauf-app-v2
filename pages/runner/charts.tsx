import useAuth from '@/lib/hooks/useAuth';
import { useEffect } from 'react';
import Loading from '@/components/Loading';
import Head from '@/components/Head';
import useRunner from '@/lib/hooks/useRunner';
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
} from 'chart.js';
import { Lap } from '@/lib/interfaces';
import useCollectionAsList from '@/lib/hooks/useCollectionAsList';
import useRemoteConfig from '@/lib/hooks/useRemoteConfig';

export default function RunnerGraphs() {
  const [laps, lapsLoading, lapsError] = useCollectionAsList<Lap>(
    'apps/24-stunden-lauf/laps'
  );

  // TODO: Implement runnerCount and lapsCount
  const runnerCount = 0
  const lapsCount = 0

  const { isLoggedIn, user } = useAuth();
  const { runner } = useRunner();
  const { classes, houses, distancePerLap } = useRemoteConfig();

  // While loading, show loading screen
  if (
    !user ||
    !runner ||
    lapsLoading
  ) {
    return <Loading />;
  }

  Chart.register({
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  });

  function groupLapsByHour(_laps: Lap[]): { [key: string]: number } {
    const groupedLaps: { [key: string]: number } = {};
    _laps.forEach((lap) => {
      const hour = (lap.timestamp.seconds / 60 / 60).toFixed(0);
      if (groupedLaps[hour]) {
        groupedLaps[hour]++;
      } else {
        groupedLaps[hour] = 1;
      }
    });
    const sortedGroupedLaps: { [key: string]: number } = {};
    Object.keys(groupedLaps)
      .sort()
      .forEach((key) => {
        sortedGroupedLaps[key] = groupedLaps[key];
      });
    return sortedGroupedLaps;
  }

  const sortedGroupedLapsAll = groupLapsByHour(laps);

  // All hours from first hour to last hour
  const firstHour = Number(Object.keys(sortedGroupedLapsAll)[0]);
  const lastHour = Number(
    Object.keys(sortedGroupedLapsAll)[
      Object.keys(sortedGroupedLapsAll).length - 1
    ]
  );
  const allHours = [];
  for (let i = firstHour; i <= lastHour; i++) {
    allHours.push(i);
  }

  let dataAll = {
    labels: allHours.map((hour) => hour.toString()),
    datasets: [
      {
        label: 'Laps',
        data: allHours.map((hour) => sortedGroupedLapsAll[hour] || 0),
        fill: 'start',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const sortedGroupedLapsPersonal = groupLapsByHour(
    laps.filter((lap: Lap) => lap.runnerId === runner.id)
  );

  let dataPersonal = {
    labels: allHours.map((hour) => hour.toString()),
    datasets: [
      {
        label: 'Laps',
        data: allHours.map((hour) => sortedGroupedLapsPersonal[hour] || 0),
        fill: 'start',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
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

  return (
    <>
      <Head title="Läufer Details" />
      <main className="main">
        <div className="vertical-list">
          <div className="large-card">
            <div className="card-body">
              <div className="flex flex-wrap items-center justify-evenly">
                <div className="stat w-full text-center md:w-1/3">
                  <div className="stat-value">{runnerCount}</div>
                  <div className="stat-desc">Teilnehmer</div>
                </div>
                <div className="stat w-full text-center md:w-1/3">
                  <div className="stat-value">{lapsCount}</div>
                  <div className="stat-desc">Runden gesamt</div>
                </div>
                <div className="stat w-full text-center md:w-1/3">
                  <div className="stat-value">
                    {Math.floor(lapsCount / runnerCount)}
                  </div>
                  <div className="stat-desc">Runden pro Teilnehmer</div>
                </div>
                <div className="stat w-full text-center md:w-1/2">
                  <div className="stat-value">
                    {(
                      ((lapsCount / runnerCount) * distancePerLap) /
                      1000
                    ).toFixed(2)}{' '}
                    km
                  </div>
                  <div className="stat-desc">Strecke pro Teilnehmer</div>
                </div>
                <div className="stat w-full text-center md:w-1/2">
                  <div className="stat-value">
                    {((lapsCount * distancePerLap) / 1000).toFixed(2)} km
                  </div>
                  <div className="stat-desc">Gesamtstrecke</div>
                </div>
              </div>
            </div>
          </div>
          <div className="large-card">
            <div className="card-body">
              <h2 className="card-title">Persönlicher Fortschritt</h2>
              <progress
                className="progress progress-primary h-5 w-full rounded-full bg-base-200 shadow-inner"
                value="40"
                max="100"
              ></progress>
            </div>
          </div>
          <div className="large-card">
            <div className="card-body">
              <h2 className="card-title">Runden pro Stunde (alle)</h2>
              <Line data={dataAll} options={options} />
            </div>
          </div>
          <div className="large-card">
            <div className="card-body">
              <h2 className="card-title">Runden pro Stunde (persönlich)</h2>
              <Line data={dataPersonal} options={options} />
            </div>
          </div>
        </div>

        {/* <div className="flex flex-col items-start overflow-y-auto h-screen px-2 lg:px-0 pt-2 pb-2 gap-2">
          <div className="card bg-base-100 shadow-xl w-full">
            <div className="card-body">
              <h2 className="card-title">Persönlicher Fortschritt</h2>
              <progress
                className="progress progress-primary w-full bg-base-200 h-5 shadow-inner rounded-full"
                value="40"
                max="100"
              ></progress>
            </div>
          </div>

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
