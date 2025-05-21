import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/public/navbar";
import Loading from "../../components/user/common/loading";

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
    createdby: 0,
    parentid: null,
  });

  const [showPolicy, setShowPolicy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (encodedData) {
      try {
        const decodedString = atob(encodedData);
        const [referralCode, position, parentid] = decodedString.split("|");

        if (!referralCode || !position || !parentid) {
          return navigate("/");
        }

        setFormData((prev) => ({
          ...prev,
          referralCode,
          position: position === "Right" ? "Right" : "Left",
          createdby: parseInt(parentid),
          parentid: parseInt(parentid),
        }));
      } catch (error) {
        navigate("/");
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
      return setError("Passwords do not match!");
    }

    setError("");
    setLoading(true);

    try {
      const side = formData.position === "Right" ? "rightmost" : "leftmost";
      const parentId = formData.parentid;

      const res = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/${side}/${parentId}`);
      const realparent = await res.json();

      if (!realparent || !realparent.id) {
        throw new Error("Invalid parent ID. Signup failed.");
      }

      const requestBody = {
        membername: formData.membername,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        parentid: realparent.id,
        side: formData.position === "Right" ? 1 : 0,
        createdby: formData.createdby,
        parentname: "",
        createdbyname: ""
      };

      const registerRes = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!registerRes.ok) {
        const err = await registerRes.json();
        throw new Error(err.detail || "Signup failed. Try again.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center pt-2 bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-blue-600">Sign Up</h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <input
              type="text"
              name="membername"
              placeholder="Full Name"
              value={formData.membername}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />

            {/* Username */}
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />

            {/* Confirm Password */}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />

            {/* Referral Code (Readonly) */}
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              readOnly
              className="w-full px-4 py-2 bg-gray-200 border rounded-lg cursor-not-allowed"
            />

            {/* Position (Readonly) */}
            <div className="w-full px-4 py-2 bg-gray-100 border rounded-lg text-gray-600">
              Position: {formData.position}
            </div>

            {/* Nationality */}
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
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

            {/* Privacy Policy */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="agreeToPolicy"
                checked={formData.agreeToPolicy}
                onChange={handleChange}
                className="w-4 h-4 mr-2"
                required
              />
              <label className="text-sm">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowPolicy(true)}
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`w-full py-2 text-white font-bold rounded-lg ${
                formData.agreeToPolicy ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-400"
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

      {loading && <Loading />}

      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm text-center shadow-lg">
            <h3 className="text-lg font-semibold text-green-600 mb-2">Registration Successful!</h3>
            <p className="text-gray-700">You can now log in to your account.</p>
            <button
              onClick={() => {
                setSuccess(false);
                navigate("/login");
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}
