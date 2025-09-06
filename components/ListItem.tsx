import { ReactNode } from 'react';

interface ListItemProps {
  id?: string;
  number?: number;
  mainContent: string;
  secondaryContent?: string;
  children?: ReactNode | undefined;
  highlight?: boolean;
  medals?: boolean;
}

export default function ListItem({
  id,
  number,
  mainContent,
  secondaryContent,
  children,
  highlight,
  medals = true,
}: ListItemProps) {
  return (
    <li
      id={id}
      key={id}
      className={`list-row ${highlight && 'border-b-4 border-b-primary font-bold'}`}
    >
      <div className={`tabular-nums ${secondaryContent ? 'text-3xl' : 'text-xl'}`}>
        {number != undefined && (number > 3 || !medals) && (
          <>
            <span className="opacity-20 font-mono">
              {'0'.repeat(3 - number.toString().length)}
            </span>
            <span className="pr-1 font-mono">{number}</span>
          </>
        )}
        {number != undefined && number <= 3 && medals && (
          <>
            <span className="font-mono">{['🥇', '🥈', '🥉'][number - 1]} </span>
          </>
        )}
      </div>
      <div className={`list-col-grow ${secondaryContent ? 'text-base' : 'text-xl'}`}>
        {mainContent}
        <div className='text-xs'>{secondaryContent}</div>
      </div>
      <div>
        {children}
      </div>
    </li>
  );
}
