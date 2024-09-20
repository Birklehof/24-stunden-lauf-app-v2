import Head from '@/components/Head';
import Loading from '@/components/Loading';
import { themedErrorToast } from '@/lib/utils';
import { AuthAction, useUser, withUser } from 'next-firebase-auth';
import { useEffect } from 'react';

function RunnerNotFound() {
  const user = useUser();

  useEffect(() => {
    if (user !== undefined) {
      themedErrorToast('Account nicht als Läufer registriert');
      user.signOut();
    }
  }, [user]);

  return (
    <>
      <Head title="Weiterleitung ..." />
      <Loading />
    </>
  );
}

export default withUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Loading,
  // @ts-ignore
})(RunnerNotFound);
