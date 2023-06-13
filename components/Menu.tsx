import { PossibleIcons } from 'heroicons-lookup';
import Link from 'next/link';
import useAuth from '@/lib/hooks/useAuth';
import Icon from '@/components/Icon';

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
      <div className="menu w-max rounded-box menu-horizontal absolute bottom-3 left-1/2 z-40 -translate-x-1/2 bg-base-100 p-2 shadow-xl lg:bottom-1/2 lg:left-2 lg:translate-x-0 lg:translate-y-1/2 lg:gap-2 lg:menu-vertical">
        <ul className="flex flex-row gap-2 lg:flex-col">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="btn-ghost btn-square btn justify-center btn-sm md:btn-md"
              aria-label={item.name}
            >
              <Icon name={item.icon} />
            </Link>
          ))}
        </ul>
        <div className="divider divider-horizontal !m-0 lg:divider-vertical" />
        <button
          disabled={!isLoggedIn}
          onClick={logout}
          className="btn-ghost btn-square btn text-error btn-sm md:btn-md"
          aria-label="Logout"
        >
          <Icon name="LogoutIcon" />
        </button>
      </div>
    </>
  );
}
