import { useEffect } from "react";
import Head from "components/Head";
import Loading from "components/Loading";
import useAuth from "lib/hooks/useAuth";
import router from "next/router";

export default function AdminIndex() {
  const { isLoggedIn, user, logout } = useAuth();
  // This is the page for the admin, it should:
  // - show the current runner, admin and assistant accounts
  // - have a from to add a new admin or technical account
  // - have a from to import runners from a csv file

  useEffect(() => {
    if (!isLoggedIn || !user) {
      return;
    }
  }, [isLoggedIn, user]);

  if (!isLoggedIn || !user) {
    return <Loading />;
  }

  return (
    <>
      <Head title="Admin" />
      <main>
        <h1>Admin</h1>
        <div>
          <button onClick={() => logout()}>Logout</button>
        </div>
      </main>
    </>
  );
}
