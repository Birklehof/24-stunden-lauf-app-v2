import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useDarkMode } from 'usehooks-ts';
import { auth } from '@/lib/firebase';

export default function Layout({ children }: PropsWithChildren) {
  const { isDarkMode, toggle } = useDarkMode();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.uid === process.env.NEXT_PUBLIC_ASSISTANT_ACCOUNT_UID) {
          setRole('assistant');
        } else {
          setRole('runner');
        }
      } else {
        setRole(null);
      }
    });
  }, []);

  useEffect(() => {
    const body = document.body;
    body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <>
      <button
        className="btn-ghost btn-square btn absolute left-4 top-4 hidden landscape:flex"
        onClick={toggle}
        aria-label="Dunkelmodus umschalten"
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

      {children}
    </>
  );
}
