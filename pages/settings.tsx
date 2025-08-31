import Head from '@/components/Head';
import { AuthAction, useUser, withUser } from 'next-firebase-auth';
import Menu from '@/components/Menu';
import { assistantNavItems, runnerNavItems } from '@/lib/utils';
import Loading from '@/components/Loading';
import MenuPlaceholder from '@/components/MenuPlaceholder';
import { useTernaryDarkMode } from 'usehooks-ts';
import { useState } from 'react';

type TernaryDarkMode = ReturnType<typeof useTernaryDarkMode>['ternaryDarkMode'];

function SettingsPage() {
  const user = useUser();
  const { ternaryDarkMode, setTernaryDarkMode } = useTernaryDarkMode();
  const [showDebug, setShowDebug] = useState(false);

  return (
    <>
      <Head title="Einstellungen" />

      {user.id === process.env.NEXT_PUBLIC_ASSISTANT_ACCOUNT_UID ? (
        <Menu navItems={assistantNavItems} />
      ) : (
        <Menu navItems={runnerNavItems} />
      )}

      <main className="p-10 gap-7 justify-start!">
        <h1 className="text-2xl font-semibold">Einstellungen</h1>

        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">Darstellung</h2>
          <div className="form-control">
            <label className="label cursor-pointer text-xl font-medium">
              <span className="label-text">Dunkelmodus</span>
              <select
                name="select-ternaryDarkMode"
                className="select"
                onChange={(ev) => {
                  // eslint-disable-next-line
                  setTernaryDarkMode(ev.target.value as TernaryDarkMode);
                }}
                value={ternaryDarkMode}
              >
                <option value="system">System</option>
                <option value="light">Hell</option>
                <option value="dark">Dunkel</option>
              </select>
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
