import { useEffect, useState } from "react";

export default function useProfitClubTotal() {
  const [totalPayout, setTotalPayout] = useState(0);
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
        const allUsers = await userCountRes.json();
        const activeCount = allUsers.filter(user => user.is_active).length;

        let total = 0;

        profitJson.forEach((entry) => {
          const releaseAmount = parseFloat(entry.amount);
          const userShare = activeCount > 0 ? (releaseAmount * 0.10) / activeCount : 0;
          total += userShare;
        });

        setTotalPayout(+total.toFixed(3));
      } catch (err) {
        console.error("Error fetching profit club data:", err);
      }
    };

    fetchProfitData();
  }, []);

  return totalPayout;
}
