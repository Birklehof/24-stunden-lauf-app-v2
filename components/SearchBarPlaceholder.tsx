export default function SearchBarPlaceholder() {
  return (
    <div
      className="search-bar !relative !left-0 !z-0 !translate-x-0"
      aria-hidden
    >
      <input
        disabled
        aria-hidden
        className="input-bordered input rounded-box w-10 grow bg-accent opacity-0"
        placeholder="Suchen ..."
      />
    </div>
  );
}
