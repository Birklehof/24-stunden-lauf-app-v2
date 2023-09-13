import Head from './Head';

export default function Loading() {
  return (
    <>
      <Head title="Lädt ..." />
      <main className="flex min-h-screen w-full items-center justify-center bg-base-200">
        <span
          aria-label="Ladeanimation"
          className="loading loading-dots loading-lg"
        />
      </main>
    </>
  );
}
