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
        <h1 className="text-center text-3xl font-bold sm:text-5xl">
          <div className="inline text-base-300">
            {'0'.repeat(Math.max(3 - value.toString().length, 0))}
          </div>
          {value.toString()}
        </h1>
      ) : (
        <span className="loading loading-dots loading-lg" />
      )}
      <h2 className="text-base-400 text-center text-sm font-bold opacity-80 sm:text-xl max-w-[150px] sm:max-w-[200px]">
        {label}
      </h2>
    </div>
  );
}
