import Title from "../components/Title";
import Login from "../components/Login";
import Head from "../components/Head";
import Loading from "../components/Loading";
import useAuth from "../hooks/useAuth";
import { User } from "../interfaces/user";
import { getDoc, doc } from "firebase/firestore";
import router from "next/router";
import { useEffect } from "react";
import { db } from "../firebase";

export default function Home() {
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isLoggedIn && user) {
        redirect(user).then((path) => {
          router.push(path);
        });
      }
    }
  }, [isLoggedIn, user]);

  async function redirect(user: User): Promise<string> {
    const userRole = await getUserRole(user.email);

    if (userRole === "admin") {
      return "/admin";
    } else if (userRole === "assistant") {
      return "/assistant";
    } else {
      return "/runner";
    }
  }

  async function getUserRole(email: string): Promise<string> {
    const userRole = await getDoc(doc(db, "user-roles", email));
    const role = userRole.data()?.role || "";
    return role;
  }

  if (isLoggedIn && user) {
    return <Loading />;
  }

  return (
    <>
      <Head title="Anmeldung" />
      <main className="hero min-h-screen bg-base-200">
        <div className="hero-content w-full flex justify-around">
          <div className="hidden lg:block">
            <h1 className="text-5xl text-right font-bold">
              <Title />
            </h1>
          </div>
          <div className="w-full max-w-sm lg:max-w-md">
            <div className="card w-full shadow-2xl bg-base-100">
              <div className="card-body">
                <h1 className="text-xl text-center font-bold mb-3 lg:hidden">
                  <Title />
                </h1>
                <Login />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
