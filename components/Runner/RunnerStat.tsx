export default function RunnerStat({
  value,
  label,
}: {
  value: number | string | undefined;
  label: string;
}) {
  return (
    <div>
      {value ? (
        <h1 className="text-center text-3xl font-bold sm:text-5xl">
          <div className="inline text-base-300">
            {'0'.repeat(Math.max(3 - value.toString().length, 0))}
          </div>
          {value.toString()}
        </h1>
      ) : (
        <span className="loading loading-dots loading-lg" />
      )}
      <h2 className="text-base-400 text-center text-sm font-bold opacity-80 sm:text-xl">
        {label}
      </h2>
    </div>
  );
}
