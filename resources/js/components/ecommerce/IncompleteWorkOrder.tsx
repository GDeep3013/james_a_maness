export default function IncompleteWorkOrder() {
    const workOrders = [
        {
            woId: 'WO-101',
            assetId: 'TRK-002',
            description: 'Engine oil change and filter replacement',
            assignedTo: 'Mechanic A',
            dueDate: '2025-07-10',
        },
        {
            woId: 'WO-102',
            assetId: 'VAN-001',
            description: 'Brake pad replacement',
            assignedTo: 'Mechanic B',
            dueDate: '2025-07-12',
        },
        {
            woId: 'WO-103',
            assetId: 'TRK-003',
            description: 'Transmission inspection',
            assignedTo: 'Mechanic C',
            dueDate: '2025-07-14',
        },
        {
            woId: 'WO-104',
            assetId: 'VAN-005',
            description: 'Replacement',
            assignedTo: 'Mechanic B',
            dueDate: '2025-07-15',
        }
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 min-h-[140px]">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800">Incomplete Work Orders</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 shadow-md">
                    {/* Wrench Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                    <span className="text-sm font-medium">New Work Order</span>
                </button>
            </div>

            {/* Work Orders List */}
            <div className="space-y-6">
                {workOrders.filter((order) => order).map((order, index, filteredArray) => (
                    <div
                        key={index}
                        className={`flex justify-between items-start ${index < filteredArray.length - 1 ? 'border-b pb-6' : ''}`}
                    >
                        {/* Left Content (IDs, Description, Assignment) */}
                        <div className="flex-grow">
                            <div className="flex items-center space-x-3 mb-1">
                                <p className="text-lg font-bold text-indigo-600">{order.woId}</p>
                                <span className="text-gray-500 font-medium">{order.assetId}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-1">{order.description}</p>
                            <p className="text-xs text-gray-500">
                                Assigned to: <span className="font-medium">{order.assignedTo}</span>
                            </p>
                        </div>

                        {/* Right Content (Due Date, Status Button) */}
                        <div className="flex flex-col items-end space-y-2">
                            <p className="text-sm text-gray-500">
                                Due: <span className="font-semibold">{order.dueDate}</span>
                            </p>
                            <button className="px-3 py-1 text-sm text-yellow-800 bg-yellow-100 rounded-lg font-semibold shadow-sm">
                                Pending
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
