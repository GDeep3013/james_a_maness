import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import PageMeta from "../../components/common/PageMeta";
import { contactService } from "../../services/contactService";
import { vehicleService } from "../../services/vehicleService";
import { vehicleAssignmentService } from "../../services/vehicleAssignmentService";
import Button from "../../components/ui/button/Button";
import DatePicker from "../../components/form/date-picker";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

interface AssignmentEvent extends EventInput {
    extendedProps: {
        calendar: string;
        vehicle_id?: number | null;
        contact_id?: number | null;
    };
}

interface Contact {
    id: number;
    first_name: string;
    last_name?: string;
}

interface Vehicle {
    id: number;
    vehicle_name: string;
    assigned_driver?: number | null;
}

const CreateAssignment: React.FC = () => {

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [selectedEvent, setSelectedEvent] = useState<AssignmentEvent | null>(
        null
    );
    const [eventTitle, setEventTitle] = useState("");
    const [eventStartDate, setEventStartDate] = useState(getTodayDate());
    const [eventEndDate, setEventEndDate] = useState("");
    const [eventStartTime, setEventStartTime] = useState("");
    const [eventEndTime, setEventEndTime] = useState("");
    const [eventLevel, setEventLevel] = useState("");
    const [vehicleId, setVehicleId] = useState("");
    const [contactId, setContactId] = useState("");
    const [notes, setNotes] = useState("");
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
    const [isLoadingContacts, setIsLoadingContacts] = useState(false);
    const [events, setEvents] = useState<AssignmentEvent[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const [currentMonth, setCurrentMonth] = useState<number | null>(null);
    const [currentYear, setCurrentYear] = useState<number | null>(null);
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    const calendarRef = useRef<FullCalendar>(null);
    const { isOpen, openModal, closeModal } = useModal();
    const [allEventsSorted, setAllEventsSorted] = useState<AssignmentEvent[]>([]);

    const calendarsEvents = {
        Danger: "danger",
        Success: "success",
        Primary: "primary",
        Warning: "warning",
    };

    const fetchVehicles = async () => {
        setIsLoadingVehicles(true);
        try {
            const response = await vehicleService.getAll({ page: 1 });
            if (response.data?.status && response.data?.vehical?.data) {
                setVehicles(response.data.vehical.data);
            }
        } catch {
            // Error handling is silent
        } finally {
            setIsLoadingVehicles(false);
        }
    };

    const fetchContacts = async () => {
        setIsLoadingContacts(true);
        try {
            const response = await contactService.getAll({ page: 1 });
            if (response.data?.status && response.data?.contact?.data) {
                setContacts(response.data.contact.data);
            }
        } catch {
            // Error handling is silent
        } finally {
            setIsLoadingContacts(false);
        }
    };

    const fetchEvents = async (month?: number, year?: number) => {
        try {
            const fetchMonth = month || (currentMonth ?? new Date().getMonth() + 1);
            const fetchYear = year || (currentYear ?? new Date().getFullYear());
            const response = await vehicleAssignmentService.getAll({ month: fetchMonth, year: fetchYear });
            if (response.data?.status && response.data?.vehicle_assignments) {
                const assignments = Array.isArray(response.data.vehicle_assignments)
                    ? response.data.vehicle_assignments
                    : response.data.vehicle_assignments.data || [];

                const calendarEvents: AssignmentEvent[] = assignments.map((assignment: {
                    id: number;
                    event_title: string;
                    start_date: string;
                    start_time?: string | null;
                    end_date?: string | null;
                    end_time?: string | null;
                    full_day?: boolean;
                    flag?: string | null;
                    vehicle_id?: number | null;
                    contact_id?: number | null;
                }) => {
                    const extractDateOnly = (dateString: string): string => {
                        if (!dateString) return '';
                        const datePart = dateString.split('T')[0].split(' ')[0];
                        return datePart.length === 10 ? datePart : datePart.substring(0, 10);
                    };

                    const extractTimeOnly = (timeString: string): string => {
                        if (!timeString) return '';
                        let time = timeString;
                        if (time.includes('T')) {
                            time = time.split('T')[1];
                        }
                        if (time.includes(' ')) {
                            time = time.split(' ')[0];
                        }
                        if (time.includes('Z')) {
                            time = time.split('Z')[0];
                        }
                        if (time.includes('+')) {
                            time = time.split('+')[0];
                        }
                        if (time.includes('-') && time.length > 8) {
                            time = time.split('-')[0];
                        }
                        return time.substring(0, 8);
                    };

                    const startDateOnly = extractDateOnly(assignment.start_date);
                    let startDateTime = startDateOnly;

                    if (assignment.start_time && !assignment.full_day) {
                        const timeOnly = extractTimeOnly(assignment.start_time);
                        if (timeOnly) {
                            startDateTime = `${startDateOnly}T${timeOnly}`;
                        }
                    }

                    const endDateOnly = extractDateOnly(assignment.end_date || assignment.start_date);
                    let endDateTime = endDateOnly;

                    if (assignment.end_time && !assignment.full_day) {
                        const timeOnly = extractTimeOnly(assignment.end_time);
                        if (timeOnly) {
                            endDateTime = `${endDateOnly}T${timeOnly}`;
                        }
                    } else if (assignment.end_date) {
                        endDateTime = endDateOnly;
                    }

                    return {
                        id: assignment.id.toString(),
                        title: assignment.event_title,
                        start: startDateTime,
                        end: endDateTime,
                        allDay: assignment.full_day || false,
                        extendedProps: {
                            calendar: assignment.flag || "Primary",
                            vehicle_id: assignment.vehicle_id,
                            contact_id: assignment.contact_id,
                        },
                    };
                });
                setEvents(calendarEvents);
            }
        } catch {
            // Error handling is silent
        }
    };

    useEffect(() => {
        const initializeData = async () => {
            await Promise.all([fetchVehicles(), fetchContacts()]);

            // Get initial calendar date after calendar has mounted
            if (calendarRef.current) {
                const calendarApi = calendarRef.current.getApi();
                const viewDate = calendarApi.getDate();
                const viewMonth = viewDate.getMonth() + 1;
                const viewYear = viewDate.getFullYear();

                setCurrentMonth(viewMonth);
                setCurrentYear(viewYear);
                await fetchEvents(viewMonth, viewYear);
                setInitialLoadDone(true);
            }
        };

        // Small delay to ensure calendar is mounted
        const timer = setTimeout(() => {
            initializeData();
        }, 100);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddEventClick = () => {
        resetModalFields();
        openModal();
    };

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        resetModalFields();
        setEventStartDate(selectInfo.startStr);
        setEventEndDate(selectInfo.endStr || selectInfo.startStr);
        openModal();
    };

    const handleDatesSet = (dateInfo: { start: Date; end: Date; startStr: string; endStr: string; timeZone: string; view: { type: string; title: string } }) => {
        // Skip if initial load is not done yet (will be handled by useEffect)
        if (!initialLoadDone) {
            return;
        }

        // Get the current date from the calendar to ensure we have the correct month
        let viewDate: Date;
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            viewDate = calendarApi.getDate();
        } else {
            // Fallback: use the 15th day of the visible range to ensure we're in the correct month
            const startDate = new Date(dateInfo.start);
            const day15 = new Date(startDate.getFullYear(), startDate.getMonth(), 15);
            viewDate = day15;
        }

        // Update current month and year when calendar view changes
        const viewMonth = viewDate.getMonth() + 1;
        const viewYear = viewDate.getFullYear();

        // Only fetch if month/year actually changed
        if (viewMonth !== currentMonth || viewYear !== currentYear) {
            setCurrentMonth(viewMonth);
            setCurrentYear(viewYear);
            fetchEvents(viewMonth, viewYear);
        }
    };

    const handleEventClick = async (clickInfo: EventClickArg) => {
        const event = clickInfo.event;
        setSelectedEvent(event as unknown as AssignmentEvent);
        setEventTitle(event.title || "");
        setEventStartDate(event.start?.toISOString().split("T")[0] || "");
        setEventEndDate(event.end?.toISOString().split("T")[0] || "");
        const startTime = event.start?.toISOString().split("T")[1]?.substring(0, 5) || "";
        const endTime = event.end?.toISOString().split("T")[1]?.substring(0, 5) || "";
        setEventStartTime(startTime);
        setEventEndTime(endTime);
        setEventLevel(event.extendedProps.calendar || "");

        if (event.extendedProps.vehicle_id) {
            setVehicleId(event.extendedProps.vehicle_id.toString());
        }
        if (event.extendedProps.contact_id) {
            setContactId(event.extendedProps.contact_id.toString());
        }

        try {
            const eventId = typeof event.id === 'string' ? parseInt(event.id) : event.id;
            const response = await vehicleAssignmentService.getForEdit(eventId);
            if (response.data?.status && response.data?.data) {
                const assignment = response.data.data;

                setEventTitle(assignment.event_title || "");
                setEventStartDate(assignment.start_date || "");
                setEventEndDate(assignment.end_date || "");
                setEventStartTime(assignment.start_time || "");
                setEventEndTime(assignment.end_time || "");
                setEventLevel(assignment.flag || "");
                setVehicleId(assignment.vehicle_id?.toString() || "");
                setContactId(assignment.contact_id?.toString() || "");
                setNotes(assignment.notes || "");
            }
        } catch {
            // Error handling is silent
        }

        openModal();
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!eventTitle.trim()) {
            newErrors.eventTitle = "Event Title is required";
        }

        if (!vehicleId) {
            newErrors.vehicleId = "Vehicle is required";
        }

        if (!contactId) {
            newErrors.contactId = "Contact is required";
        }

        if (!eventStartDate) {
            newErrors.eventStartDate = "Start Date is required";
        }

        if (!eventEndDate) {
            newErrors.eventEndDate = "End Date is required";
        }

        if (eventStartDate && eventEndDate) {
            const startDate = new Date(eventStartDate);
            const endDate = new Date(eventEndDate);

            if (endDate < startDate) {
                newErrors.eventEndDate = "End Date cannot be earlier than Start Date";
            } else if (endDate.getTime() === startDate.getTime()) {
                if (eventStartTime && eventEndTime) {
                    const startDateTime = new Date(`${eventStartDate}T${eventStartTime}`);
                    const endDateTime = new Date(`${eventEndDate}T${eventEndTime}`);

                    if (endDateTime <= startDateTime) {
                        newErrors.eventEndTime = "End Time must be later than Start Time";
                    }
                } else if (eventStartTime && !eventEndTime) {
                    newErrors.eventEndTime = "End Time is required when Start Time is provided";
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddOrUpdateEvent = async () => {
        setErrors({});
        setGeneralError("");

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const assignmentData = {
                contact_id: contactId ? parseInt(contactId) : null,
                vehicle_id: vehicleId ? parseInt(vehicleId) : null,
                event_title: eventTitle,
                start_date: eventStartDate,
                start_time: eventStartTime || null,
                end_date: eventEndDate || null,
                end_time: eventEndTime || null,
                full_day: !eventStartTime && !eventEndTime,
                flag: eventLevel || null,
            };

            let response;
            if (selectedEvent && selectedEvent.id) {
                response = await vehicleAssignmentService.update(parseInt(selectedEvent.id.toString()), assignmentData);
            } else {
                response = await vehicleAssignmentService.create(assignmentData);
            }

            if (response.data?.status === true || response.status === 200 || response.status === 201) {
                // Determine which month to fetch based on the event's start date
                const dateParts = eventStartDate.split('-');
                const eventYear = parseInt(dateParts[0], 10);
                const eventMonth = parseInt(dateParts[1], 10);

                // Refresh events for the month where event was created/updated
                await fetchEvents(eventMonth, eventYear);

                // Update current month/year if navigating to different month
                if (eventMonth !== currentMonth || eventYear !== currentYear) {
                    setCurrentMonth(eventMonth);
                    setCurrentYear(eventYear);
                }

                closeModal();
                resetModalFields();
            } else {
                setGeneralError(response.data?.message || `Failed to ${selectedEvent ? 'update' : 'create'} vehicle assignment. Please try again.`);
            }
        } catch (error: unknown) {
            if (error && typeof error === "object" && "response" in error) {
                const axiosError = error as {
                    response?: {
                        status?: number;
                        data?: {
                            message?: string;
                            errors?: Record<string, string[]>;
                            error?: string;
                        };
                    };
                };

                if (axiosError.response?.data?.errors) {
                    const validationErrors: Record<string, string> = {};
                    Object.keys(axiosError.response.data.errors).forEach((key) => {
                        const errorMessages = axiosError.response?.data?.errors?.[key];
                        if (errorMessages && errorMessages.length > 0) {
                            validationErrors[key] = errorMessages[0];
                        }
                    });
                    setErrors(validationErrors);
                } else {
                    setGeneralError(
                        axiosError.response?.data?.message ||
                        axiosError.response?.data?.error ||
                        `An error occurred while ${selectedEvent ? 'updating' : 'creating'} the vehicle assignment. Please try again.`
                    );
                }
            } else {
                setGeneralError("Network error. Please check your connection and try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetModalFields = () => {
        setEventTitle("");
        setEventStartDate(getTodayDate());
        setEventEndDate("");
        setEventStartTime("");
        setEventEndTime("");
        setEventLevel("");
        setVehicleId("");
        setContactId("");
        setNotes("");
        setSelectedEvent(null);
        setErrors({});
    };

    const handleFieldChange = (field: string, value: string) => {
        if (field === "eventTitle") setEventTitle(value);
        else if (field === "vehicleId") {
            setVehicleId(value);
            if (value) {
                const selectedVehicle = vehicles.find((v) => v.id.toString() === value);
                if (selectedVehicle && selectedVehicle.assigned_driver) {
                    setContactId(selectedVehicle.assigned_driver.toString());
                    if (errors.contactId) {
                        setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.contactId;
                            return newErrors;
                        });
                    }
                } else {
                    if (!contactId) {
                        setContactId("");
                    }
                }
            } else {
                setContactId("");
            }
        } else if (field === "contactId") {
            const selectedVehicle = vehicles.find((v) => v.id.toString() === vehicleId);
            if (!selectedVehicle || !selectedVehicle.assigned_driver) {
                setContactId(value);
            }
        }
        else if (field === "eventStartDate") {
            setEventStartDate(value);
            if (eventEndDate && value && new Date(eventEndDate) < new Date(value)) {
                setErrors((prev) => ({
                    ...prev,
                    eventEndDate: "End Date cannot be earlier than Start Date",
                }));
            } else if (errors.eventEndDate && eventEndDate && new Date(eventEndDate) >= new Date(value)) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.eventEndDate;
                    return newErrors;
                });
            }
        } else if (field === "eventEndDate") {
            setEventEndDate(value);
            if (eventStartDate && value && new Date(value) < new Date(eventStartDate)) {
                setErrors((prev) => ({
                    ...prev,
                    eventEndDate: "End Date cannot be earlier than Start Date",
                }));
            } else if (errors.eventEndDate) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.eventEndDate;
                    return newErrors;
                });
            }
            if (value === eventStartDate && eventStartTime && eventEndTime) {
                const startDateTime = new Date(`${eventStartDate}T${eventStartTime}`);
                const endDateTime = new Date(`${value}T${eventEndTime}`);
                if (endDateTime <= startDateTime) {
                    setErrors((prev) => ({
                        ...prev,
                        eventEndTime: "End Time must be later than Start Time",
                    }));
                } else if (errors.eventEndTime) {
                    setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.eventEndTime;
                        return newErrors;
                    });
                }
            }
        } else if (field === "eventStartTime") {
            setEventStartTime(value);
            if (eventStartDate === eventEndDate && eventEndTime && value) {
                const startDateTime = new Date(`${eventStartDate}T${value}`);
                const endDateTime = new Date(`${eventEndDate}T${eventEndTime}`);
                if (endDateTime <= startDateTime) {
                    setErrors((prev) => ({
                        ...prev,
                        eventEndTime: "End Time must be later than Start Time",
                    }));
                } else if (errors.eventEndTime) {
                    setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.eventEndTime;
                        return newErrors;
                    });
                }
            }
        } else if (field === "eventEndTime") {
            setEventEndTime(value);
            if (eventStartDate === eventEndDate && eventStartTime && value) {
                const startDateTime = new Date(`${eventStartDate}T${eventStartTime}`);
                const endDateTime = new Date(`${eventEndDate}T${value}`);
                if (endDateTime <= startDateTime) {
                    setErrors((prev) => ({
                        ...prev,
                        eventEndTime: "End Time must be later than Start Time",
                    }));
                } else if (errors.eventEndTime) {
                    setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.eventEndTime;
                        return newErrors;
                    });
                }
            }
        } else if (field === "notes") setNotes(value);

        if (errors[field] && field !== "eventEndDate" && field !== "eventEndTime") {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleDateChange = (field: string) => (_dates: unknown, currentDateString: string) => {
        handleFieldChange(field, currentDateString);
    };

    // Sort events whenever events array changes
    useEffect(() => {
        const sorted = [...events].sort((a, b) => {
            const dateA = a.start && (typeof a.start === 'string' || a.start instanceof Date)
                ? new Date(a.start).getTime()
                : 0;
            const dateB = b.start && (typeof b.start === 'string' || b.start instanceof Date)
                ? new Date(b.start).getTime()
                : 0;
            return dateA - dateB;
        });
        setAllEventsSorted(sorted);
    }, [events]);

    return (
        <>
            <PageMeta
                title="React.js Calendar Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Calendar Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Vehicle Assignments" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">Vehicle Assignments</h1>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white">
                        <div className="custom-calendar">
                            <FullCalendar
                                ref={calendarRef}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    left: "prev,next addEventButton",
                                    center: "title",
                                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                                }}
                                events={events}
                                selectable={true}
                                select={handleDateSelect}
                                eventClick={handleEventClick}
                                eventContent={renderEventContent}
                                datesSet={handleDatesSet}
                                customButtons={{
                                    addEventButton: {
                                        text: "Add Event +",
                                        click: handleAddEventClick,
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Events</h3>

                            {/* Events List - All Events */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-3">
                                    {currentMonth && currentYear ? (
                                        <>All Events ({new Date(currentYear, currentMonth - 1, 1).toLocaleDateString('en-US', {
                                            month: 'long',
                                            year: 'numeric'
                                        })})</>
                                    ) : (
                                        'All Events'
                                    )}
                                </h4>

                                {allEventsSorted.length > 0 ? (
                                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                        {allEventsSorted.map((event) => {
                                            const colorClass = `fc-bg-${event.extendedProps.calendar.toLowerCase()}`;
                                            const startDate = event.start && (typeof event.start === 'string' || event.start instanceof Date)
                                                ? new Date(event.start)
                                                : null;
                                            const endDate = event.end && (typeof event.end === 'string' || event.end instanceof Date)
                                                ? new Date(event.end)
                                                : null;
                                            const timeStr = startDate && !event.allDay
                                                ? startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                                                : 'All Day';

                                            // Get vehicle and contact names
                                            const vehicle = event.extendedProps.vehicle_id
                                                ? vehicles.find(v => v.id === event.extendedProps.vehicle_id)
                                                : null;
                                            const contact = event.extendedProps.contact_id
                                                ? contacts.find(c => c.id === event.extendedProps.contact_id)
                                                : null;

                                            return (
                                                <div
                                                    key={event.id}
                                                    className={`p-3 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow event-fc-color ${colorClass}`}
                                                    onClick={async () => {
                                                        // Fetch full event details and open modal
                                                        if (event.id) {
                                                            try {
                                                                const eventId = typeof event.id === 'string' ? parseInt(event.id) : event.id;
                                                                const response = await vehicleAssignmentService.getById(eventId);
                                                                if (response.data?.status && response.data?.vehicle_assignment) {
                                                                    const clickInfo = {
                                                                        event: {
                                                                            id: event.id,
                                                                            title: event.title,
                                                                            start: startDate,
                                                                            end: endDate,
                                                                            extendedProps: event.extendedProps,
                                                                        },
                                                                    } as unknown as EventClickArg;
                                                                    await handleEventClick(clickInfo);
                                                                }
                                                            } catch {
                                                                // Error handling is silent
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h5 className="font-medium text-sm text-gray-800 mb-1">{event.title}</h5>

                                                            {startDate && (
                                                                <p className="text-xs font-medium text-gray-700 mb-1">
                                                                    {startDate.toLocaleDateString('en-US', {
                                                                        weekday: 'short',
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })}
                                                                    {' at '}
                                                                    <span className="text-xs text-gray-600">{timeStr}</span>
                                                                </p>
                                                            )}
                                                            <div className="flex items-center gap-x-2 mt-1">
                                                                {vehicle && (
                                                                    <p className="text-xs text-gray-500">
                                                                        <span className="font-medium text-gray-800">Vehicle:</span> {vehicle.vehicle_name}
                                                                    </p>
                                                                )}
                                                                {contact && (
                                                                    <p className="text-xs text-gray-500">
                                                                        <span className="font-medium text-gray-800">Contact:</span> {contact.first_name} {contact.last_name || ''}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className={`inline-block w-2 h-2 rounded-full ml-2 ${event.extendedProps.calendar === 'Danger' ? 'bg-red-500' :
                                                            event.extendedProps.calendar === 'Success' ? 'bg-green-500' :
                                                                event.extendedProps.calendar === 'Warning' ? 'bg-yellow-500' :
                                                                    'bg-blue-500'
                                                            }`}></span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        No events scheduled for this month
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Modal
                        isOpen={isOpen}
                        onClose={closeModal}
                        className="max-w-[700px] p-3 lg:p-6"
                    >
                        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar max-h-[90dvh]">
                            <div>
                                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl lg:text-2xl">
                                    {selectedEvent ? "Edit Event" : "Add Event"}
                                </h5>
                                <p className="text-sm text-gray-500">
                                    Plan your next big moment: schedule or edit an event to stay on
                                    track
                                </p>
                            </div>
                            {generalError && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{generalError}</p>
                                </div>
                            )}
                            <div className="mt-4">

                                <div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Event Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="event-title"
                                            type="text"
                                            value={eventTitle}
                                            onChange={(e) => handleFieldChange("eventTitle", e.target.value)}
                                            required
                                            className={`h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 ${errors.eventTitle ? "border-red-500" : "border-gray-300 focus:border-brand-300"
                                                }`}
                                        />
                                        {errors.eventTitle && (
                                            <p className="mt-1 text-sm text-red-500">{errors.eventTitle}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Vehicle <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="vehicle-select"
                                            value={vehicleId}
                                            onChange={(e) => handleFieldChange("vehicleId", e.target.value)}
                                            required
                                            className={`h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 ${errors.vehicleId ? "border-red-500" : "border-gray-300 focus:border-brand-300"
                                                }`}
                                            disabled={isLoadingVehicles}
                                        >
                                            <option value="">{isLoadingVehicles ? "Loading vehicles..." : "Select vehicle"}</option>
                                            {vehicles.map((vehicle) => (
                                                <option key={vehicle.id} value={vehicle.id}>
                                                    {vehicle.vehicle_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.vehicleId && (
                                            <p className="mt-1 text-sm text-red-500">{errors.vehicleId}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Contact <span className="text-red-500">*</span>
                                        </label>
                                        {(() => {
                                            const selectedVehicle = vehicleId ? vehicles.find((v) => v.id.toString() === vehicleId) : null;
                                            const isContactDisabled = selectedVehicle?.assigned_driver !== null && selectedVehicle?.assigned_driver !== undefined;
                                            return (
                                                <select
                                                    id="contact-select"
                                                    value={contactId}
                                                    onChange={(e) => handleFieldChange("contactId", e.target.value)}
                                                    required
                                                    className={`h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 ${errors.contactId ? "border-red-500" : "border-gray-300 focus:border-brand-300"
                                                        } ${isContactDisabled ? "cursor-not-allowed opacity-60" : ""}`}
                                                    disabled={isLoadingContacts || isContactDisabled}
                                                >
                                                    <option value="">{isLoadingContacts ? "Loading contacts..." : "Select contact"}</option>
                                                    {contacts.map((contact) => (
                                                        <option key={contact.id} value={contact.id}>
                                                            {contact.first_name} {contact.last_name || ""}
                                                        </option>
                                                    ))}
                                                </select>
                                            );
                                        })()}
                                        {errors.contactId && (
                                            <p className="mt-1 text-sm text-red-500">{errors.contactId}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <label className="block mb-4 text-sm font-medium text-gray-700">
                                        Event Color
                                    </label>
                                    <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                                        {Object.entries(calendarsEvents).map(([key, value]) => (
                                            <div key={key} className="n-chk">
                                                <div
                                                    className={`form-check form-check-${value} form-check-inline`}
                                                >
                                                    <label
                                                        className="flex items-center text-sm text-gray-700 form-check-label"
                                                        htmlFor={`modal${key}`}
                                                    >
                                                        <span className="relative">
                                                            <input
                                                                className="sr-only form-check-input"
                                                                type="radio"
                                                                name="event-level"
                                                                value={key}
                                                                id={`modal${key}`}
                                                                checked={eventLevel === key}
                                                                onChange={() => {
                                                                    setEventLevel(key);
                                                                    if (errors.eventLevel) {
                                                                        setErrors((prev) => {
                                                                            const newErrors = { ...prev };
                                                                            delete newErrors.eventLevel;
                                                                            return newErrors;
                                                                        });
                                                                    }
                                                                }}
                                                            />
                                                            <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box">
                                                                <span
                                                                    className={`h-2 w-2 rounded-full bg-white ${eventLevel === key ? "block" : "hidden"
                                                                        }`}
                                                                ></span>
                                                            </span>
                                                        </span>
                                                        {key}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <DatePicker
                                            id="event-start-date"
                                            label={
                                                <>
                                                    Enter Start Date <span className="text-red-500">*</span>
                                                </>
                                            }
                                            placeholder="Select start date"
                                            onChange={handleDateChange("eventStartDate")}
                                            defaultDate={eventStartDate || undefined}
                                            error={!!errors.eventStartDate}
                                        />
                                        {errors.eventStartDate && (
                                            <p className="mt-1 text-sm text-red-500">{errors.eventStartDate}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Enter Start Time
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="event-start-time"
                                                type="time"
                                                value={eventStartTime}
                                                onChange={(e) => handleFieldChange("eventStartTime", e.target.value)}
                                                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <DatePicker
                                            id="event-end-date"
                                            label={
                                                <>
                                                    Enter End Date <span className="text-red-500">*</span>
                                                </>
                                            }
                                            placeholder="Select end date"
                                            onChange={handleDateChange("eventEndDate")}
                                            defaultDate={eventEndDate || undefined}
                                            minDate={eventStartDate || undefined}
                                            error={!!errors.eventEndDate}
                                        />
                                        {errors.eventEndDate && (
                                            <p className="mt-1 text-sm text-red-500">{errors.eventEndDate}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Enter End Time
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="event-end-time"
                                                type="time"
                                                value={eventEndTime}
                                                onChange={(e) => handleFieldChange("eventEndTime", e.target.value)}
                                                min={eventStartDate === eventEndDate && eventStartTime ? eventStartTime : undefined}
                                                className={`h-11 w-full appearance-none rounded-lg border bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 ${errors.eventEndTime ? "border-red-500" : "border-gray-300 focus:border-brand-300"
                                                    }`}
                                            />
                                        </div>
                                        {errors.eventEndTime && (
                                            <p className="mt-1 text-sm text-red-500">{errors.eventEndTime}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Notes
                                    </label>
                                    <textarea
                                        id="notes"
                                        value={notes}
                                        onChange={(e) => handleFieldChange("notes", e.target.value)}
                                        rows={4}
                                        className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10"
                                        placeholder="Enter notes..."
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-3 modal-footer sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                >
                                    Close
                                </Button>
                                <Button
                                    type="button"
                                    variant="primary"
                                    size="sm"
                                    onClick={handleAddOrUpdateEvent}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            {selectedEvent ? "Updating..." : "Saving..."}
                                        </>
                                    ) : (
                                        selectedEvent ? "Update Changes" : "Add Event"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </>
    );
};

const renderEventContent = (eventInfo: AssignmentEvent) => {
    const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
    return (
        <div
            className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
        >
            <div className="fc-daygrid-event-dot"></div>
            <div className="fc-event-time text-blue-500">{eventInfo.timeText}</div>
            <div className="fc-event-title" title={eventInfo.event.title}>{eventInfo.event.title}</div>
        </div>
    );
};

export default CreateAssignment;
