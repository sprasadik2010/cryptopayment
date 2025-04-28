import { useEffect, useState } from "react";

export default function useTwentyFiveClubTotal() {
  const [totalPayout, setTotalPayout] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem("currentuser"));
  const sharePercentage = 5.00;

  useEffect(() => {
    const fetchProfitData = async () => {
      if (!currentUser) return;

      try {
        const profitRes = await fetch(
          `${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/getallprofitclubs`
        );
        const profitJson = await profitRes.json();

        const userRes = await fetch(
          `${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/get-all-active-members`
        );
        const allUsers = await userRes.json();

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

        let total = 0;

        profitJson.forEach((entry) => {
          const releaseAmount = parseFloat(entry.amount);
          const totalEligible = eligibleUsers.length;
          const userShare = (isUserEligible && totalEligible > 0)
            ? (releaseAmount * sharePercentage / 100) / totalEligible
            : 0;

          total += userShare;
        });

        setTotalPayout(+total.toFixed(3));
      } catch (err) {
        console.error("Error fetching 25+ direct referral club payout:", err);
      }
    };

    fetchProfitData();
  }, []);

  return totalPayout;
}
