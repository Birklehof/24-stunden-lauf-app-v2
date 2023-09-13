import Head from '@/components/Head';

export default function Custom404Page() {
  return (
    <>
      <Head title="Seite nicht gefunden" />
      <main className="flex min-h-screen w-full items-center justify-center bg-base-200">
        <h1 className="text-4xl font-bold">Seite nicht gefunden</h1>
      </main>
    </>
  );
}
