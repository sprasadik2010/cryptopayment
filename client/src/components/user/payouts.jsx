import { useEffect, useState } from "react";

export default function Payouts() {
  const [payoutData, setPayoutData] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentuser"));
  const BASE_AMOUNT = 50;

  useEffect(() => {
    const fetchChildren = async () => {
      if (!currentUser) return;

      try {
        const leftRes = await fetch(`http://192.168.1.100:8000/left-descendants/${currentUser.id}`);
        const rightRes = await fetch(`http://192.168.1.100:8000/right-descendants/${currentUser.id}`);

        const leftData = await leftRes.json();
        const rightData = await rightRes.json();

        const leftByDate = groupByDate(leftData);
        const rightByDate = groupByDate(rightData);

        const allDates = new Set([...Object.keys(leftByDate), ...Object.keys(rightByDate)]);
        const sortedDates = Array.from(allDates).sort(); // ascending

        let totalPairCount = 0;
        const results = [];

        sortedDates.forEach((date) => {
          const leftCount = leftByDate[date]?.length || 0;
          const rightCount = rightByDate[date]?.length || 0;
          const pairs = Math.min(leftCount, rightCount);
          // const points = pairs * 5;
          let payout = 0;
          // for (let i = 0; i < pairs; i++) {
            // const globalPair = totalPairCount + i;
            // if (globalPair === 0) payout += BASE_AMOUNT * 0.10;
            // else if (globalPair === 1) payout += BASE_AMOUNT * 0.05;
            // else if (globalPair === 2) payout += BASE_AMOUNT * 0.04;
            // else if (globalPair === 3) payout += BASE_AMOUNT * 0.02;
            // else if (globalPair === 4) payout += BASE_AMOUNT * 0.01;
            // else payout += BASE_AMOUNT * 0.01;
          // }

          totalPairCount += pairs;

          results.push({ date, leftCount, rightCount, pairs, points, payout: payout.toFixed(2) });
        });
        

        results.reverse(); // newest first
        setPayoutData(results);
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
      <h2 className="text-xl font-bold mb-4">Daily Payouts</h2>
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Left</th>
            <th className="border px-4 py-2">Right</th>
            <th className="border px-4 py-2">Pairs</th>
            <th className="border px-4 py-2">Points</th>
            <th className="border px-4 py-2">Payout (₹)</th>
          </tr>
        </thead>
        <tbody>
          {payoutData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{row.date}</td>
              <td className="border px-4 py-2">{row.leftCount}</td>
              <td className="border px-4 py-2">{row.rightCount}</td>
              <td className="border px-4 py-2">{row.pairs}</td>
              <td className="border px-4 py-2 text-green-600">{row.points}</td>
              <td className="border px-4 py-2 text-blue-600 font-semibold">₹{row.payout}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
