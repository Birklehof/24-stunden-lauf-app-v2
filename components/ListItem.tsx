import { ReactNode } from 'react';

interface ListItemProps {
  id?: string;
  number?: number;
  mainContent: string;
  secondaryContent?: string;
  badges?: string[];
  children?: ReactNode | undefined;
  highlight?: boolean;
  medals?: boolean;
}

export default function ListItem({
  id,
  number,
  mainContent,
  secondaryContent,
  badges,
  children,
  highlight,
  medals = true,
}: ListItemProps) {
  return (
    <div
      id={id}
      className={`font-medium ${highlight && '!border-b-4 !border-b-primary !font-bold'}`}
    >
      <div className="card-body w-full flex-row p-3 text-xl">
        <div className="flex grow flex-col justify-center overflow-hidden text-ellipsis pl-1">
          <div className="line-clamp-">
            {number != undefined && (number > 3 || !medals) && (
              <>
                <span className="opacity-20">
                  {'0'.repeat(3 - number.toString().length)}
                </span>
                <span className="pr-1">{number}</span>
              </>
            )}
            {number != undefined && (number < 3 && medals) && (
              <>
                <span className="px-2">{['🥇', '🥈', '🥉'][number - 1]}</span>
              </>
            )}
            {mainContent}
          </div>

          {secondaryContent && (
            <span className="line-clamp-1 flex overflow-hidden text-ellipsis whitespace-nowrap">
              {secondaryContent}
            </span>
          )}
          {(badges?.length || 0) > 0 && (
            <div className="flex flex-row flex-wrap gap-1 py-1">
              {badges?.map((badge) => (
                <span
                  key={badge}
                  className="badge badge-info badge-outline justify-start overflow-hidden whitespace-nowrap"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex w-min flex-row gap-1">{children}</div>
      </div>
    </div>
  );
}
