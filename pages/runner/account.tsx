import useAuth from "../../hooks/useAuth";
import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
} from "@firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import { type Runner } from "../../interfaces/runner";
import router from "next/router";
import Link from "next/link";
import Loading from "../../components/Loading";
import Head from "../../components/Head";
import Menu from "../../components/Menu";
import RunnerMenu from "../../components/RunnerMenu";

export default function Runner() {
  const { isLoggedIn, user, logout } = useAuth();
  const [laps, setLaps] = useState(0);
  const [runner, setRunner] = useState<Runner | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      return;
    }
    getRunner().catch((error) => {
      console.log("Error getting documents: ", error);
    });
  }, [isLoggedIn, user]);

  const getRunner = async () => {
    const q = query(
      collection(db, "runners"),
      where("email", "==", user?.email)
    );
    const querySnapshot = await getDocs(q);
    const id = querySnapshot.docs[0].id;
    const data = querySnapshot.docs[0].data();
    const runner = { id, ...data } as Runner;
    await setRunner(runner);
  };

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
              {runner.email && (
                <h2 className="text-md text-center">{runner.email}</h2>
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
