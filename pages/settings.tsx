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

      <main className="flex flex-col gap-4 my-2 max-w-sm mx-auto">
        <fieldset className="fieldset border-base-300 rounded-box border p-4 h-fit w-full">
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
            Zeige Debug Information
          </label>
        </fieldset>

        <fieldset className="fieldset border-base-300 rounded-box border p-4 h-fit w-full">
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
          <fieldset className="fieldset border-base-300 rounded-box border p-4 h-fit w-full">
            <legend className="fieldset-legend text-lg font-semibold">
              Debug
            </legend>
            <code className="break-all">
              {JSON.stringify(user)}
            </code>
          </fieldset>
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
