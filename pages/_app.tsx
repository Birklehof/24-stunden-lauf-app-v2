import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Montserrat } from "@next/font/google";
import { app } from "lib/firebase";
import { fetchAndActivate, getRemoteConfig } from "firebase/remote-config";
import { useEffect } from "react";

const montserrat = Montserrat();

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const remoteConfig = getRemoteConfig(app);
      remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
      remoteConfig.settings.fetchTimeoutMillis = 60000;
      remoteConfig.defaultConfig = {
        title: "24 Stunden Lauf",
        distancePerLap: 660,
        gradeLevels: JSON.stringify([
          "1",
          "2,",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10A",
          "10B",
          "10C",
          "Q1",
          "Q2",
        ]),
        houses: JSON.stringify([
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
        ]),
      };

      fetchAndActivate(remoteConfig).catch((err) => {
        console.log(err);
      });
    }
  });

  return (
    <>
      <style jsx global>
        {`
          :root {
            --montserrat-font: ${montserrat.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} />
    </>
  );
}
