import { useEffect, useState } from "react";

export default function TwentyFiveClubShare({onUpdate}) {
  const [profitData, setProfitData] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentuser"));
  const sharePercentage = 5.00;

  useEffect(() => {
    const fetchProfitData = async () => {
      if (!currentUser) return;

      try {
        // Fetch all profit club data
        const profitRes = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/getallprofitclubs`);
        const profitJson = await profitRes.json();

        // Fetch all users
        const userRes = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/get-all-active-members`);
        const allUsers = await userRes.json();

        // Find users who referred at least 25 active users
        const referralCounts = {};

        allUsers.forEach(user => {
          if (user.is_active && user.createdby) {
            referralCounts[user.createdby] = (referralCounts[user.createdby] || 0) + 1;
          }
        });

        const eligibleUsers = Object.entries(referralCounts)
          .filter(([_, count]) => count >= 25)
          .map(([userId]) => userId);

        const isUserEligible = eligibleUsers.includes(currentUser.id.toString());

        const formatted = profitJson
          .sort((a, b) => new Date(a.releasedate) - new Date(b.releasedate))
          .map((entry) => {
            const date = new Date(entry.releasedate).toISOString().split("T")[0];
            const total = parseFloat(entry.amount);
            const totalEligible = eligibleUsers.length;
            const share = (isUserEligible && totalEligible > 0)
              ? (total * sharePercentage / 100) / totalEligible
              : 0;

            return {
              date,
              userShare: share.toFixed(3),
            };
          });

        setProfitData(formatted);
        const totalPayout = +formatted.reduce((sum, r) => sum + parseFloat(r.userShare), 0).toFixed(3);
        onUpdate(totalPayout,"twentyfiveclub");
      } catch (err) {
        console.error("Error fetching direct referral club data:", err);
      }
    };

    fetchProfitData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">25+ Direct Referral Club Payouts</h2>
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
                  No eligible data found.
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
