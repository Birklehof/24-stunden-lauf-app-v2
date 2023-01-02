import { app } from "../firebase";
import {
  fetchAndActivate,
  getRemoteConfig,
  getString,
} from "firebase/remote-config";
import { useEffect, useState } from "react";

const Title = () => {
  const [title, setTitle] = useState("24 Stunden Lauf");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const remoteConfig = getRemoteConfig(app);
      remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

      fetchAndActivate(remoteConfig)
        .then(() => {
          const titleData = getString(remoteConfig, "name");
          setTitle(titleData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  return <h1>{title}</h1>;
};

export default Title;
