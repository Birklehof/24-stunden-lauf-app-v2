import Link from 'next/link';
import Icon from '@/components/Icon';

interface SearchBarProps {
  searchValue: string;
  setSearchValue: Function;
  filters?: FilterInputs[];
  backLink?: string;
}

interface FilterInputs {
  filerValue: string;
  setFilterValue: Function;
  filterOptions?: { value: string; label: string }[];
}

export default function SearchBar({
  searchValue,
  setSearchValue,
  filters,
  backLink,
}: SearchBarProps) {
  return (
    <div className="search-bar">
      <div className="form-control max-w-xl flex grow flex-row justify-between gap-3 m-auto">
        {backLink && (
          <Link
            href={backLink}
            aria-label="Zurück"
            className="btn-ghost btn-square btn"
          >
            <Icon name="ArrowLeftIcon" />
          </Link>
        )}
        <input
          className="input-bordered input rounded-box w-10 grow bg-accent"
          type="search"
          inputMode="search"
          placeholder="Suchen ..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {filters && (
          <div className="dropdown-bottom dropdown-end dropdown">
            <label
              id="filter-button"
              tabIndex={0}
              className="btn-ghost btn-square btn"
              aria-label="Filtern"
            >
              <Icon name="AdjustmentsIcon" />
            </label>

            <div
              tabIndex={0}
              className="dropdown-content menu rounded-box flex flex-col gap-3 p-3 shadow bg-accent overflow-x-hidden"
            >
              {filters?.map((filter) => (
                <select
                  key={filter.filterOptions?.toString()}
                  className="select-bordered select select-sm grow bg-accent"
                  onChange={(e) => filter.setFilterValue(e.target.value)}
                  value={filter.filerValue}
                >
                  {filter.filterOptions?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
