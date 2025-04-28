import { useEffect, useState } from "react";

export default function useReferralTotal() {
  const [totalPayout, setTotalPayout] = useState(0);
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

        const referred = allUsers.filter(
          (user) => user.createdby === currentUser.id && user.is_active
        );

        const grouped = referred.reduce((acc, user) => {
          const date = new Date(user.createdon).toISOString().split("T")[0];
          acc[date] = acc[date] || [];
          acc[date].push(user);
          return acc;
        }, {});

        const sortedDates = Object.keys(grouped).sort();

        let total = 0;
        sortedDates.forEach((date) => {
          const count = grouped[date].length;
          const payout = count * BASE_AMOUNT * 0.1;
          total += payout;
        });

        setTotalPayout(+total.toFixed(3));
      } catch (err) {
        console.error("Error fetching referral payout data:", err);
      }
    };

    fetchReferrals();
  }, []);

  return totalPayout;
}
