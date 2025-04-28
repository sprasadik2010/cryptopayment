import { useEffect, useState } from "react";

export default function useBinaryTotal() {
  const [totalPayout, setTotalPayout] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem("currentuser"));
  const BASE_AMOUNT = 50;

  useEffect(() => {
    const groupByDate = (list) => {
      return list.reduce((acc, item) => {
        const date = new Date(item.createdon).toISOString().split("T")[0];
        acc[date] = acc[date] || [];
        acc[date].push(item);
        return acc;
      }, {});
    };

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
        const sortedDates = Array.from(allDates).sort();

        let carryLeft = 0;
        let carryRight = 0;
        let total = 0;

        sortedDates.forEach((date) => {
          const todayLeft = leftByDate[date]?.length || 0;
          const todayRight = rightByDate[date]?.length || 0;

          const leftTotal = todayLeft + carryLeft;
          const rightTotal = todayRight + carryRight;

          const pairs = Math.min(leftTotal, rightTotal);
          const payout = pairs * BASE_AMOUNT * 0.1;

          carryLeft = leftTotal - pairs;
          carryRight = rightTotal - pairs;

          total += payout;
        });

        setTotalPayout(+total.toFixed(3));
      } catch (err) {
        console.error("Error fetching binary payout data:", err);
      }
    };

    fetchChildren();
  }, []);

  return totalPayout;
}
