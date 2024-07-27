export default function SearchBarPlaceholder() {
  return (
    <div className="search-bar !relative !translate-x-0 !left-0">
      <input
        className="input-bordered input rounded-box w-10 grow bg-accent opacity-0"
        placeholder="Suchen ..."
      />
    </div>
  );
}
