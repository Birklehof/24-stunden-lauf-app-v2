import LoginOptions from '@/components/LoginOptions';
import Head from '@/components/Head';
import useRemoteConfig from '@/lib/firebase/useRemoteConfig';
import { defaultAppName } from '@/lib/firebase/remoteConfigDefaultValues';
import { withUser, AuthAction, withUserTokenSSR } from 'next-firebase-auth'
import Loading from '@/components/Loading';

export const getServerSideProps = withUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})()

function LoginPage() {
  const [appName] = useRemoteConfig('appName24StundenLauf', defaultAppName);

  return (
    <>
      <Head title="Anmeldung" />
      <main className="main md:p-4 !justify-center gap-x-16 gap-y-6 bg-base-200 md:flex-row">
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

export default withUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenAuthedBeforeRedirect: AuthAction.SHOW_LOADER,
  LoaderComponent: Loading
})(LoginPage)
