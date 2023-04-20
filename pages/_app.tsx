import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Montserrat } from "@next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
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
      <ToastContainer />
    </>
  );
}
