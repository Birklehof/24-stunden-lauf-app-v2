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
      <main>
        <Title />
        <Login />
      </main>
    </>
  );
}
