export default function Stat({
  value,
  label,
}: {
  value: number | string | undefined;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      {value !== undefined ? (
        <h1 className="text-center text-5xl font-bold">{value.toString()}</h1>
      ) : (
        <span className="loading loading-dots loading-lg" />
      )}
      <h2 className="text-center font-semibold opacity-80">
        {label}
      </h2>
    </div>
  );
}
