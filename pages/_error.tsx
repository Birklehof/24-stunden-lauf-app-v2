import Head from '@/components/Head';
import { NextPageContext } from 'next';

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
      <main className="flex !min-h-[100dvh] min-h-[100vh] w-full  items-center justify-center bg-base-200 ">
        <div className="flex flex-col items-center gap-x-5 gap-y-4 landscape:flex-row">
          <h1 className="text-center text-6xl font-bold text-primary">
            {statusCode}
          </h1>
          {message && (
            <>
              <div className="divider divider-vertical my-0 h-full landscape:divider-horizontal" />
              <h1 className="text-center text-4xl font-semibold">{message}</h1>
            </>
          )}
        </div>
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
