import { ToastOptions, ToastPromiseParams, toast } from 'react-toastify';
import { NavItem } from '@/lib/interfaces';

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

export const runnerNavItems: NavItem[] = [
  { name: 'Startseite', href: '/runner', icon: 'HomeIcon' },
  {
    name: 'Ranking',
    href: '/ranking',
    icon: 'TrendingUpIcon',
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
