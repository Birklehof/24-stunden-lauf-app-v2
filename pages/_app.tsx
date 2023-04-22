import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Montserrat } from "@next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useTheme from "@/lib/hooks/useTheme";
import Icon from "@/components/Icon";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <style jsx global>
        {`
          :root {
            --montserrat-font: ${montserrat.style.fontFamily};
          }
        `}
      </style>
      <button
        className="btn btn-square btn-ghost absolute top-3 left-3"
        onClick={toggleTheme}
      >
        {theme === "light" ? <Icon name="SunIcon" /> : <Icon name="MoonIcon" />}
      </button>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
}
