import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/public/login";
import SignUp from "./pages/public/signup";
import DashBoard from "./pages/user/dashboard";
import Verify from "./pages/public/verify";
import DownLines from "./pages/user/downline";
import PayOuts from "./pages/user/payouts";
import AdminDashBoard from "./pages/superadmin/dashboard";
import Withdrawals from "./pages/user/withdrawals";
import Members from "./pages/superadmin/members";
import AllWithdrawals from "./pages/superadmin/withdrawals";
import About from "./pages/public/about";
import Services from "./pages/public/services";
import Contact from "./pages/public/contact";
import HomeNew from "./pages/public/homenew";
import ProfitClub from "./pages/superadmin/profitclub";
import PayNow from "./pages/user/paynow";

// 🔐 Private Route Component
function PrivateRoute({ children }) {
  const token = localStorage.getItem("access_token"); // Check for auth token
  return token ? children : <Navigate to="/login" />; // Redirect if no token
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeNew />} />
      <Route path="/about" element={<About/>} />
      <Route path="/services" element={<Services/>} />
      <Route path="/contact" element={<Contact/>} />
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
        path="/auth/PayNow"
        element={
          <PrivateRoute>
            <PayNow/>
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
      <Route
        path="/auth/adm/members"
        element={
          <PrivateRoute>
            <Members/>
          </PrivateRoute>
        }
      />
      <Route
        path="/auth/adm/profitclub"
        element={
          <PrivateRoute>
            <ProfitClub/>
          </PrivateRoute>
        }
      />
      <Route
        path="/auth/adm/withdrawals"
        element={
          <PrivateRoute>
            <AllWithdrawals/>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
