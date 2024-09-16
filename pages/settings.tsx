import Head from '@/components/Head';
import { AuthAction, useUser, withUser } from 'next-firebase-auth';
import Menu from '@/components/Menu';
import { assistantNavItems, runnerNavItems } from '@/lib/utils';
import Loading from '@/components/Loading';
import { useEffect, useState } from 'react';
import { useDarkMode } from 'usehooks-ts';
import MenuPlaceholder from '@/components/MenuPlaceholder';

function SettingsPage() {
  const user = useUser();
  const { isDarkMode, toggle } = useDarkMode();
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const body = document.body;
    body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <>
      <Head title="Einstellungen" />
    
      {user.id === process.env.NEXT_PUBLIC_ASSISTANT_ACCOUNT_UID ? (
        <Menu navItems={assistantNavItems} />
      ) : (
        <Menu navItems={runnerNavItems} />
      )}

      <main>
        <div className="flex w-full flex-col gap-7 bg-base-100 p-10">
          <h1 className="text-2xl font-semibold">Einstellungen</h1>

          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Darstellung</h2>
            <div className="form-control">
              <label className="label cursor-pointer text-xl font-medium">
                <span className="label-text">Dunkelmodus</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={isDarkMode}
                  onChange={toggle}
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer text-xl font-medium">
                <span className="label-text">Debug</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={showDebug}
                  onChange={() => setShowDebug(!showDebug)}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Account</h2>
            {user.id === process.env.NEXT_PUBLIC_ASSISTANT_ACCOUNT_UID ? (
              <p className="text-md py-2">Angemeldet als Service Nutzer</p>
            ) : (
              <p className="text-md py-2">
                Angemeldet als {user.displayName} {user.email}
              </p>
            )}
            <button
              className="btn-error btn-outline btn my-1 w-full border-2 text-lg"
              onClick={user.signOut}
            >
              Abmelden
            </button>
          </div>

          {showDebug && (
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold">Debug</h2>
              <p className="overflow-hidden break-all pt-2">
                {JSON.stringify(user)}
              </p>
            </div>
          )}
        </div>

        <MenuPlaceholder />
      </main>
    </>
  );
}

export default withUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Loading,
  // @ts-ignore
})(SettingsPage);
