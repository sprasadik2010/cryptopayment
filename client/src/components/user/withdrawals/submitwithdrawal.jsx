import { useState } from "react";

import useTotalPayout from "../../../customhooks/useTotalPayout"
import useWithdrawals from "../../../customhooks/useWithdrawals";

export default function SubmitWithdrawal() {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentuser"));
  const totalPayout = useTotalPayout();
  const { withdrawals, totalWithdrawals } = useWithdrawals(currentUser?.id);
  const maxWithdrawal = totalPayout - totalWithdrawals;
  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (numericAmount > maxWithdrawal) {
      setError(`Maximum withdrawal amount is $${maxWithdrawal.toFixed(3)}.`);
      return;
    }

    setError("");
    setShowModal(true); // Show confirmation modal
  };

  const confirmWithdrawal = async () => {
    try {
      const token = localStorage.getItem("access_token"); 
      const response = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/addwithdrawal`, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add Authorization header if needed
        },
        body: JSON.stringify({
          userid: currentUser.id,
          amount: amount,
        }),
      });

      if (!response.ok) {
        throw new Error("Withdrawal failed");
      }

      const data = await response.json();
      console.log("Withdrawal response:", data);
      // alert(`Withdrawal submitted successfully!`);

      // Reset form
      setAmount("");
      setError("");
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting withdrawal:", error);
      alert("Failed to submit withdrawal. Please try again.");
      setShowModal(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Submit a Withdrawal</h2>
      <div className="overflow-x-auto">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount ($) Available: ${maxWithdrawal.toFixed(3)}
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.001"
              placeholder="Enter amount"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Submit Withdrawal
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Confirm withdrawal of ${parseFloat(amount).toFixed(3)}?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmWithdrawal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
