import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Verify() {
  const navigate = useNavigate();
  const [Success, setSuccess] = useState(false);
  const [Error, setError] = useState(null);
  const [Message, setMessage] = useState('');
  const { encodedData } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {        
        const response = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/verify/${encodedData}`, {
          method: "GET",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Email Verification failed! Please try again.");
        }

        setSuccess(true);
        setMessage(data.message || "Email Verified Successfully");
      } catch (error) {
        setError(error.message);
      }
    };

    verifyEmail();
  }, [encodedData]);

  return (
    <div className="flex items-center justify-center pt-2">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {Success ? Message : "Verifying Your Email..."}
        </h2>
        {Error && <p className="text-center text-red-500">{Error}</p>}
        <div className="mt-4">
          <div className="text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-white bg-green-500 hover:bg-green-700 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
            >
              Go to Login Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
