import { useState } from "react";

export default function CreateProfitClub({ refreshList }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setError("");
    setShowModal(true);
  };

  const confirmProfitClub = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/addprofitclub`, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          releasedate: Date.now(),
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        throw new Error("Add Profit Club share failed");
      }

      const data = await response.json();
      console.log("Profit club share response:", data);

      setAmount("");
      setError("");
      setShowModal(false);
      refreshList(); // ✅ refresh the list
    } catch (error) {
      console.error("Error submitting Profitclub:", error);
      alert("Failed to submit Profitclub. Please try again.");
      setShowModal(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Submit a Profit Club Share amount</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.001"
          placeholder="Enter amount"
          className="w-full p-2 border border-gray-300 rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit Profit Club Share
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Confirm Submit ProfitClub Share of ${parseFloat(amount).toFixed(3)}?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmProfitClub}
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
