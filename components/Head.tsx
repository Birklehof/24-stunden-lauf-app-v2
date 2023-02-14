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
        <meta
          name="description"
          content="The official Birklehof 24 Stunden Lauf Portal."
        />
        <meta name="keywords" content="Birklehof, 24-Stunden-Lauf" />
        <meta name="author" content="Schule Birklehof e.V." />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.webp" />
      </Head>
    </>
  );
}
