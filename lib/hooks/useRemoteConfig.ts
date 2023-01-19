import {
  fetchAndActivate,
  getRemoteConfig,
  getString,
} from "firebase/remote-config";
import { app } from "lib/firebase";
import { useEffect, useState } from "react";

export default function useRemoteConfig() {
  const [gradeLevels, setGradeLevels] = useState<string[]>([
    "1",
    "2",
    "3",
    "4",
    "5",
  ]);
  const [houses, setHouses] = useState<string[]>([
    "Extern (Kollegium)",
    "Extern (Schüler)",
    "Ab",
    "Kh",
    "Nb",
    "NHO",
    "NHW",
    "Pb",
    "Sb",
    "St",
    "Uh",
    "WobS",
    "WobN",
  ]);
  const [distancePerLap, setDistancePerLap] = useState(660);
  const [appName, setAppName] = useState("24 Stunden Lauf");

  useEffect(() => {
    const remoteConfig = getRemoteConfig(app);
    if (typeof window !== "undefined") {
      remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

      fetchAndActivate(remoteConfig)
        .then(() => {
          const gradeLevelData = getString(remoteConfig, "gradeLevels");
          const houseData = getString(remoteConfig, "houses");
          const distancePerLapData = getString(remoteConfig, "distancePerLap");
          const appNameData = getString(remoteConfig, "appName24StundenLauf");
          if (gradeLevelData) {
            setGradeLevels(JSON.parse(gradeLevelData));
          }
          if (houseData) {
            setHouses(JSON.parse(houseData));
          }
          if (distancePerLapData) {
            setDistancePerLap(parseFloat(distancePerLapData));
          }
          if (appNameData) {
            setAppName(appNameData);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return { gradeLevels, houses, distancePerLap, appName };
}
