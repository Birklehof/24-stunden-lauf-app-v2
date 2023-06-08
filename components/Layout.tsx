import React, { PropsWithChildren, useEffect } from 'react';
import Icon from './Icon';
import { useDarkMode } from 'usehooks-ts';
import { useRouter } from 'next/router';
import Menu from './Menu';

export default function Layout({ children }: PropsWithChildren) {
  const { isDarkMode, toggle } = useDarkMode();
  const router = useRouter();

  useEffect(() => {
    const body = document.body;
    body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <>
      <button
        className="btn-ghost btn-square btn absolute top-3 left-3 hidden md:flex"
        onClick={toggle}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M448 256c0-106-86-192-192-192V448c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
        </svg>
      </button>

      {router.asPath.split('/')[1] === 'runner' ? (
        <Menu
          // Runner Menu
          navItems={[
            { name: 'Start', href: '/runner', icon: 'HomeIcon' },
            {
              name: 'Ranking',
              href: '/runner/ranking',
              icon: 'TrendingUpIcon',
            },
            {
              name: 'Charts',
              href: '/runner/charts',
              icon: 'ChartBarIcon',
            },
          ]}
        />
      ) : (
        router.asPath.split('/')[1] === 'assistant' && (
          <Menu
            // Assistant Menu
            navItems={[
              {
                name: 'Runde zählen',
                href: '/assistant',
                icon: 'PlusCircleIcon',
              },
              {
                name: 'Runde löschen',
                href: '/assistant/laps',
                icon: 'ViewListIcon',
              },
              {
                name: 'Läufer hinzufügen',
                href: '/assistant/create-runner',
                icon: 'UserAddIcon',
              },
            ]}
          />
        )
      )}
      {children}
    </>
  );
}
