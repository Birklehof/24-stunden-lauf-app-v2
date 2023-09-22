import Link from 'next/link';
import Icon from '@/components/Icon';
import { NavItem } from '@/lib/utils';

interface MenuProps {
  navItems: NavItem[];
  signOut: () => Promise<void>;
}

export default function Menu({ navItems, signOut: signOutAction }: MenuProps) {
  return (
    <>
      <div
        aria-label="Menu"
        className="menu rounded-box menu-horizontal fixed bottom-3 left-1/2 z-40 w-max -translate-x-1/2 bg-base-100 p-2 shadow-xl landscape:menu-vertical landscape:bottom-1/2 landscape:left-2 landscape:translate-x-0 landscape:translate-y-1/2 landscape:gap-2"
      >
        <div className="flex flex-row gap-2 landscape:flex-col">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="btn-ghost btn-square btn justify-center"
              aria-label={item.name}
            >
              <Icon name={item.icon} />
            </Link>
          ))}
        </div>
        <div className="divider divider-horizontal !m-0 landscape:divider-vertical" />
        <button
          onClick={signOutAction}
          className="btn-ghost btn-square btn text-error"
          aria-label="Logout"
        >
          <Icon name="LogoutIcon" />
        </button>
      </div>
    </>
  );
}
