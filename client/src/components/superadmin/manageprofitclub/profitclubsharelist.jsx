export default function ProfitClubShareList({ AllProfitClubShares }) {
  const formatDate = (isoDateStr) => {
    const date = new Date(isoDateStr);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][
      (day % 10 > 3 || ~~((day % 100) / 10) === 1) ? 0 : day % 10
    ];
    return `${day}${suffix} ${date.toLocaleString('en-US', { month: 'short', year: 'numeric' })}`;
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Profit Club Shares</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-300 table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-1 border-b">#</th>
              <th className="py-2 px-1 border-b">Release Date</th>
              <th className="py-2 px-1 border-b text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {AllProfitClubShares.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No profit club shares found.
                </td>
              </tr>
            ) : (
              AllProfitClubShares.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-1 border-b">{index + 1}</td>
                  <td className="py-2 px-1 border-b">{formatDate(row.releasedate)}</td>
                  <td className="py-2 px-1 border-b text-right">${row.amount.toFixed(3)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
