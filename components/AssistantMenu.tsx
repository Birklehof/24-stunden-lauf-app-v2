import Menu from "./Menu";

export default function RunnerMenu() {
  return (
    <>
      <Menu
        navItems={[
          { name: "Runde zählen", href: "/assistant", icon: "PlusCircleIcon" },
          {
            name: "Runde löschen",
            href: "/assistant/view-laps",
            icon: "ViewListIcon",
          },
          {
            name: "Läufer hinzufügen",
            href: "/assistant/create-runner",
            icon: "UserAddIcon",
          },
        ]}
      />
    </>
  );
}
