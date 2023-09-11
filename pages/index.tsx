import LoginOptions from '@/components/LoginOptions';
import Head from '@/components/Head';
import useAuth from '@/lib/hooks/useAuth';
import router from 'next/router';
import { useEffect } from 'react';
import useRemoteConfig from '@/lib/firebase/useRemoteConfig';
import { defaultAppName } from '@/lib/firebase/remoteConfigDefaultValues';

export default function Index() {
  const { isLoggedIn, user, logout } = useAuth();
  const [appName] = useRemoteConfig('appName24StundenLauf', defaultAppName);

  useEffect(() => {
    if (isLoggedIn && user) {
      redirect(user.role).then((path) => {
        router.push(path);
      });
    }
  }, [isLoggedIn, user, logout]);

  async function redirect(role: string): Promise<string> {
    if (role === 'assistant') {
      return '/assistant';
    } else if (role === 'runner') {
      return '/runner';
    } else {
      throw new Error('Unknown role');
    }
  }

  return (
    <>
      <Head title="Anmeldung" />
      <main className="md:p-4 flex h-screen flex-col items-center justify-center gap-x-16 gap-y-6 bg-base-200 md:flex-row">
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold md:text-right">
          {appName}
        </h1>
        <div className="card card-compact w-full max-w-md md:card-normal md:bg-base-100 md:shadow-xl">
          <div className="card-body">
            <LoginOptions />
          </div>
        </div>
      </main>
    </>
  );
}
