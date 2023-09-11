import Head from '@/components/Head';
import { withUser, AuthAction, withUserTokenSSR } from 'next-firebase-auth'
import Loading from '@/components/Loading';

export const getServerSideProps = withUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  // @ts-ignore
})(async ({ user }) => {
  console.log(user?.getIdToken());

  // TODO: redirect the user based on his role

  return {
    redirect: {
      redirect: '/runner',
      permanent: false
    }
  };
});

function RedirectPage() {
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
})(RedirectPage)