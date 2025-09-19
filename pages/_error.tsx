import Head from '@/components/Head';
import Link from 'next/link';
import Image from 'next/image';

export default function CustomErrorPage({
  statusCode,
}: {
  statusCode: number;
  message?: string;
  desc?: string;
}) {
  return (
    <>
      <Head title="Seite nicht gefunden" />
      <main className="flex flex-col justify-center items-center h-screen">
        <Link href="/" className="relative w-full max-w-2xl h-full" aria-label="Zur Startseite">
          <Image
            src={'https://http.garden/' + statusCode + '.jpg'}
            alt="Logo"
            fill={true}
            objectFit="contain"
          />
        </Link>
      </main>
    </>
  );
}

// @ts-ignore
CustomErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}
