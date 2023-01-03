import Menu from "./Menu";

export default function RunnerMenu() {
  return (
    <>
      <Menu
        navItems={[
          { name: "Start", href: "/runner", icon: "HomeIcon" },
          {
            name: "Leaderboard",
            href: "/runner/leaderboard",
            icon: "TrendingUpIcon",
          },
          { name: "Graphen", href: "/runner/graphs", icon: "ChartBarIcon" },
          { name: "Account", href: "/runner/account", icon: "UserIcon" },
        ]}
      />
    </>
  );
}
