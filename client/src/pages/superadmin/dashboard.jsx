import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminNavBar from "../../components/superadmin/common/superadminnavbar";
import { EyeIcon } from '@heroicons/react/24/outline';

export default function DashBoard(){

    const navigate = useNavigate();
    const [allusers, setAllUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [paymentProofImgId, setPaymentProofImgId] = useState(null);

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

    const renderTable = (children, title) => (
        <div className="w-full px-2 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
            <div className="w-full">
                <table className="w-full text-sm text-left border border-gray-300 table-fixed">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-1 border-b break-words">#</th>
                            <th className="py-2 px-1 border-b break-words">Name</th>
                            <th className="py-2 px-1 border-b break-words">Amount Paid</th>
                            <th className="py-2 px-1 border-b break-words">Payment date</th>
                            <th className="py-2 px-1 border-b break-words">Screenshot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {children.map((c, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className={`py-2 px-1 border-b ${!c.is_active ? 'text-gray-400' : 'font-bold text-green-500'}`}>{i + 1}</td>
                                <td className={`py-2 px-1 border-b ${!c.is_active ? 'text-gray-400' : 'font-bold text-green-500'} break-words`}>{c.name}</td>
                                <td className={`py-2 px-1 border-b ${!c.is_active ? 'text-gray-400' : 'font-bold text-green-500'}`}>{c.paidamount}</td>
                                <td className={`py-2 px-1 border-b ${!c.is_active ? 'text-gray-400' : 'font-bold text-green-500'}`}>{formatDate(c.paymentdate)}</td>
                                <td className={`py-2 px-1 border-b ${!c.is_active ? 'text-gray-400' : 'font-bold text-green-500'}`}>
                                    <button 
                                    className="flex items-center text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => {
                                    setPaymentProofImgId(c.paymentproof);
                                    handleShowScreenshot();
                                    }}                                   
                                    >
                                        <EyeIcon className="w-5 h-5 mr-2" />
                                    </button>                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

  const handleShowScreenshot = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

    return (
        <>
            <SuperAdminNavBar />
            <div className="flex flex-col lg:flex-row lg:space-x-4 p-4">
                {renderTable(allusers.filter(u => u.paid), "Payment details")}
            </div>

            {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-4 max-w-lg w-full relative">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <iframe
              src={`https://drive.google.com/file/d/${paymentProofImgId}/preview`}
              width="100%"
              height="400"
              frameBorder="0"
              scrolling="no"
              allow="autoplay"
              title="Screenshot Preview"
            />
          </div>
        </div>
      )}
        </>
    );
}