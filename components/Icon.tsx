import { lookupIcon, PossibleIcons } from 'heroicons-lookup';

interface IconProps {
  name: PossibleIcons;
  className?: string;
}

export default function Icon({
  name = 'ArrowLeftIcon',
  className = '',
}: IconProps) {
  const LookedUpIcon = lookupIcon(name, 'outline');
  return <LookedUpIcon className={'flex h-7 w-7'.concat(className)} />;
}
