import Head from '@/components/Head';
import Link from 'next/link';

export default function CustomErrorPage() {
  return (
    <>
      <Head title="Seite nicht gefunden" />
      <main className="items-center justify-evenly px-12">
        <div className='grow' />
        <div className='grow' />
        <h1 className="text-center text-5xl font-bold">Seite nicht gefunden</h1>
        <div className='grow' />
        <div className='grow' />
        <Link href="/" className="btn-primary btn-wide btn-lg btn">
          Zurück
        </Link>
        <div className='grow' />
      </main>
    </>
  );
}
