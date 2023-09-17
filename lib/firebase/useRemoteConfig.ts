import {
  fetchAndActivate,
  getRemoteConfig,
  getString,
} from 'firebase/remote-config';
import { app } from './index';
import { useEffect, useState } from 'react';

export default function useRemoteConfig<ValueType>(
  name: string,
  defaultValue: ValueType
) {
  const [value, setValue] = useState<ValueType>(defaultValue);

  useEffect(() => {
    const remoteConfig = getRemoteConfig(app);
    if (typeof window !== 'undefined') {
      remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

      fetchAndActivate(remoteConfig)
        .then(() => {
          const newValue = getString(remoteConfig, name);

          if (newValue) {
            // If collection type is string
            if (
              typeof defaultValue === 'string' ||
              typeof defaultValue === 'number'
            ) {
              setValue(newValue as unknown as ValueType);
              return;
            }
            setValue(JSON.parse(newValue));
          }
        })
        .catch((err) => {
          console.error(err)
        });
    }
  }, [name, defaultValue]);

  return [value];
}
