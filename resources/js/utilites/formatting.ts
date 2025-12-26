export const uppercase = (text: string | null | undefined): string => {
    if (!text) return '';
    return text.toUpperCase();
};

export const capitalize = (text: string | null | undefined): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text: string | null | undefined): string => {
    if (!text) return '';
    return text
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export const capitalizeFirst = (text: string | null | undefined): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatCurrency = (
    value: string | number | null | undefined,
    currency: string = 'USD',
    locale: string = 'en-US'
): string => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return 'N/A';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numValue);
};

export const formatNumber = (
    value: string | number | null | undefined,
    locale: string = 'en-US',
    options?: Intl.NumberFormatOptions
): string => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return String(value);
    return new Intl.NumberFormat(locale, options).format(numValue);
};

export const formatMileage = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return String(value);
    return new Intl.NumberFormat('en-US').format(numValue) + ' mi';
};

export const formatDate = (
    dateString: string | Date | null | undefined,
    options?: Intl.DateTimeFormatOptions
): string => {
    if (!dateString) return 'N/A';
    try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        if (isNaN(date.getTime())) return String(dateString);

        const defaultOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };

        return date.toLocaleDateString('en-US', options || defaultOptions);
    } catch {
        return String(dateString);
    }
};

export const formatDateTime = (
    dateString: string | Date | null | undefined,
    options?: Intl.DateTimeFormatOptions
): string => {
    if (!dateString) return 'N/A';
    try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        if (isNaN(date.getTime())) return String(dateString);

        const defaultOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };

        return date.toLocaleString('en-US', options || defaultOptions);
    } catch {
        return String(dateString);
    }
};

export const formatTime = (
    dateString: string | Date | null | undefined,
    options?: Intl.DateTimeFormatOptions
): string => {
    if (!dateString) return 'N/A';
    try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        if (isNaN(date.getTime())) return String(dateString);

        const defaultOptions: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
        };

        return date.toLocaleTimeString('en-US', options || defaultOptions);
    } catch {
        return String(dateString);
    }
};

export const getStatusBadgeColor = (
    status: string | null | undefined
): 'success' | 'warning' | 'error' | 'info' => {
    if (!status) return 'info';
    switch (status.toLowerCase()) {
        case 'available':
        case 'in progress':
        case 'open':
        case 'active':
        case 'scheduled':
            return 'success';
        case 'maintenance':
        case 'pending':
            return 'warning';
        case 'inactive':
        case 'cancelled':
        case 'deleted':
        case 'closed':
            return 'error';
        default:
            return 'info';
    }
};

export const getStatusLabel = (status: string | null | undefined): string => {
    if (!status) return 'N/A';
    const statusMap: Record<string, string> = {
        available: 'Available',
        active: 'Active',
        maintenance: 'In Maintenance',
        inactive: 'Inactive',
        assigned: 'Assigned',
        pending: 'Pending',
        cancelled: 'Cancelled',
        completed: 'Completed',
        in_progress: 'In Progress',
    };
    return statusMap[status.toLowerCase()] || capitalizeWords(status);
};

export const truncate = (text: string | null | undefined, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const formatPhoneNumber = (phone: string | null | undefined): string => {
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
};

export const formatPercentage = (
    value: string | number | null | undefined,
    decimals: number = 1
): string => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return 'N/A';
    return `${numValue.toFixed(decimals)}%`;
};

export const formatFileSize = (bytes: number | null | undefined): string => {
    if (bytes === null || bytes === undefined || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const formatVehicleIdentifier = (type: string | null | undefined, id: number): string => {
    const typePrefix = type ? type.toUpperCase().substring(0, 3) : 'VEH';
    return `${typePrefix}-${String(id).padStart(3, '0')}`;
};

export const calculateServiceStatus = (
    primaryMeter: string | number | null | undefined,
    currentMileage: string | number | null | undefined
): string => {

    if (!primaryMeter || currentMileage === null || currentMileage === undefined) {
        return 'Due';
    }

    const currentMileageNum = typeof currentMileage === 'string' ? parseFloat(currentMileage) : currentMileage;
    const intervalValueNum = typeof primaryMeter === 'string' ? parseFloat(primaryMeter) : primaryMeter as number;

    if (isNaN(currentMileageNum) || isNaN(intervalValueNum)) {
        return 'Due';
    }

    if (currentMileageNum >= (intervalValueNum-100) && currentMileageNum < (intervalValueNum + 100)) {
        return 'Due Soon';
    }

    if (currentMileageNum >= intervalValueNum+200) {
        return 'Over Due';
    }

    return 'Due';
};

export const getServiceReminderStatusBadgeColor = (
    status: string | null | undefined
): 'success' | 'warning' | 'error' | 'info' => {
    if (!status) return 'info';
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'over due' || statusLower === 'overdue') {
        return 'error';
    }
    if (statusLower === 'service due') {
        return 'warning';
    }
    if (statusLower === 'due soon') {
        return 'warning';
    }
    if (statusLower === 'due') {
        return 'success';
    }
    return 'info';
};

export const formatNextDue = (nextDueDate: string | null | undefined): string => {  
    let timeText = '';


    if (nextDueDate) {
        try {
            const dueDate = new Date(nextDueDate);
            const now = new Date();
            const diffTime = dueDate.getTime() - now.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const diffMonths = Math.floor(diffDays / 30);
            const diffYears = Math.floor(diffDays / 365);

            if (Math.abs(diffDays) < 30) {
                if (diffDays === 0) {
                    timeText = 'today';
                } else if (diffDays === 1) {
                    timeText = 'tomorrow';
                } else if (diffDays === -1) {
                    timeText = 'yesterday';
                } else if (diffDays > 0) {
                    timeText = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} from now`;
                } else {
                    timeText = `${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'day' : 'days'} ago`;
                }
            } else if (Math.abs(diffDays) < 365) {
                if (diffMonths > 0) {
                    timeText = `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} from now`;
                } else {
                    timeText = `${Math.abs(diffMonths)} ${Math.abs(diffMonths) === 1 ? 'month' : 'months'} ago`;
                }
            } else {
                if (diffYears > 0) {
                    timeText = `${diffYears} ${diffYears === 1 ? 'year' : 'years'} from now`;
                } else {
                    timeText = `${Math.abs(diffYears)} ${Math.abs(diffYears) === 1 ? 'year' : 'years'} ago`;
                }
            }
        } catch(error) {
            console.error(error);
            timeText = '';
        }
    }

    return timeText ;
};

export const getPriorityColor = (priority?: string): string => {
    switch (priority?.toLowerCase()) {
        case "urgent":
        case "critical":
            return "bg-red-500 text-white";
        case "high":
            return "bg-orange-500 text-white";
        case "medium":
            return "bg-[#DBEAFE] text-[#1447E6]";
        case "low":
            return "bg-gray-300 text-gray-800";
        default:
            return "bg-gray-200 text-gray-600";
    }
};

export const getPriorityBadgeColor = (priority?: string): 'light' | 'info' | 'high' | 'error' => {
    switch (priority) {
        case "Low":
            return "light";
        case "Medium":
            return "info";
        case "High":
            return "high";
        case "Critical":
            return "error";
        default:
            return "info";
    }
};

