import Head from '@/components/Head';
import Icon from '@/components/Icon';
import { NextPageContext } from 'next';
import Link from 'next/link';

export default function CustomErrorPage({
  statusCode,
  message,
}: {
  statusCode: number;
  message?: string;
}) {
  return (
    <>
      <Head title="Seite nicht gefunden" />
      <main className="flex flex-col items-center justify-center gap-7">
        <h1 className="text-6xl font-bold">
          {statusCode} {message}
        </h1>
        <Link href="/">
          <span className='flex flex-row gap-2 font-semibold link link-hover'>
            <Icon name="ArrowLeftIcon" />
            Zurück
          </span>
        </Link>
      </main>
    </>
  );
}

CustomErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  let message = err?.message || res?.statusMessage;

  if (statusCode === 404) {
    message = 'Seite nicht gefunden';
  }

  return { statusCode, message };
};
