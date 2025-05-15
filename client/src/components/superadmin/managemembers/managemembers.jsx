import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminNavBar from "../../components/superadmin/superadminnavbar";

export default function ManageMembers() {
    const navigate = useNavigate();
    const [allusers, setAllUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
        } else {
            fetchUserDetails(token);
            fetchUsers(token);
        }
    }, []);

    const formatDate = (isoDateStr) => {
        const date = new Date(isoDateStr);
        const day = date.getDate();
        const suffix = ['th', 'st', 'nd', 'rd'][
            (day % 10 > 3 || ~~((day % 100) / 10) === 1) ? 0 : day % 10
        ];
        return `${day}${suffix} ${date.toLocaleString('en-US', { month: 'short', year: 'numeric' })}`;
    };

    async function fetchUserDetails(token) {
        try {
            const response = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/getamember`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Failed to fetch user details");

            const userData = await response.json();
            localStorage.setItem("currentuser", JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }

    async function fetchUsers(token) {
        try {
            const response = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/getallmembers`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Failed to fetch users");

            const userData = await response.json();
            setAllUsers(userData);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    const handleToggle = (name, username, newStatus) => {
        setModalData({ name, username, newStatus });
        setShowModal(true);
    };

    const confirmToggle = async () => {
        if (!modalData) return;
        const { username, newStatus } = modalData;
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/activate-deactivate-user/${username}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ is_active: newStatus })
            });

            if (!response.ok) throw new Error("Failed to update status");

            setAllUsers((prev) =>
                prev.map((u) => (u.username === username ? { ...u, is_active: newStatus } : u))
            );
            setShowModal(false);
        } catch (err) {
            console.error("Error updating active status", err);
        }
    };

    const renderTable = (children, title) => (
        <div className="w-full px-2 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
            <div className="w-full">
                <table className="w-full text-sm text-left border border-gray-300 table-fixed">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-1 border-b break-words">#</th>
                            <th className="py-2 px-1 border-b break-words">Name</th>
                            <th className="py-2 px-1 border-b break-words">Joining Date</th>
                            <th className="py-2 px-1 border-b break-words">Parent</th>
                            <th className="py-2 px-1 border-b break-words">Referred By</th>
                            <th className="py-2 px-1 border-b break-words">Is Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {children.map((c, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className={`py-2 px-1 border-b ${!c.is_active ? 'text-gray-400' : 'font-bold text-green-500'}`}>{i + 1}</td>
                                <td className={`py-2 px-1 border-b ${!c.is_active ? 'text-gray-400' : 'font-bold text-green-500'} break-words`}>{c.name}</td>
                                <td className={`py-2 px-1 border-b ${!c.is_active ? 'text-gray-400' : 'font-bold text-green-500'}`}>{formatDate(c.createdon)}</td>
                                <td className={`py-2 px-1 border-b ${!c.is_active ? 'text-gray-400' : 'font-bold text-green-500'}`}>{c.parentname}</td>
                                <td className={`py-2 px-1 border-b ${!c.is_active ? 'text-gray-400' : 'font-bold text-green-500'}`}>{c.createdbyname}</td>
                                <td className="py-2 px-1 border-b">
                                    <label className="inline-flex relative items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={c.is_active}
                                            onChange={() => handleToggle(c.name, c.username, !c.is_active)}
                                        />
                                        <div className="w-11 h-6 bg-gray-300 rounded-full transition-colors duration-300 peer-checked:bg-green-500" />
                                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5" />
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <>
            <SuperAdminNavBar />
            <div className="flex flex-col lg:flex-row lg:space-x-4 p-4">
                {renderTable(allusers, "Members list")}
            </div>

            {showModal && modalData && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            {modalData.newStatus ? "Activate" : "Deactivate"} {modalData.name}?
                        </h3>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={confirmToggle}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
