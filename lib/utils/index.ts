import { ToastOptions, ToastPromiseParams, toast } from 'react-toastify';
import { Runner } from '@/lib/interfaces';
import { PossibleIcons } from '@/components/Icon';

export interface NavItem {
  name: string;
  href: string;
  icon: PossibleIcons;
}

// Used in pages/runner/index.tsx, pages/runner/charts.tsx, pages/assistant/index.tsx, pages/assistant/create-runner.tsx
export const runnerNavItems: NavItem[] = [
  { name: 'Startseite', href: '/runner', icon: 'HomeIcon' },
  { name: 'Ranking', href: '/ranking', icon: 'TrophyIcon' },
  { name: 'Statistik', href: '/runner/charts', icon: 'ChartBarIcon' },
  { name: 'Einstellungen', href: '/settings', icon: 'Cog6ToothIcon' },
];
export const assistantNavItems: NavItem[] = [
  { name: 'Runde zählen', href: '/assistant', icon: 'HomeIcon' },
  { name: 'Ranking', href: '/ranking', icon: 'TrophyIcon' },
  {
    name: 'Läufer hinzufügen',
    href: '/assistant/create-runner',
    icon: 'UserPlusIcon',
  },
  { name: 'Einstellungen', href: '/settings', icon: 'Cog6ToothIcon' },
];

// Used in components/LoginOptions.tsx, pages/assistant/create-runner.tsx, pages/assistant/index.tsx
export function themedPromiseToast(
  promise: Promise<any> | (() => Promise<any>),
  { pending, error, success }: ToastPromiseParams<any, unknown, unknown>,
  options?: ToastOptions<{}> | undefined
) {
  return toast.promise(
    promise,
    { pending, success, error },
    {
      ...options,
      theme:
        document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
    }
  );
}

// Used in components/LoginOptions.tsx
export function themedErrorToast(
  message: string,
  options?: ToastOptions<{}> | undefined
) {
  return toast.error(message, {
    ...options,
    theme:
      document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
  });
}

// Used in pages/ranking.tsx
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
      return (
        false ||
        (filterHouse == 'ExtKol' && !filterClasses && runner.type == 'staff')
      );
    }
  }

  return (
    !filterName || runner.name?.toLowerCase().includes(filterName.toLowerCase())
  );
}

export function formatKilometer(number: number | null) {
  if (!number) {
    return '0.00';
  }

  return (number / 1000).toFixed(
    number / 1000 < 10 ? 2 : number / 1000 < 100 ? 1 : 0
  );
}

export function getRandomEntry<T>(list: Array<T>): T | null {
  if (list.length === 0) return null; // Return null if array is empty
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}
