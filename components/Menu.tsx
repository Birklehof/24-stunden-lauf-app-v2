import Link from 'next/link';
import Icon from '@/components/Icon';
import { NavItem } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface MenuProps {
  navItems: NavItem[];
}

export default function Menu({ navItems }: MenuProps) {
  const pathname = usePathname();

  return (
    <div aria-label="Menu" className="dock text-accent-content bg-accent">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={pathname == item.href ? 'dock-active!' : ''}
          aria-label={item.name}
        >
          <Icon name={item.icon} />
        </Link>
      ))}
    </div>
  );
}
