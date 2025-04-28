import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BinaryTree from "../../components/user/home/binarytree";
import UserNavBar from "../../components/user/common/usernavbar";

export default function DashBoard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // State to store user details

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

    return (
        <>            
            <UserNavBar />
            <h2>Welcome,  {
            user ? 
            <span className="font-bold text-green-600"> {user.name} </span>: 
            <span className="font-bold text-orange-600"> "Loading..." </span>
            }</h2>            
            {user && <BinaryTree  Currentusername={user.username} CurrentUserId={user.id} />}
        </>
    );
}
