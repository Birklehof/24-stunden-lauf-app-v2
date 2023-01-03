import Head from "next/head";

export default function Header({ title }: { title?: string }) {
  const pageTitle = title ? `24 Stunden Lauf | ${title}` : "24 Stunden Lauf";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Slab:wght@500&display=swap"
          rel="stylesheet"
        />
      </Head>
    </>
  );
}