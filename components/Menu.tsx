import Link from 'next/link';
import Icon from '@/components/Icon';
import { NavItem } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface MenuProps {
  navItems: NavItem[];
  signOut?: () => Promise<void>;
}

export default function Menu({ navItems, signOut: signOutAction }: MenuProps) {
  const pathname = usePathname();

  return (
    <div
      aria-label="Menu"
      className="menu menu-horizontal fixed bottom-0 left-0 z-40 w-full justify-center bg-accent p-2 shadow-xl"
    >
      <div className="flex flex-row gap-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`btn-ghost btn-square btn justify-center text-accent-content ${
              pathname == item.href && '!text-primary'
            }`}
            aria-label={item.name}
          >
            <Icon name={item.icon} />
          </Link>
        ))}
      </div>
      {signOutAction != undefined && (
        <>
          <div className="divider divider-horizontal !m-0" />
          <button
            onClick={signOutAction}
            className="btn-ghost btn-square btn text-error"
            aria-label="Logout"
          >
            <Icon name="LogoutIcon" />
          </button>
        </>
      )}
    </div>
  );
}
