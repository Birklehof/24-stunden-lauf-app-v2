export type PossibleIcons = keyof typeof icons;
import {
  AdjustmentsVerticalIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  TrophyIcon,
  UserIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
interface IconProps {
  name: PossibleIcons;
  size?: number;
}

const icons: { [key: string]: any } = {
  HomeIcon: HomeIcon,
  TrophyIcon: TrophyIcon,
  ChartBarIcon: ChartBarIcon,
  Cog6ToothIcon: Cog6ToothIcon,
  ArrowLeftIcon: ArrowLeftIcon,
  InformationCircleIcon: InformationCircleIcon,
  AdjustmentsVerticalIcon: AdjustmentsVerticalIcon,
  UserPlusIcon: UserPlusIcon,
  TrashIcon: TrashIcon,
  UserIcon: UserIcon,
  Search: MagnifyingGlassIcon,
  RefreshIcon: ArrowPathIcon,
} as const;

export default function Icon({ name = '', size = 7 }: IconProps) {
  const sizeClass =
    {
      4: 'h-4 w-4',
      5: 'h-5 w-5',
      6: 'h-6 w-6',
      7: 'h-7 w-7',
      8: 'h-8 w-8',
      10: 'h-10 w-10',
    }[size] || 'h-7 w-7';

  if (name in icons) {
    const LookedUpIcon = icons[name];
    return <LookedUpIcon className={sizeClass} />;
  } else {
    return <ExclamationTriangleIcon />;
  }
}
