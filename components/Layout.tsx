import React, { PropsWithChildren, useEffect } from "react";
import Icon from "./Icon";
import { useDarkMode } from "usehooks-ts";

const Layout = ({ children }: PropsWithChildren) => {
  const { isDarkMode, toggle } = useDarkMode();

  useEffect(() => {
    const body = document.body;
    body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <>
      <button
        className="btn btn-square btn-ghost absolute top-3 left-3"
        onClick={toggle}
      >
        {isDarkMode ? <Icon name="MoonIcon" /> : <Icon name="SunIcon" />}
      </button>
      {children}
    </>
  );
};
export default Layout;
