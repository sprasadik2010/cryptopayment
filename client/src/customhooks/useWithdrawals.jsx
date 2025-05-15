import { useState, useEffect } from "react";

export default function useWithdrawals(currentUserId) {
  const [withdrawals, setWithdrawals] = useState([]);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      if (!currentUserId) return;

      try {
        const result = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/getwithdrawals/${currentUserId}`);
        const data = await result.json();

        setWithdrawals(data);
        const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
        setTotalWithdrawals(totalAmount);
      } catch (err) {
        console.log("The Error is: ", err);
        console.error("Error fetching withdrawal data:", err);
      }
    };

    fetchWithdrawals();
  }, [currentUserId]);

  return { withdrawals, totalWithdrawals };
}
