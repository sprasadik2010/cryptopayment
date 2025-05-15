import { useEffect, useState } from "react";

export default function FirstLevelClubShare({onUpdate}) {
  const [profitData, setProfitData] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentuser"));
  const sharepercentage = 10.00;
  useEffect(() => {
    const fetchProfitData = async () => {
      if (!currentUser) return;

      try {
        const [profitRes, userCountRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/getallprofitclubs`),
          fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/first-level-members`)
        ]);

        const profitJson = await profitRes.json();
        const allUsers = await userCountRes.json();
        const activeCount = allUsers.filter(user => user.is_active).length;

        const formatted = profitJson
          .sort((a, b) => new Date(a.releasedate) - new Date(b.releasedate))
          .map((entry) => {
            const date = new Date(entry.releasedate).toISOString().split("T")[0];
            const total = parseFloat(entry.amount);
            const share = activeCount > 0 ? (total * sharepercentage / 100) / activeCount : 0;

            return {
              date,
              userShare: share.toFixed(3),
            };
          });

        setProfitData(formatted);
        const totalPayout = +formatted.reduce((sum, r) => sum + parseFloat(r.userShare), 0).toFixed(3);
        onUpdate(totalPayout,"firstlevelclub");
      } catch (err) {
        console.error("Error fetching first level club data:", err);
      }
    };

    fetchProfitData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">First Level Club Payouts</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-300 table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-1 border-b">Release Date</th>
              <th className="py-2 px-1 border-b text-right">Your Share ($)</th>
            </tr>
          </thead>
          <tbody>
            {profitData.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center p-4 text-gray-500">
                  No profit club data found.
                </td>
              </tr>
            ) : (
              profitData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-1 border-b">{row.date}</td>
                  <td className="py-2 px-1 border-b text-green-700 font-semibold text-right">${row.userShare}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
