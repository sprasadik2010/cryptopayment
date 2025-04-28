import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/public/home";
import Login from "./pages/public/login";
import SignUp from "./pages/public/signup";
import DashBoard from "./pages/user/dashboard";
import Verify from "./pages/public/verify";
import DownLines from "./pages/user/downline";
import PayOuts from "./pages/user/payouts";
import AdminDashBoard from "./pages/superadmin/dashboard";
import Homepage from "./pages/public/Homepage";
import Withdrawals from "./pages/user/withdrawals";

// 🔐 Private Route Component
function PrivateRoute({ children }) {
  const token = localStorage.getItem("access_token"); // Check for auth token
  return token ? children : <Navigate to="/login" />; // Redirect if no token
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/" element={<Homepage />} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup/:encodedData?" element={<SignUp />} />
      <Route path="/verify/:encodedData?" element={<Verify/>} />
      <Route
        path="/auth/dashboard"
        element={
          <PrivateRoute>
            <DashBoard />
          </PrivateRoute>
        }
      />
      <Route
        path="/auth/downlines"
        element={
          <PrivateRoute>
            <DownLines />
          </PrivateRoute>
        }
      />
      <Route
        path="/auth/payouts"
        element={
          <PrivateRoute>
            <PayOuts/>
          </PrivateRoute>
        }
      />
      <Route
        path="/auth/withdrawals"
        element={
          <PrivateRoute>
            <Withdrawals/>
          </PrivateRoute>
        }
      />
      <Route
        path="/auth/adm/dashboard"
        element={
          <PrivateRoute>
            <AdminDashBoard/>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
