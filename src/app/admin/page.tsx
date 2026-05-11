import { redirect } from "next/navigation";
import { getAdminSessionUsername } from "@/lib/admin/auth";

/**
 * The root /admin page. If authenticated it redirects to the products
 * management page. Otherwise the layout will display the login form.
 */
export default async function AdminRootPage() {
  // If no session, requireAdminSession will throw which is fine — the
  // layout will handle displaying the login form. If authenticated,
  // we redirect to the products list as the default admin view.
  const username = await getAdminSessionUsername();
  if (username) {
    redirect("/admin/products");
  }
  return null;
}
