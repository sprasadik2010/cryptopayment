import { useEffect, useState } from "react";

export default function MyWithdrawals({onTotalWithdrawalsChange}) {

  const currentUser = JSON.parse(localStorage.getItem("currentuser"));
  const [myWithdrawals,setMyWithdrawals] = useState([]);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      if (!currentUser) return;

      try {
        const result = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/getwithdrawals/${currentUser.id}`);

        const withdrawals = (await result.json());
        
        setMyWithdrawals(withdrawals);
        const totalAmount = withdrawals.reduce((sum, item) => sum + item.amount, 0);
        onTotalWithdrawalsChange(totalAmount)
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchWithdrawals();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Withdrawals</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-300 table-fixed">
          <thead className="bg-gray-100">
            <tr>
            <th className="py-2 px-1 border-b break-words">#</th>
            <th className="py-2 px-1 border-b break-words">Date</th>
            <th className="py-2 px-1 border-b break-words text-right">Amount</th>
            <th className="py-2 px-1 border-b break-words text-right">Approval Date</th>
            </tr>
          </thead>
          <tbody>
            {myWithdrawals.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No withdrawals found.
                </td>
              </tr>
            ) : (
                myWithdrawals.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-1 border-b break-words">{index + 1}</td>
                  <td className="py-2 px-1 border-b break-words">{row.date}</td>
                  <td className="py-2 px-1 border-b break-words text-right">${row.amount.toFixed(3)}</td>
                  <td className="py-2 px-1 border-b break-words text-right">
                    {row.is_approved ? 
                      <span className="text-green-500">{row.approvaldate}</span> : 
                      <span className="text-red-500">NOT APPROVED</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
