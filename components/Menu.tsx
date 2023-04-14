import { PossibleIcons } from "heroicons-lookup";
import Link from "next/link";
import useAuth from "@/lib/hooks/useAuth";
import Icon from "@/components/Icon";

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
      <div className="menu menu-horizontal lg:menu-vertical bg-base-100 p-2 rounded-full z-40 absolute bottom-3 lg:bottom-1/2 lg:translate-y-1/2 lg:left-3 lg:gap-2 shadow-2xl">
        <ul className="flex flex-row lg:flex-col gap-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="btn !btn-ghost !btn-circle"
                aria-label={item.name}
              >
                <Icon name={item.icon} />
              </Link>
            </li>
          ))}
        </ul>
        <div className="divider divider-horizontal lg:divider-vertical !m-0" />
        <button
          disabled={!isLoggedIn}
          onClick={logout}
          className="text-error btn btn-ghost btn-circle"
          aria-label="Logout"
        >
          <Icon name="LogoutIcon" />
        </button>
      </div>
    </>
  );
}
