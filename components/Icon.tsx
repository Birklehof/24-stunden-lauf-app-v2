import { lookupIcon, PossibleIcons } from 'heroicons-lookup';

interface IconProps {
  name: PossibleIcons;
}

export default function Icon({ name = 'ArrowLeftIcon' }: IconProps) {
  const LookedUpIcon = lookupIcon(name, 'outline');
  return <LookedUpIcon className="flex h-5 w-5" />;
}
