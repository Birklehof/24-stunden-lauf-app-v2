import router from "next/router";
import { useEffect } from "react";
import Head from "../../components/Head";
import Loading from "../../components/Loading";
import useAuth from "../../hooks/useAuth";

export default function AssistantIndex() {
  const { isLoggedIn, user, logout } = useAuth();
  // This is the page for the assistants, it should:
  // - have a from to add a new runner
  // - have a from to add a new lap
  // - have a from to correct a lap (delete or transfer)

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
      <Head title="Assistent" />
      <main>
        <h1>Assistant</h1>
        <div>
          <button onClick={() => logout()}>Logout</button>
        </div>
      </main>
    </>
  );
}
