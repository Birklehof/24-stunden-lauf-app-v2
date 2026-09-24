import type { ComponentType, SVGProps } from 'react'
import {
  AdjustmentsVerticalIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  TrophyIcon,
  UserIcon,
  UserPlusIcon,
  BugAntIcon,
  LifebuoyIcon,
  CodeBracketIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

const icons = {
  HomeIcon,
  TrophyIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  AdjustmentsVerticalIcon,
  UserPlusIcon,
  TrashIcon,
  UserIcon,
  Search: MagnifyingGlassIcon,
  RefreshIcon: ArrowPathIcon,
  BugIcon: BugAntIcon,
  HelpIcon: LifebuoyIcon,
  CodeIcon: CodeBracketIcon,
} satisfies Record<string, IconComponent>

export type PossibleIcons = keyof typeof icons

interface IconProps {
  name?: PossibleIcons
  size?: 4 | 5 | 6 | 7 | 8 | 10
  className?: string
}

const sizeClassMap: Record<NonNullable<IconProps['size']>, string> = {
  4: 'h-4 w-4',
  5: 'h-5 w-5',
  6: 'h-6 w-6',
  7: 'h-7 w-7',
  8: 'h-8 w-8',
  10: 'h-10 w-10',
}

export default function Icon({
  name = 'HelpIcon',
  size = 7,
  className = '',
}: IconProps) {
  const IconComponent = name ? icons[name] : ExclamationTriangleIcon

  const sizeClass = sizeClassMap[size] ?? 'h-7 w-7'

  return <IconComponent className={`${sizeClass} ${className}`} />
}
