import { ReactNode } from 'react';

interface ListItemProps {
  number?: number;
  mainContent: string;
  secondaryContent?: string;
  badges?: string[];
  children?: ReactNode | undefined;
  glass?: boolean;
}

export default function ListItem({
  number,
  mainContent,
  secondaryContent,
  badges,
  children,
  glass,
}: ListItemProps) {
  return (
    <div className={`centered-card ${glass && '!bg-opacity-60'}`}>
      <div className="card-body w-full flex-row p-1">
        <div className="flex grow flex-col justify-center overflow-hidden text-ellipsis pl-1">
          <div className="font-semibold">
            {number != undefined && (
              <>
                <span className="opacity-20">
                  {'0'.repeat(3 - number.toString().length)}
                </span>
                <span className="pr-1">{number}</span>
              </>
            )}
            {mainContent}
          </div>

          {secondaryContent && (
            <span className="flex overflow-hidden text-ellipsis whitespace-nowrap">
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
