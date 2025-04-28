import { useEffect, useState } from "react";

export default function useFourthLevelClubTotal() {
  const [totalPayout, setTotalPayout] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem("currentuser"));
  const sharepercentage = 2.0;

  useEffect(() => {
    const fetchTotal = async () => {
      if (!currentUser) return;

      try {
        const [profitRes, userCountRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/getallprofitclubs`),
          fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/fourth-level-members`)
        ]);

        const profitJson = await profitRes.json();
        const allUsers = await userCountRes.json();
        const activeCount = allUsers.filter(user => user.is_active).length;

        const formatted = profitJson
          .sort((a, b) => new Date(a.releasedate) - new Date(b.releasedate))
          .map((entry) => {
            const total = parseFloat(entry.amount);
            const share = activeCount > 0 ? (total * sharepercentage / 100) / activeCount : 0;
            return share;
          });

        const sum = +formatted.reduce((sum, share) => sum + share, 0).toFixed(3);
        setTotalPayout(sum);
      } catch (err) {
        console.error("Error fetching fourth level club total:", err);
      }
    };

    fetchTotal();
  }, []);

  return totalPayout;
}
