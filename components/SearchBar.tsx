interface SearchBarProps {
  text: string;
  setText: (text: string) => void;
}

export default function SearchBar({ text, setText }: SearchBarProps) {
  return (
    <div className="searchbox">
      <div className="input-elements-container">
        <input
          type="text"
          placeholder="Suchen..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </div>
  );
}
