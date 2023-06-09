import router from 'next/router';
import { useEffect } from 'react';
import Head from './Head';

export default function Loading() {
  useEffect(() => {
    // Redirect to home after 1 second
    const timeout = setTimeout(() => {
      router.push('/');
    }, 10000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Head title="Lädt ..." />
      <main className="flex min-h-screen w-full items-center justify-center bg-base-200">
        <span className="loading loading-dots loading-lg" />
      </main>
    </>
  );
}
