import Title from "../components/Title";
import Login from "../components/Login";
import Head from "../components/Head";

export default function Home() {
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
