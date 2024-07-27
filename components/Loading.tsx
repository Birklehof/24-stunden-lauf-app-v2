import Head from '@/components/Head';

export default function Loading() {
  return (
    <>
      <Head title="Lädt ..." />
      <main className="flex !h-[100dvh] h-[100vh] w-full items-center justify-center bg-base-100">
        <span
          aria-label="Ladeanimation"
          className="loading loading-dots loading-lg"
        />
      </main>
    </>
  );
}
