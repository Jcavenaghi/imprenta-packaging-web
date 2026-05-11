"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/admin/actions";

/**
 * Navigation component for the admin area. Highlights the current route and
 * provides a logout button.
 */
export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    await logout();
    router.refresh();
  }

  const links = [
    { href: "/admin/products", label: "Productos" },
    { href: "/admin/quote-requests", label: "Presupuestos" },
  ];

  return (
    <nav className="space-y-4">
      <ul className="space-y-2">
        {links.map(({ href, label }) => {
          const isActive = pathname?.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
                  isActive ? "bg-gray-200" : ""
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      <hr className="my-4" />
      <button
        onClick={handleLogout}
        className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Cerrar sesión
      </button>
    </nav>
  );
}