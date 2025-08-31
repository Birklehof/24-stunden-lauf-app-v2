import {
  AlertTriangle,
  ArrowUpLeft,
  Award,
  BarChart,
  House,
  Info,
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
  UserIcon: User
} as const;

export default function Icon({
  name = 'ArrowLeftIcon',
  className = '',
}: IconProps) {
  if (name in icons) {
    const LookedUpIcon = icons[name] || icons.x;
    return <LookedUpIcon size={24} className={className} />;
  } else {
    return <AlertTriangle size={24} color="#FF0000" />;
  }
}
