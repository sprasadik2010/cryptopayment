import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function UserMobileMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClasses = ({ isActive }) =>
    isActive
      ? "block bg-blue-600 text-white px-4 py-2 rounded"
      : "block hover:text-blue-500 px-4 py-2 text-gray-700";

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-600"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-md p-4">
          <ul className="flex flex-col space-y-2">
            <li>
              <NavLink to="/auth/dashboard" className={linkClasses}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/auth/downlines" className={linkClasses}>
                Downlines
              </NavLink>
            </li>
            <li>
              <NavLink to="/auth/payouts" className={linkClasses}>
                Payouts
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
