import Head from '@/components/Head';
import { AuthAction, useUser, withUser } from 'next-firebase-auth';
import Menu from '@/components/Menu';
import { assistantNavItems, runnerNavItems } from '@/lib/utils';
import Loading from '@/components/Loading';
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

      <main className="max-w-sm mx-auto">
        <fieldset className="fieldset border-base-300 rounded-box border p-4 h-fit">
          <legend className="fieldset-legend text-lg font-semibold">
            Darstellung
          </legend>
          <select
            name="select-ternaryDarkMode"
            className="select w-full"
            aria-label="Einstellung für den Dark Mode"
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
          <label className="label mt-2 text-base text-base-content">
            <input
              type="checkbox"
              className="toggle toggle-lg"
              aria-label="Debug Informationen anzeigen"
              checked={showDebug}
              onChange={() => setShowDebug(!showDebug)}
            />
            Debug
          </label>
        </fieldset>

        <fieldset className="fieldset border-base-300 rounded-box border p-4 h-fit">
          <legend className="fieldset-legend text-lg font-semibold">
            Account
          </legend>
          {user.id === process.env.NEXT_PUBLIC_ASSISTANT_ACCOUNT_UID ? (
            <p className="text-base">Angemeldet als Service Nutzer</p>
          ) : (
            <p className="text-base">
              Angemeldet als {user.displayName} {user.email}
            </p>
          )}
          <button
            className="btn-error btn-outline btn my-1 w-full border-2 text-lg"
            onClick={user.signOut}
          >
            Abmelden
          </button>
        </fieldset>

        {showDebug && (
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Debug</h2>
            <p className="overflow-hidden break-all pt-2">
              {JSON.stringify(user)}
            </p>
          </div>
        )}
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
