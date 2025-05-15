import { useEffect, useState } from "react";
export default function BinaryPayouts({onUpdate}) {
  const [payoutData, setPayoutData] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentuser"));
  const BASE_AMOUNT = 50;

  useEffect(() => {
    const fetchChildren = async () => {
      if (!currentUser) return;

      try {
        const leftRes = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/left-descendants/${currentUser.id}`);
        const rightRes = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/right-descendants/${currentUser.id}`);

        const leftData = (await leftRes.json()).filter(lr => lr.is_active);
        const rightData = (await rightRes.json()).filter(rr => rr.is_active);
        const leftByDate = groupByDate(leftData);
        const rightByDate = groupByDate(rightData);

        const allDates = new Set([...Object.keys(leftByDate), ...Object.keys(rightByDate)]);
        const sortedDates = Array.from(allDates).sort(); // oldest to newest

        let carryLeft = 0;
        let carryRight = 0;
        const results = [];

        sortedDates.forEach((date) => {
          const todayLeft = leftByDate[date]?.length || 0;
          const todayRight = rightByDate[date]?.length || 0;

          const leftTotal = todayLeft + carryLeft;
          const rightTotal = todayRight + carryRight;

          const pairs = Math.min(leftTotal, rightTotal);
          const payout = pairs * BASE_AMOUNT * 0.1;

          carryLeft = leftTotal - pairs;
          carryRight = rightTotal - pairs;

          results.push({
            date,
            leftCount: leftTotal,
            rightCount: rightTotal,
            leftToday: todayLeft,
            rightToday: todayRight,
            leftCarry: carryLeft,
            rightCarry: carryRight,
            pairs,
            payout: payout.toFixed(3),
          });
        });

        setPayoutData(results);
        const totalPayout = +results.reduce((sum, r) => sum + parseFloat(r.payout), 0).toFixed(3);
        onUpdate(totalPayout,"binary");
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchChildren();
  }, []);

  const groupByDate = (list) => {
    return list.reduce((acc, item) => {
      const date = new Date(item.createdon).toISOString().split("T")[0];
      acc[date] = acc[date] || [];
      acc[date].push(item);
      return acc;
    }, {});
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Binary Payouts</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-300 table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-1 border-b break-words">Date</th>
              <th className="py-2 px-1 border-b break-words">Left</th>
              <th className="py-2 px-1 border-b break-words">Right</th>
              <th className="py-2 px-1 border-b break-words">Pairs</th>
              <th className="py-2 px-1 border-b break-words text-right">Payout ($)</th>
            </tr>
          </thead>
          <tbody>
            {payoutData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No payout data found.
                </td>
              </tr>
            ) : (
              payoutData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-1 border-b break-words">{row.date}</td>
                  <td className="py-2 px-1 border-b break-words">
                    {row.leftCount}
                    {row.leftCarry > 0 && (
                      <span className="text-gray-400 text-sm ml-1">
                        ({row.leftToday}+{row.leftCount - row.leftToday})
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-1 border-b break-words">
                    {row.rightCount}
                    {row.rightCarry > 0 && (
                      <span className="text-gray-400 text-sm ml-1">
                        ({row.rightToday}+{row.rightCount - row.rightToday})
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-1 border-b break-words">{row.pairs}</td>
                  <td className="py-2 px-1 border-b break-words text-blue-600 font-semibold text-right">${row.payout}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
