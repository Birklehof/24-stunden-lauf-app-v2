import Head from '@/components/Head';
import Link from 'next/link';

export default function CustomErrorPage() {
  return (
    <>
      <Head title="Seite nicht gefunden" />
      <main className="main !justify-center bg-base-100 ">
        <div className="flex flex-col items-center gap-y-10">
          <h1 className="text-center text-3xl font-bold">
            Seite nicht gefunden
          </h1>
          <Link href="/" className="btn-primary btn">
            Zurück
          </Link>
        </div>
      </main>
    </>
  );
}
