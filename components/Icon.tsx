import {
  AlertTriangle,
  ArrowUpLeft,
  Award,
  BarChart,
  House,
  Info,
  Search,
  Settings,
  Sliders,
  Trash2,
  User,
  UserPlus,
} from '@deemlol/next-icons';

export type PossibleIcons = keyof typeof icons;

interface IconProps {
  name: PossibleIcons;
  className?: string;
  size?: number;
}

const icons: { [key: string]: any } = {
  HomeIcon: House,
  TrophyIcon: Award,
  ChartBarIcon: BarChart,
  Cog6ToothIcon: Settings,
  ArrowLeftIcon: ArrowUpLeft,
  InformationCircleIcon: Info,
  AdjustmentsVerticalIcon: Sliders,
  UserPlusIcon: UserPlus,
  TrashIcon: Trash2,
  UserIcon: User,
  Search: Search,
} as const;

export default function Icon({
  name = 'ArrowLeftIcon',
  className = '',
  size = 24,
}: IconProps) {
  if (name in icons) {
    const LookedUpIcon = icons[name] || icons.x;
    return <LookedUpIcon size={size} className={className} />;
  } else {
    return <AlertTriangle size={size} color="#FF0000" />;
  }
}
