import { ToastOptions, ToastPromiseParams, toast } from 'react-toastify';
import { Lap, Runner } from '@/lib/interfaces';
import { PossibleIcons } from 'heroicons-lookup';

export interface NavItem {
  name: string;
  href: string;
  icon: PossibleIcons;
}

// Used in runner/index.tsx, runner/charts.tsx, assistant/index.tsx, assistant/create-runner.tsx 
export const runnerNavItems: NavItem[] = [
  { name: 'Startseite', href: '/runner', icon: 'HomeIcon' },
  {
    name: 'Ranking',
    href: '/ranking',
    icon: 'TrendingUpIcon',
  },
  {
    name: 'Statistik',
    href: '/runner/charts',
    icon: 'ChartBarIcon',
  },
];
export const assistantNavItems: NavItem[] = [
  {
    name: 'Runde zählen',
    href: '/assistant',
    icon: 'HomeIcon',
  },
  {
    name: 'Ranking',
    href: '/ranking',
    icon: 'TrendingUpIcon',
  },
  {
    name: 'Läufer hinzufügen',
    href: '/assistant/create-runner',
    icon: 'UserAddIcon',
  },
];

export function themedPromiseToast(
  promise: Promise<any> | (() => Promise<any>),
  { pending, error, success }: ToastPromiseParams<any, unknown, unknown>,
  options?: ToastOptions<{}> | undefined
) {
  return toast.promise(
    promise,
    {
      pending,
      success,
      error,
    },
    {
      ...options,
      theme:
        document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
    }
  );
}

export function themedErrorToast(
  message: string,
  options?: ToastOptions<{}> | undefined
) {
  console.log('themedErrorToast');
  console.log(document.body.getAttribute('data-theme'));

  return toast.error(message, {
    ...options,
    theme:
      document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
  });
}

export function groupLapsByHour(_laps: Lap[]): { [key: string]: number } {
  const groupedLaps: { [key: string]: number } = {};
  _laps.forEach((lap) => {
    const hour = (lap.createdAt.seconds / 60 / 60).toFixed(0);
    if (groupedLaps[hour]) {
      groupedLaps[hour]++;
    } else {
      groupedLaps[hour] = 1;
    }
  });
  const sortedGroupedLaps: { [key: string]: number } = {};
  Object.keys(groupedLaps)
    .sort()
    .forEach((key) => {
      sortedGroupedLaps[key] = groupedLaps[key];
    });
  return sortedGroupedLaps;
}

// Used in ranking.tsx
export function filterRunner(
  runner: Runner,
  {
    filterType,
    filterName,
    filterClasses,
    filterHouse,
  }: {
    filterType?: string;
    filterName?: string;
    filterClasses?: string;
    filterHouse?: string;
  }
) {
  if (filterType) {
    if (filterType === 'student' && runner.type !== 'student') {
      return false;
    }
    if (filterType === 'staff' && runner.type !== 'staff') {
      return false;
    }
    if (
      filterType === 'other' &&
      (runner.type === 'student' || runner.type === 'staff')
    ) {
      return false;
    }
  }

  if (filterClasses || filterHouse) {
    if (runner.type === 'student') {
      if (filterClasses && runner.class !== filterClasses) {
        return false;
      }
      if (filterHouse && runner.house !== filterHouse) {
        return false;
      }
    } else {
      return false || (filterHouse == 'Extern (Kollegium)' && !filterClasses);
    }
  }

  return !filterName || runner.name?.includes(filterName);
}
