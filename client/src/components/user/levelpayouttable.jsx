// components/LevelPayoutTable.jsx
import React from "react";

export default function LevelPayoutTable({ levelName, percentage, users, totalAmount }) {
  if (!users || users.length === 0) return null;

  const pool = totalAmount * percentage;
  const userShare = users.length > 0 ? pool / users.length : 0;

  return (
    <div className="p-4 mb-4 border rounded shadow">
      <h3 className="text-lg font-semibold mb-2">{levelName} Payouts</h3>
      <div className="mb-2 text-sm text-gray-600">
        Active Members in {levelName}: <span className="font-semibold">{users.length}</span>
      </div>
      <table className="w-full text-sm text-left border border-gray-300 table-fixed">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-1 border-b">Username</th>
            <th className="py-2 px-1 border-b">Your Share ($)</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-2 px-1 border-b">{user.username}</td>
              <td className="py-2 px-1 border-b text-green-700 font-semibold">
                ${userShare.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
