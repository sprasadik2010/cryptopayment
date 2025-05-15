import { useEffect, useState } from "react";

export default function ReferralPayouts({onUpdate}) {
  const [referralData, setReferralData] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentuser"));
  const BASE_AMOUNT = 50;

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!currentUser) return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/children/${currentUser.username}`
        );
        const allUsers = await res.json();

        // Filter users referred by current user and active
        const referred = allUsers.filter(
          (user) => user.createdby === currentUser.id && user.is_active
        );

        // Group by date
        const grouped = referred.reduce((acc, user) => {
          const date = new Date(user.createdon).toISOString().split("T")[0];
          acc[date] = acc[date] || [];
          acc[date].push(user);
          return acc;
        }, {});

        const sortedDates = Object.keys(grouped).sort();

        const results = sortedDates.map((date) => {
          const count = grouped[date].length;
          const payout = count * BASE_AMOUNT * 0.1;
          return {
            date,
            count,
            payout: payout.toFixed(3),
          };
        });

        setReferralData(results);
        const totalPayout = +results.reduce((sum, r) => sum + parseFloat(r.payout), 0).toFixed(3);
        onUpdate(totalPayout,"referral");
      } catch (err) {
        console.error("Error fetching referral data:", err);
      }
    };

    fetchReferrals();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Referral Payouts</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-300 table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-1 border-b">Date</th>
              <th className="py-2 px-1 border-b">Referred Users</th>
              <th className="py-2 px-1 border-b text-right">Payout ($)</th>
            </tr>
          </thead>
          <tbody>
            {referralData.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No referral data found.
                </td>
              </tr>
            ) : (
              referralData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-1 border-b">{row.date}</td>
                  <td className="py-2 px-1 border-b">{row.count}</td>
                  <td className="py-2 px-1 border-b text-green-600 font-semibold text-right">${row.payout}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
