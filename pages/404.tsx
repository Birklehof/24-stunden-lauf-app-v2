import Head from '@/components/Head';

export default function CustomErrorPage() {
  return (
    <>
      <Head title="Seite nicht gefunden" />
      <main className="main !justify-center bg-base-200 ">
        <div className="flex flex-col items-center gap-x-5 gap-y-4 landscape:flex-row">
          <h1 className="text-center text-6xl font-bold text-primary">404</h1>
          <>
            <div className="divider divider-vertical my-0 h-full landscape:divider-horizontal" />
            <h1 className="text-center text-4xl font-semibold">
              Seite nicht gefunden
            </h1>
          </>
        </div>
      </main>
    </>
  );
}
