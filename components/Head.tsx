import Head from "next/head";

export default function Header({ title }: { title?: string }) {
  const pageTitle = title ? `24 Stunden Lauf | ${title}` : "24 Stunden Lauf";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
    </>
  );
}
