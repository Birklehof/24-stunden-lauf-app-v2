import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Montserrat } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import initAuth from '@/lib/next-firebase-auth';
import { useDarkMode, useTernaryDarkMode } from 'usehooks-ts';
import { useEffect } from 'react';

const montserrat = Montserrat({ subsets: ['latin'] });

initAuth();

export default function App({ Component, pageProps }: AppProps) {
  const { isDarkMode } = useTernaryDarkMode();

  useEffect(() => {
    const body = document.body;
    body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

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
