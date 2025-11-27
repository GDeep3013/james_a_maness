import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { serviceReminderService } from '../../services/serviceReminderService';
import Badge from '../ui/badge/Badge';
import { workOrderService } from '../../services/workOrderService';

interface ServiceReminder {
    id: number;
    vehicle_id?: number;
    vehicle?: {
        id?: number;
        vehicle_name?: string;
    };
    service_task_id?: number;
    service_task?: {
        id?: number;
        name?: string;
    };
    time_interval_value?: string;
    time_interval_unit?: string;
    primary_meter_interval_value?: string;
    primary_meter_interval_unit?: string;
    next_due_date?: string;
    next_due_meter?: string;
    status?: string;
    created_at?: string;
}

export default function ReminderList() {
    const [serviceReminders, setServiceReminders] = useState<ServiceReminder[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const getDashboardReminders = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await workOrderService.getAllReminder();
            const data = response.data;

            console.log(data);
            if (data.status && data.service_reminders) {
                setServiceReminders(data.service_reminders || []);
            } else {
                setError("Failed to load reminders");
                setServiceReminders([]);
            }
        } catch (err) {
            setError("An error occurred while loading reminders");
            setServiceReminders([]);
            console.error("Error fetching reminders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDashboardReminders();
    }, []);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const calculatePriority = (dueDateString?: string): string => {
        if (!dueDateString) return 'low';

        const dueDate = new Date(dueDateString);
        const today = new Date();
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'high'; // Overdue
        if (diffDays <= 7) return 'high'; // Due within a week
        if (diffDays <= 30) return 'medium'; // Due within a month
        return 'low'; // Due later
    };

    const getPriorityClasses = (priority: string) => {
        switch (priority) {
            case 'high':
                return "bg-red-500 text-white";
            case 'medium':
                return "bg-gray-700 text-white";
            case 'low':
                return "bg-gray-300 text-gray-800";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };
    const getStatusClasses = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return "bg-green-100 text-green-800 border border-green-200";
            case 'completed':
                return "bg-blue-100 text-blue-800 border border-blue-200";
            case 'pending':
                return "bg-yellow-100 text-yellow-800 border border-yellow-200";
            case 'overdue':
                return "bg-red-100 text-red-800 border border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-200";
        }
    };

    const handleNewReminder = () => {
        navigate("/service-reminders/create");
    };

    const handleReminderClick = (id: number) => {
        navigate(`/service-reminders/${id}`);
    };
    const BellIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
    );

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 min-h-[140px] h-full">
            <header className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-[15px] md:text-xl font-semibold text-gray-800">
                    Upcoming Reminders
                </h2>
                <button
                    onClick={handleNewReminder}
                    className="flex items-center space-x-1 px-1 md:px-4 py-2 text-black font-medium rounded-lg hover:bg-gray-50 transition duration-150 border border-gray-300 text-sm md:text-base"
                >
                    <span className="text-xl">+</span>
                    <span>Add Reminder</span>
                </button>
            </header>
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        <p className="mt-2 text-sm text-gray-600">Loading reminders...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                </div>
            ) : serviceReminders.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <p className="text-gray-600">No upcoming reminders found</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {serviceReminders.map((reminder) => {
                        const priority = calculatePriority(reminder.next_due_date);

                        return (
                            <div
                                key={reminder.id}
                                onClick={() => handleReminderClick(reminder.id)}
                                className="bg-gray-50 p-4 rounded-xl flex items-center justify-between transition duration-150 hover:shadow-md cursor-pointer"
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="pt-1">
                                        <BellIcon />
                                    </div>
                                    <div>
                                        <p className="text-base font-normal text-gray-900">
                                            {reminder.service_task?.name || 'Service Task'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {reminder.vehicle?.vehicle_name || 'N/A'}
                                        </p>
                                        {/* Status Badge */}
                                        {/* {reminder.status && (
                                            <Badge
                                                className={`inline-block mt-1 text-xs font-medium capitalize px-2 py-0.5 rounded ${getStatusClasses(reminder.status)}`}
                                            >
                                                {reminder.status}
                                            </Badge>
                                        )} */}
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end space-y-1">
                                    <span
                                        className={`text-xs font-normal capitalize px-2 py-0.5 rounded-full ${getStatusClasses(reminder.status)}`}
                                    >
                                        {reminder.status}
                                    </span>
                                    <p className="text-sm text-gray-700">
                                        {formatDate(reminder.next_due_date)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
