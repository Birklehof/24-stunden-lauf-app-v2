import LoginOptions from '@/components/LoginOptions';
import Head from '@/components/Head';
import useRemoteConfig from '@/lib/firebase/useRemoteConfig';
import { defaultAppName } from '@/lib/firebase/remoteConfigDefaultValues';
import { withUser, AuthAction, withUserTokenSSR } from 'next-firebase-auth';
import Loading from '@/components/Loading';

export const getServerSideProps = withUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})();

function LoginPage() {
  const [appName] = useRemoteConfig('appName24StundenLauf', defaultAppName);

  return (
    <>
      <Head title="Anmeldung" />
      <main className="max-w-none landscape:w-[66vw]">
        <div className="my-auto flex w-full flex-col items-center justify-center gap-x-16 gap-y-6 md:p-4 landscape:flex-row">
          <h1 className="text-3xl font-bold landscape:sm:text-4xl portrait:text-center landscape:text-right landscape:md:text-5xl landscape:lg:text-6xl">
            {appName}
          </h1>
          <div className="w-full max-w-xs">
            <LoginOptions />
          </div>
        </div>
      </main>
    </>
  );
}

export default withUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenAuthedBeforeRedirect: AuthAction.SHOW_LOADER,
  LoaderComponent: Loading,
})(LoginPage);
