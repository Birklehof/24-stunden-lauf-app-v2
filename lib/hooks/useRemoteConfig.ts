import {
  fetchAndActivate,
  getRemoteConfig,
  getString,
} from 'firebase/remote-config';
import { app } from '@/lib/firebase';
import { useEffect, useState } from 'react';

export default function useRemoteConfig() {
  const [classes, setClasses] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [houses, setHouses] = useState<string[]>([
    'Extern (Kollegium)',
    'Extern (Schüler)',
    'Altbirkle',
    'Kopphaus',
    'Neubirkle',
    'Neuen Hirschen Ost',
    'Neuen Hirschen West',
    'Petersbau',
    'Saalbau',
    'Studio',
    'Unterhaus',
    'Wolfsburg Süd',
    'Wolfsburg Nord',
  ]);
  const [distancePerLap, setDistancePerLap] = useState(660);
  const [appName, setAppName] = useState('24 Stunden Lauf App');

  useEffect(() => {
    const remoteConfig = getRemoteConfig(app);
    if (typeof window !== 'undefined') {
      remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

      fetchAndActivate(remoteConfig)
        .then(() => {
          const classesData = getString(remoteConfig, 'classes');
          const houseData = getString(remoteConfig, 'houses');
          const distancePerLapData = getString(remoteConfig, 'distancePerLap');
          const appNameData = getString(remoteConfig, 'appName24StundenLauf');
          if (classesData) {
            setClasses(JSON.parse(classesData));
          }
          if (houseData) {
            setHouses(JSON.parse(houseData).sort());
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

  return { classes: classes, houses, distancePerLap, appName };
}
