import { Link, useNavigate } from "react-router-dom";

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token"); 
        localStorage.removeItem("currentuser"); 
        navigate("/"); // 🔄 Redirect to home page
    };

    return (
        <button 
            onClick={handleLogout} 
            className="hidden md:block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
        >
            Logout
        </button>
    );
}
