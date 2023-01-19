import { PossibleIcons } from "heroicons-lookup";
import Link from "next/link";
import useAuth from "lib/hooks/useAuth";
import Icon from "components/Icon";

interface MenuProps {
  navItems: NavItem[];
}

interface NavItem {
  name: string;
  href: string;
  icon: PossibleIcons;
}

export default function Menu({ navItems }: MenuProps) {
  const { isLoggedIn, logout } = useAuth();

  return (
    <>
      <ul className="menu menu-horizontal lg:menu-vertical bg-base-100 p-2 rounded-box z-40 absolute bottom-5 lg:top-5 lg:left-5 lg:gap-2 shadow-2xl">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link href={item.href}>
              <Icon name={item.icon} />
            </Link>
          </li>
        ))}
        {isLoggedIn && (
          <li>
            <div onClick={logout}>
              <Icon name="LogoutIcon" />
            </div>
          </li>
        )}
      </ul>
    </>
  );
}
