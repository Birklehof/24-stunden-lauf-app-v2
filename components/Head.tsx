import Head from "next/head";

interface HeadProps {
  title?: string;
}

export default function Header({ title }: HeadProps) {
  const pageTitle = title ? `24 Stunden Lauf | ${title}` : "24 Stunden Lauf";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
    </>
  );
}
