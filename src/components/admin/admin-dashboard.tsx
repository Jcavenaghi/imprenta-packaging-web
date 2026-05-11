/**
 * Placeholder admin dashboard component. You can enhance this to show
 * quick stats or useful links for the administrator. Currently it
 * simply greets the admin user.
 */
export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Panel de administración</h1>
      <p className="text-gray-600">
        Bienvenido al panel de administración. Seleccioná una sección del menú
        para comenzar.
      </p>
    </div>
  );
}