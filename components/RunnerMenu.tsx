import Menu from "./Menu";

export default function RunnerMenu() {
  return (
    <>
      <Menu
        navItems={[
          { name: "Start", href: "/runner", icon: "HomeIcon" },
          {
            name: "Ranking",
            href: "/runner/ranking",
            icon: "TrendingUpIcon",
          },
        ]}
      />
    </>
  );
}
