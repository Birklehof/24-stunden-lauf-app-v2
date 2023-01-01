import Head from "next/head";
import Auth from "../components/Auth";

export default function Home() {
  return (
    <>
      <Head>
        <title>24 Stunden Lauf</title>
        <meta name="description" content="There is no description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Auth />
      </main>
    </>
  );
}
