import { redirect } from "next/navigation";
import { getAdminSessionUsername } from "@/lib/admin/auth";

/**
 * The root /admin page. If authenticated it redirects to the products
 * management page. Otherwise the layout will display the login form.
 */
export default async function AdminRootPage() {
  // With a valid session, redirect to the default admin products view.
  // Without one, the admin layout renders the login form for this route.
  const username = await getAdminSessionUsername();
  if (username) {
    redirect("/admin/products");
  }
  return null;
}
