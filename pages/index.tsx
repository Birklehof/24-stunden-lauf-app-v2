import Head from "next/head";
import Title from "../components/Title";
import Login from "../components/Login";

export default function Home() {
  return (
    <>
      <main>
        <Title />
        <Login />
      </main>
    </>
  );
}
