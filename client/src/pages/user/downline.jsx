import { useEffect, useState } from "react";
import UserNavBar from "../../components/user/common/usernavbar";

export default function DownLines() {
    const [leftchildren, setLeftChildren] = useState([]);
    const [rightchildren, setRightChildren] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("currentuser"));

    useEffect(() => {
        const fetchChildren = async () => {
            if (!currentUser) return;

            try {
                const leftResponse = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/left-descendants/${currentUser.id}`);
                if (!leftResponse.ok) throw new Error("Failed to fetch left children");
                setLeftChildren(await leftResponse.json());

                const rightResponse = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/right-descendants/${currentUser.id}`);
                if (!rightResponse.ok) throw new Error("Failed to fetch right children");
                setRightChildren(await rightResponse.json());
            } catch (error) {
                console.error(error);
            }
        };

        fetchChildren();
    }, []);

    const formatDate = (isoDateStr) => {
        const date = new Date(isoDateStr);
        const day = date.getDate();
        const suffix = ['th', 'st', 'nd', 'rd'][
            (day % 10 > 3 || ~~((day % 100) / 10) === 1) ? 0 : day % 10
        ];
        return `${day}${suffix} ${date.toLocaleString('en-US', { month: 'short', year: 'numeric' })}`;
    };

    const renderTable = (children, title) => (
        <div className="w-full lg:w-1/2 px-2 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
            <div className="w-full">
                <table className="w-full text-sm text-left border border-gray-300 table-fixed">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-1 border-b break-words">#</th>
                            <th className="py-2 px-1 border-b break-words">Name</th>
                            <th className="py-2 px-1 border-b break-words">Joining Date</th>
                            <th className="py-2 px-1 border-b break-words">Parent</th>
                            <th className="py-2 px-1 border-b break-words">Referred By</th>
                            <th className="py-2 px-1 border-b break-words">Is Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {children.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-4 text-gray-500">
                                No children found.
                                </td>
                            </tr>
                            ) : (
                            children.map((c, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className={`py-2 px-1 border-b ${!c.is_active ? 'text-gray-400' : 'font-bold text-blue-500'}`}>{i + 1}</td>
                                            <td className={`py-2 px-1 border-b ${!c.is_active ? 'text-gray-400' : 'font-bold text-blue-500'} break-words`}>{c.name}</td>
                                            <td className={`py-2 px-1 border-b ${!c.is_active ? 'text-gray-400' : 'font-bold text-blue-500'}`}>{formatDate(c.createdon)}</td>
                                            <td className={`py-2 px-1 border-b ${!c.is_active ? 'text-gray-400' : 'font-bold text-blue-500'}`}>{c.parentname}</td>
                                            <td className={`py-2 px-1 border-b ${!c.is_active ? 'text-gray-400' : 'font-bold text-blue-500'}`}>{c.createdbyname}</td>
                                            <td className={`py-2 px-1 border-b ${!c.is_active ? 'text-gray-400' : 'font-bold text-blue-500'}`}>{c.is_active ? 'Yes' : 'No'}</td>
                                        </tr>
                                    )))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <>
            <UserNavBar />
            <div className="flex flex-col lg:flex-row lg:space-x-4 p-4">
                {renderTable(leftchildren, "Left Children")}
                {renderTable(rightchildren, "Right Children")}
            </div>
        </>
    );
}
