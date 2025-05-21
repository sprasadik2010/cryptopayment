import { useEffect, useState } from "react";

export default function ManageWithdrawals() {

  const currentUser = JSON.parse(localStorage.getItem("currentuser"));
  const [AllWithdrawals,setAllWithdrawals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const formatDate = (isoDateStr) => {
    const date = new Date(isoDateStr);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][
        (day % 10 > 3 || ~~((day % 100) / 10) === 1) ? 0 : day % 10
    ];
    return `${day}${suffix} ${date.toLocaleString('en-US', { month: 'short', year: 'numeric' })}`;
};

  useEffect(() => {
    const fetchWithdrawals = async () => {
      if (!currentUser) return;

      try {
        const result = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/getallwithdrawals`);

        const withdrawals = (await result.json());
        
        setAllWithdrawals(withdrawals);
        // const totalAmount = withdrawals.reduce((sum, item) => sum + item.amount, 0);
        // onTotalWithdrawalsChange(totalAmount)
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchWithdrawals();
  }, []);

  const handleToggle = (id, newStatus) => {
    setModalData({ id, newStatus });
    setShowModal(true);
};

const confirmToggle = async () => {
    if (!modalData) return;
    const { id, newStatus } = modalData;
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/approve-reject-withdrawal/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ is_approved: newStatus })
        });

        if (!response.ok) throw new Error("Failed to update status");

        setAllWithdrawals((prev) =>
            prev.map((w) => (w.id === id ? { ...w, is_approved: newStatus } : w))
        );
        setShowModal(false);
    } catch (err) {
        console.error("Error updating approval status", err);
    }
};

const renderwithdrawals = (children, title) => (
<div className="p-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-300 table-fixed">
          <thead className="bg-gray-100">
            <tr>
            <th className="py-2 px-1 border-b break-words">#</th>
            <th className="py-2 px-1 border-b break-words">Date</th>
            <th className="py-2 px-1 border-b break-words">UserName</th>
            <th className="py-2 px-1 border-b break-words">Name</th>
            <th className="py-2 px-1 border-b break-words text-right">Amount</th>
            <th className="py-2 px-1 border-b break-words text-right">Approval Date</th>
            <th className="py-2 px-1 border-b break-words text-right">Is Approved?</th>
            </tr>
          </thead>
          <tbody>
            {children.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No withdrawals found.
                </td>
              </tr>
            ) : (
              children.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-1 border-b break-words">{index + 1}</td>
                  <td className="py-2 px-1 border-b break-words">{formatDate(row.date)}</td>
                  <td className="py-2 px-1 border-b break-words">{row.username}</td>
                  <td className="py-2 px-1 border-b break-words">{row.name}</td>
                  <td className="py-2 px-1 border-b break-words text-right">${row.amount.toFixed(3)}</td>
                  <td className="py-2 px-1 border-b break-words text-right">
                    {row.is_approved ? 
                      <span className="text-green-500">{formatDate(row.approvaldate)}</span> : 
                      <span className="text-red-500">NOT APPROVED</span>}
                  </td>
                  <td className="py-2 px-1 border-b break-words text-right">
                      <label className="inline-flex relative items-center cursor-pointer">
                          <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={row.is_approved}
                              onChange={() => handleToggle(row.id, !row.is_approved)}
                          />
                          <div className="w-11 h-6 bg-gray-300 rounded-full transition-colors duration-300 peer-checked:bg-green-500" />
                          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5" />
                      </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
)


  return (
    <>
      {renderwithdrawals(AllWithdrawals,"Withdrawals")}
      {showModal && modalData && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            {modalData.newStatus ? "Approve" : "Reject"} {modalData.amount}?
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
