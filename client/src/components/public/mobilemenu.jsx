
{/* Mobile Menu */}
import { useState } from "react";
import { Link } from "react-router-dom";
export default function MobileMenu(){    
    const [menuOpen, setMenuOpen] = useState(false);
    return(
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
          <ul className="flex flex-col space-y-4">
            <li><Link to="/" className="block">Home</Link></li>
            <li><Link to="/about" className="block">About</Link></li>
            <li><Link to="/services" className="block">Services</Link></li>
            <li><Link to="/contact" className="block">Contact</Link></li>
            <li>
              <Link to="/login" className="block bg-blue-600 text-white text-center py-2 rounded-lg">
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}
      </>
    );
}