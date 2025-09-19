export default function Maintenance() {
  return (
    <main className="flex justify-center items-center text-center">
      <div className="max-w-md rounded-box flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-primary">Wartungsmodus</h1>
        <p className="text-lg">
          Die 24-Stunden-Lauf-App wird aktuell gewartet. Bitte versuche es
          später erneut.
        </p>

        <progress className="progress progress-primary w-full my-2" />
      </div>
    </main>
  );
}
