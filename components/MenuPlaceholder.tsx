import Link from "next/link";
import Icon from "./Icon";

export default function MenuPlaceholder() {
  return (
    <div
      aria-label="Menu"
      className="menu menu-horizontal z-0 w-full justify-center bg-accent p-2 shadow-xl"
    >
      <div className="flex flex-row gap-2">
          <Link
            href=''
            className="btn-ghost btn-square btn justify-center"
          >
            <Icon name='HomeIcon' />
          </Link>
      </div>
      <div className="divider divider-horizontal !m-0" />
    </div>
  );
}
