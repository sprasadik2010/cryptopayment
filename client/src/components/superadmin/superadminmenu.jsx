import { NavLink } from "react-router-dom";

export default function SuperAdminMenu() {
  const linkClasses = ({ isActive }) =>
    isActive
      ? "bg-blue-600 text-white px-4 py-2 rounded"
      : "hover:text-blue-500 text-gray-700 px-4 py-2";

  return (
    <ul className="hidden md:flex space-x-6">
      <li>
        <NavLink to="/auth/adm/dashboard" className={linkClasses}>
          Home
        </NavLink>
      </li>
    </ul>
  );
}
