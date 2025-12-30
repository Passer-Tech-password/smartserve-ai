import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  children: ReactNode;
};

export default function NavLink({ href, children }: NavLinkProps) {
  const path = usePathname();
  const active = path === href || path.startsWith(`${href}#`);

  return (
    <Link
      href={href}
      className={`relative group text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition
        ${active ? "text-blue-600 dark:text-blue-400" : ""}
      `}
    >
      {children}

      {/* Animated underline */}
      <span
        className={`absolute left-0 -bottom-1 h-[2px] bg-blue-600 dark:bg-blue-400 transition-all duration-300
          ${active ? "w-full" : "w-0 group-hover:w-full"}
        `}
      />
    </Link>
  );
}
