import { Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/user/common/loading";
import NavBar from "../../components/public/navbar";

export default function SignupPage() {
  const navigate = useNavigate();
  const { encodedData } = useParams();

  const [formData, setFormData] = useState({
    membername: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    nationality: "",
    agreeToPolicy: false,
    position: "Left",
    createdby: 0
  });

  const [showPolicy, setShowPolicy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [Success, setSuccess] = useState(false);
  // Decode referralCode and position from Base64
  useEffect(() => {
    if (encodedData) {
      try {
        const decodedString = atob(encodedData); // Decode Base64
        const [referralCode, position, parentid] = decodedString.split("|");

        if (!referralCode || !position || !parentid) {
          navigate("/"); // Redirect to home if invalid data
        }

        setFormData((prev) => ({
          ...prev,
          referralCode,
          position: position === "Right" ? "Right" : "Left",
          parentid: parentid,
        }));
      } catch (error) {
        navigate("/"); // Redirect if decoding fails
      }
    }
  }, [encodedData, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");
    setLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/${formData.position === "Right" ? "rightmost" : "leftmost"}/${parseInt(formData.parentid)}`
    );
    const realparent = await response.json();

    const requestBody = {
      membername: formData.membername,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      parentid: realparent.id,
      side: formData.position === "Right" ? 1 : 0,
      createdby: parseInt(formData.parentid) || 0,
      parentname:"",
      createdbyname:"",
      phone:formData.phone
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Signup failed! Please try again.");
      }

      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <NavBar/>
    <div className="flex items-center justify-center pt-2 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600">Sign Up</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              name="membername"
              value={formData.membername}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* UserName */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>


          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Referral Code (Non-editable) */}
          <div className="opacity-50">
            <label className="block text-sm font-medium text-gray-600">Referral Code</label>
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              readOnly
              className="w-full px-4 py-2 mt-1 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Position (Non-editable switch) */}
          <div className="opacity-50">
            <label className="block text-sm font-medium text-gray-600">Position</label>
            <div className="flex items-center bg-gray-200 rounded-lg p-1">
              <div
                className={`w-1/2 text-center py-1 rounded-lg transition-colors duration-200 ${
                  formData.position === "Left" ? "bg-blue-600 text-white" : "bg-transparent"
                }`}
              >
                Left
              </div>
              <div
                className={`w-1/2 text-center py-1 rounded-lg transition-colors duration-200 ${
                  formData.position === "Right" ? "bg-blue-600 text-white" : "bg-transparent"
                }`}
              >
                Right
              </div>
            </div>
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Nationality</label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="">Select Nationality</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Privacy Policy Agreement */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="agreeToPolicy"
              checked={formData.agreeToPolicy}
              onChange={handleChange}
              className="w-5 h-5 mr-2"
              required
            />
            <label className="text-sm text-gray-600">
              I agree to the{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setShowPolicy(true)}
              >
                Privacy Policy
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full px-4 py-2 font-semibold text-white rounded-lg ${
              formData.agreeToPolicy
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!formData.agreeToPolicy}
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
    {loading && (
      <Loading/>
      
    )}
    {Success && (
                <div
                    id="popup-modal"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full pt-2 bg-black bg-opacity-50"
                >
                    <div className="relative p-4 w-full max-w-md">
                        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                            <button
                                type="button"
                                onClick={() => setSuccess(false)}
                                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-4 md:p-5 text-center">
                                <svg
                                    className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                We've sent a verification link to your email. Please check your inbox and click the link to verify your account.
                                </h3>
                                <button
                                    onClick={() => 
                                      {setSuccess(false);
                                      navigate("/login");}
                                    }
                                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                    OK !
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    </>
  );
}