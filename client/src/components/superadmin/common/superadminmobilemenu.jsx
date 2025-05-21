import { LogOut } from "lucide-react";
import { useState } from "react";
import { NavLink, Link, useNavigate  } from "react-router-dom";


export default function SuperAdminMobileMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");       
        localStorage.removeItem("currentuser"); 
        navigate("/"); // 🔄 Redirect to home page
    };

  const linkClasses = ({ isActive }) =>
    isActive
      ? "block bg-blue-600 text-white px-4 py-2 rounded"
      : "block hover:text-blue-500 px-4 py-2 text-gray-700";

  return (
    <>
      {/* Toggle Icon */}
      <button
        className="md:hidden text-gray-600 text-2xl z-50 relative"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Overlay */}
      <div
        className={`fixed top-0 right-0 w-full h-full bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white shadow-md z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button (redundant now as it's shown in ☰/✕ toggle but kept for design consistency) */}
        <button
          className="absolute top-4 right-4 text-gray-600 text-2xl"
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>

        {/* Menu Items */}
        <ul className="flex flex-col space-y-4 mt-16 px-6">
          <li>
            <NavLink to="/auth/adm/dashboard" className={linkClasses} onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/auth/adm/members" className={linkClasses} onClick={() => setMenuOpen(false)}>
              Manage Members
            </NavLink>
          </li>
          <li>
            <NavLink to="/auth/adm/profitclub" className={linkClasses} onClick={() => setMenuOpen(false)}>
              Manage Profit Club
            </NavLink>
          </li>
          <li>
            <NavLink to="/auth/adm/withdrawals" className={linkClasses} onClick={() => setMenuOpen(false)}>
              Manage Withdrawals
            </NavLink>
          </li>
          <li>
            <button 
                onClick={handleLogout} 
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
            >
                Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
