import { ReactNode } from 'react';

interface ListItemProps {
  id?: string;
  number?: number;
  mainContent: string;
  secondaryContent?: string;
  badgeContent?: string;
  children?: ReactNode | undefined;
  animated?: boolean;
  highlight?: boolean;
  medals?: boolean;
  extraLarge?: boolean;
}

export default function ListItem({
  id,
  number,
  mainContent,
  secondaryContent,
  badgeContent,
  children,
  animated = false,
  highlight,
  medals = true,
  extraLarge = false,
}: ListItemProps) {
  return (
    <li
      id={id}
      key={id}
      className={`list-row rounded-none p-2.5 ${animated && 'animate-fade-in'} ${highlight && 'border-b-4 border-b-primary font-bold'}`}
    >
      <div
        className={`tabular-nums tracking-tight opacity-90 my-auto ${secondaryContent ? 'text-3xl' : 'text-xl'} ${extraLarge ? 'text-8xl!' : ''}`}
      >
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
            <span className="font-mono px-2.5">{['🥇', '🥈', '🥉'][number - 1]} </span>
          </>
        )}
      </div>
      <div
        className={`list-col-grow tracking-wide ${extraLarge ? 'text-8xl overflow-hidden line-clamp-1' : 'text-xl'}`}
      >
        <div className='flex flex-row justify-between'>
          {mainContent}
          {badgeContent && <div className='text-primary font-bold'>
            <div className="badge badge-outline badge-primary mt-0.5">{badgeContent}</div>
          </div>}

        </div>
        <div className="text-xs">{secondaryContent}</div>
      </div>
      <div>{children}</div>
    </li>
  );
}
