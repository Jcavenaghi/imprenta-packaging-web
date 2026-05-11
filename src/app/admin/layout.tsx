import { ReactNode } from "react";
import AdminNav from "@/components/admin/admin-nav";
import AdminLoginForm from "@/components/admin/admin-login-form";
import { getAdminSessionUsername } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

/**
 * Root layout for all /admin routes. It checks if an admin session exists
 * and either renders the login form or the admin shell with navigation.
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const username = await getAdminSessionUsername();
  // If there is no admin session, show the login form without any nav.
  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AdminLoginForm />
      </div>
    );
  }
  // Otherwise render the admin shell with a sidebar and main area.
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 p-4 border-r bg-gray-50">
        <AdminNav />
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
