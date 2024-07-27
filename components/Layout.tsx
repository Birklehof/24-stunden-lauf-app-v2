import { PropsWithChildren, useEffect } from 'react';
import { useDarkMode } from 'usehooks-ts';

export default function Layout({ children }: PropsWithChildren) {
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const body = document.body;
    body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return <>{children}</>;
}
