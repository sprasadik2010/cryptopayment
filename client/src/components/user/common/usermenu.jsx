import { NavLink } from "react-router-dom";

export default function UserMenu() {
  const linkClasses = ({ isActive }) =>
    isActive
      ? "bg-blue-600 text-white px-4 py-2 rounded"
      : "hover:text-blue-500 px-4 py-2 text-gray-700";

  return (
    <ul className="hidden md:flex space-x-6">
      <li>
        <NavLink to="/auth/dashboard" className={linkClasses}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/auth/downlines" className={linkClasses}>
          Downlines
        </NavLink>
      </li>
      <li>
        <NavLink to="/auth/payouts" className={linkClasses}>
          Payouts
        </NavLink>
      </li>
      <li>
        <NavLink to="/auth/withdrawals" className={linkClasses}>
          Withdrawals
        </NavLink>
      </li>
      <li>
        <NavLink to="/auth/PayNow" className={linkClasses}>
          Pay Now
        </NavLink>
      </li>
    </ul>
  );
}
