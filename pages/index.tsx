import Login from "@/components/Login";
import Head from "@/components/Head";
import useAuth from "@/lib/hooks/useAuth";
import router from "next/router";
import { useEffect } from "react";
import useRemoteConfig from "@/lib/hooks/useRemoteConfig";

export default function Index() {
  const { isLoggedIn, user, role } = useAuth();
  const { appName } = useRemoteConfig();

  useEffect(() => {
    if (isLoggedIn && user && role) {
      redirect(role).then((path) => {
        router.push(path);
      });
    }
  }, [isLoggedIn, user, role]);

  async function redirect(role: string): Promise<string> {
    if (role === "assistant") {
      return "/assistant";
    } else {
      return "/runner";
    }
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
            <div className="card w-full shadow-xl bg-base-100">
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
