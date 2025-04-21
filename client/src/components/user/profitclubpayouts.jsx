import { useEffect, useState } from "react";

export default function ProfitClubPayouts() {
  const [profitData, setProfitData] = useState([]);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem("currentuser"));

  useEffect(() => {
    const fetchProfitData = async () => {
      if (!currentUser) return;
      
      try {
        const [profitRes, userCountRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/getallprofitclubs`),
          fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/get-all-active-members`)
        ]);
        
        const profitJson = await profitRes.json();
        // const { count } = await userCountRes.json();
        
        const allUsers = await userCountRes.json();
        const activeUsers = allUsers.filter(user => user.is_active);
        const { count } = { count: activeUsers.length };
        alert(`Active user count: ${count}`);
        
        setActiveUserCount(count);

        const formatted = profitJson
          .sort((a, b) => new Date(a.releasedate) - new Date(b.releasedate))
          .map((entry) => {
            const date = new Date(entry.releasedate).toISOString().split("T")[0];
            const total = parseFloat(entry.amount);
            const pool = total * 0.10; // 10% shared
            const share = count > 0 ? pool / count : 0;

            return {
              date,
              totalAmount: total.toFixed(2),
              poolAmount: pool.toFixed(2),
              userShare: share.toFixed(2),
            };
          });

        setProfitData(formatted);
      } catch (err) {
        console.error("Error fetching profit club data:", err);
      }
    };

    fetchProfitData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Profit Club Payouts</h2>
      <div className="mb-2 text-sm text-gray-600">
        Active Members Eligible: <span className="font-semibold">{activeUserCount}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-300 table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-1 border-b">Release Date</th>
              <th className="py-2 px-1 border-b">Total Profit ($)</th>
              <th className="py-2 px-1 border-b">10% Pool ($)</th>
              <th className="py-2 px-1 border-b">Your Share ($)</th>
            </tr>
          </thead>
          <tbody>
            {profitData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No profit club data found.
                </td>
              </tr>
            ) : (
              profitData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-1 border-b">{row.date}</td>
                  <td className="py-2 px-1 border-b text-blue-700 font-semibold">${row.totalAmount}</td>
                  <td className="py-2 px-1 border-b text-purple-600">${row.poolAmount}</td>
                  <td className="py-2 px-1 border-b text-green-700 font-semibold">${row.userShare}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
