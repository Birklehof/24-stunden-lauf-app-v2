import useAuth from "lib/hooks/useAuth";
import { useEffect } from "react";
import Loading from "components/Loading";
import Head from "components/Head";
import RunnerMenu from "components/RunnerMenu";
import useRunner from "lib/hooks/useRunner";
import { Line } from "react-chartjs-2";
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
} from "chart.js";
import useLaps from "lib/hooks/useLaps";
import Lap from "lib/interfaces/lap";

export default function RunnerGraphs() {
  const { isLoggedIn, user } = useAuth();
  const { runner } = useRunner();
  const { laps } = useLaps();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  if (!user || !runner || !laps) {
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
        label: "Laps",
        data: allHours.map((hour) => sortedGroupedLapsAll[hour] || 0),
        fill: "start",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const sortedGroupedLapsPersonal = groupLapsByHour(
    laps.filter((lap) => lap.runnerId === runner.id)
  );

  let dataPersonal = {
    labels: allHours.map((hour) => hour.toString()),
    datasets: [
      {
        label: "Laps",
        data: allHours.map((hour) => sortedGroupedLapsPersonal[hour] || 0),
        fill: "start",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
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
        fill: "start",
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
      <main className="hero flex flex-col min-h-screen bg-base-200 justify-center">
        <RunnerMenu />
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-row gap-6">
              <div>
                <h2 className="card-title">Runden pro Stunde (alle)</h2>
                <Line data={dataAll} options={options} />
              </div>
              <div>
                <h2 className="card-title">Runden pro Stunde (persönlich)</h2>
                <Line data={dataPersonal} options={options} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
