import useTheme from "@/lib/hooks/useTheme";
import React, { PropsWithChildren } from "react";
import Icon from "./Icon";

const Layout = ({ children }: PropsWithChildren) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <button
        className="btn btn-square btn-ghost absolute top-3 left-3"
        onClick={toggleTheme}
      >
        {theme === "dark" ? <Icon name="MoonIcon" /> : <Icon name="SunIcon" />}
      </button>
      {children}
    </>
  );
};
export default Layout;
