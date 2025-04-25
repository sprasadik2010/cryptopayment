import { useState } from "react";
import { Link } from "react-router-dom";

export default function MobileMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Hamburger Icon */}
      <button
        className="md:hidden text-gray-600 text-2xl z-50 relative"
        onClick={() => setMenuOpen(true)}
      >
        ☰
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
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 text-2xl"
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>

        {/* Menu Items */}
        <ul className="flex flex-col space-y-4 mt-16 px-6">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
          <li><Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          <li>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block bg-blue-600 text-white text-center py-2 rounded-lg"
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
