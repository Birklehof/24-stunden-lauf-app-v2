import useAuth from "lib/hooks/useAuth";
import { useEffect, useState } from "react";
import { type Runner } from "lib/interfaces/runner";
import Loading from "components/Loading";
import Head from "components/Head";
import RunnerMenu from "components/RunnerMenu";
import useRunner from "lib/hooks/useRunner";

export default function RunnerAccount() {
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
      <main className="hero min-h-screen bg-base-200">
        <RunnerMenu />
        <div className="hero-content flex-col">
          <div className="avatar z-10">
            <div className="w-24 mask mask-squircle">
              <img
                src={user.photoURL || "https://placeimg.com/192/192/people"}
              />
            </div>
          </div>
          <div className="card max-w-md shadow-2xl bg-base-100 -mt-12">
            <div className="card-body mt-3">
              <h1 className="font-bold text-lg text-center">{runner.name}</h1>
              {user.email && (
                <h2 className="text-md text-center">{user.email}</h2>
              )}
              {/* 
              On this page:
              - let the user set a personal goal and show the progress
              - let the user create or join a team and show the progress of the team goal
              */}
              {/* <p>ID: {runner.id}</p>
              <p>Number: {runner.number}</p>
              {runner?.studentId && <p>Student ID: {runner?.studentId}</p>} */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
