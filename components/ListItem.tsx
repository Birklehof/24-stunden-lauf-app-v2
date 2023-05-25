import { ReactNode } from 'react';

interface ListItemProps {
  number?: number;
  mainContent: string;
  secondaryContent?: string;
  badges?: string[];
  children?: ReactNode | undefined;
}

export default function ListItem({
  number,
  mainContent,
  secondaryContent,
  badges,
  children,
}: ListItemProps) {
  return (
    <div className="card rounded-box flex flex-row gap-0 bg-base-100 p-1 pl-3 shadow-md">
      <div className="flex grow flex-col justify-center">
        <div className="flex w-full flex-row items-center">
          {number != undefined && (
            <>
              <span className="opacity-60">
                {'0'.repeat(3 - number.toString().length)}
              </span>
              <span className="pr-1">{number}</span>
            </>
          )}
          <span className="overflow-hidden text-ellipsis whitespace-nowrap pr-1 font-semibold">
            {mainContent}
          </span>
          {secondaryContent && (
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {secondaryContent}
            </span>
          )}
        </div>
        {(badges?.length || 0) > 0 && (
          <div className="flex flex-row gap-1 pb-1">
            {badges?.map((badge) => (
              <span key={badge} className="badge-success badge-outline badge">
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
