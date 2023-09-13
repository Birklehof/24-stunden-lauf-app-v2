import Head from '@/components/Head';
import { withUser, AuthAction, withUserTokenSSR } from 'next-firebase-auth';
import Loading from '@/components/Loading';

export const getServerSideProps = withUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  // @ts-ignore
})(async ({ user }) => {
  if (user && user.id === process.env.NEXT_PUBLIC_ASSISTANT_ACCOUNT_UID) {
    return {
      redirect: {
        destination: '/assistant',
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: '/runner',
      permanent: false,
    },
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
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(RedirectPage);
