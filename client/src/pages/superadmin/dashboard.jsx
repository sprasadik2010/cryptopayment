import { useEffect, useState } from "react";
import SuperAdminNavBar from "../../components/superadmin/common/superadminnavbar";
import Members from "./members";
import AllWithdrawals from "./withdrawals";

export default function DashBoard(){
    const [user, setUser] = useState(null); 
        useEffect(() => {
            const token = localStorage.getItem("access_token"); // Ensure consistent token usage
            if (!token) {
                navigate("/login"); // Redirect if not authenticated
            } else {
                fetchUserDetails(token); // Call API only if token exists
            }
        }, []);
    
        async function fetchUserDetails(token) {
            try {
                const response = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/getamember`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
    
                if (!response.ok) 
                    {
                        console.log("Failed to fetch user details");
                        localStorage.removeItem("access_token");
                        navigate("/login");
                    }
    
                const userData = await response.json();
                localStorage.setItem("currentuser", JSON.stringify(userData));
                setUser(userData); // Store user data in state
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        }
    return(
        <>
        <SuperAdminNavBar/>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
                <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
                <p className="text-gray-600">Welcome Superadmin !!!</p>
            </div>
        </div>     
        </>
    )
}