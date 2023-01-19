import Login from "components/Login";
import Head from "components/Head";
import Loading from "components/Loading";
import useAuth from "lib/hooks/useAuth";
import { User } from "lib/interfaces/user";
import router from "next/router";
import { useEffect } from "react";
import useRemoteConfig from "lib/hooks/useRemoteConfig";

export default function Home() {
  const { isLoggedIn, user, role } = useAuth();
  const { appName } = useRemoteConfig();

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
    if (role === "admin") {
      return "/admin";
    } else if (role === "assistant") {
      return "/assistant";
    } else {
      return "/runner";
    }
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
            <h1 className="text-5xl text-right font-bold">{appName}</h1>
          </div>
          <div className="w-full max-w-sm lg:max-w-md">
            <div className="card w-full shadow-2xl bg-base-100">
              <div className="card-body">
                <h1 className="text-xl text-center font-bold mb-3 lg:hidden">
                  {appName}
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
