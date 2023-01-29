import useAuth from "lib/hooks/useAuth";
import { useEffect } from "react";
import Loading from "components/Loading";
import Head from "components/Head";
import RunnerMenu from "components/RunnerMenu";
import useRunner from "lib/hooks/useRunner";

export default function RunnerGraphs() {
  const { isLoggedIn, user } = useAuth();
  const { runner } = useRunner();

  useEffect(() => {
    if (!isLoggedIn || !user) {
      return;
    }
  }, [isLoggedIn, user]);

  if (!isLoggedIn || !user || !runner) {
    return <Loading />;
  }

  return (
    <>
      <Head title="Läufer Details" />
      <main className="hero flex flex-col min-h-screen bg-base-200">
        <RunnerMenu />
        {/*
        Show detailed information about the runner
        - number of laps over time (graph)
        - number of laps in reference to the time of day (graph)
        - progress towards different goals (like in houses or groups)
        */}
      </main>
    </>
  );
}
