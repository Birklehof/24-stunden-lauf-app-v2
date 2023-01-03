import Head from "./Head";

export default function Loading() {
  return (
    <>
      <Head title="Lädt ..." />
      <main>
        <div className="loading">
          <p>Lädt ...</p>
        </div>
      </main>
    </>
  );
}
