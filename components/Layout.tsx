import React, { PropsWithChildren, useEffect } from 'react';
import { useDarkMode } from 'usehooks-ts';
import { useRouter } from 'next/router';
import Menu from './Menu';

// FIXME: Fix the menu which is shown based on the user's auth state

export default function Layout({ children }: PropsWithChildren) {
  const { isDarkMode, toggle } = useDarkMode();
  const router = useRouter();

  let role = 'runner' // Just test -> remove !!! -> based on url route?

  useEffect(() => {
    const body = document.body;
    body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <>
      <button
        className="btn-ghost btn-square btn absolute left-2 top-2 hidden landscape:flex"
        onClick={toggle}
        aria-label='Dunkelmodus umschalten'
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

      {role && (
        <>
          {role === 'assistant' ? (
            <Menu
              // Assistant Menu
              navItems={[
                {
                  name: 'Runde zählen',
                  href: '/assistant',
                  icon: 'HomeIcon',
                },
                {
                  name: 'Ranking',
                  href: '/shared/ranking',
                  icon: 'TrendingUpIcon',
                },
                {
                  name: 'Läufer hinzufügen',
                  href: '/assistant/create-runner',
                  icon: 'UserAddIcon',
                },
              ]}
            />
          ) : (
            <Menu
              // Runner Menu
              navItems={[
                { name: 'Startseite', href: '/runner', icon: 'HomeIcon' },
                {
                  name: 'Ranking',
                  href: '/shared/ranking',
                  icon: 'TrendingUpIcon',
                },
              ]}
            />
          )}
        </>
      )}
      {children}
    </>
  );
}
