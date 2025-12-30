
import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, PencilIcon } from "../../icons";
import { useNavigate, useParams } from "react-router";
import { contactService } from "../../services/contactService";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";

interface Contact {
    id: number;
    user_id?: number;
    job_title?: string;
    first_name: string;
    last_name?: string;
    gender?: string;
    dob?: string;
    date_of_birth?: string;
    sin_no?: string;
    phone: string;
    email: string;
    address?: string;
    country?: string;
    state?: string;
    city?: string;
    zip?: string;
    zip_code?: string;
    license_no?: string;
    license_number?: string;
    license_class?: string;
    license_issue_country?: string;
    license_issue_state?: string;
    license_issue_date?: string;
    license_expire_date?: string;
    status_in_country?: string;
    doc_expiry_date?: string;
    job_join_date?: string;
    job_leave_date?: string;
    emergency_contact_name?: string;
    emergency_contact_no?: string;
    emergency_contact_address?: string;
    designation?: string;
    status?: string;
    immigration_status?: string;
    comment?: string;
    hourly_labor_rate?: number;
    employee_number?: string;
    start_date?: string;
    end_date?: string;
    user?: {
        id: number;
        profile_picture?: string;
    };
    classification: string;
    created_at?: string;
    updated_at?: string;
}

export default function ContactDetail() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (id) {
            fetchContact(parseInt(id));
        }
    }, [id]);

    const fetchContact = async (contactId: number) => {
        setLoading(true);
        setError("");
        try {
            const response = await contactService.getById(contactId);
            const data = response.data as { status: boolean; contact?: Contact; data?: Contact };

            if (data.status && (data.contact || data.data)) {
                setContact(data.contact || data.data || null);
            } else {
                setError("Contact not found");
            }
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || "Failed to load contact");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        if (contact) {
            navigate(`/contacts/${contact.id}`);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "—";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const getFullName = () => {
        if (!contact) return "";
        return `${contact.first_name} ${contact.last_name || ""}`.trim();
    };

    if (loading) {
        return (
            <>
                <PageMeta title="Contact Details" description="View contact details" />
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Loading contact...
                        </p>
                    </div>
                </div>
            </>
        );
    }

    if (error || !contact) {
        return (
            <>
                <PageMeta title="Contact Details" description="View contact details" />
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/contacts')}
                            startIcon={<ChevronLeftIcon />}
                        >
                            Back to Contacts
                        </Button>
                    </div>
                    <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                        <p className="text-sm text-error-600 dark:text-error-400">
                            {error || 'Contact not found'}
                        </p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <PageMeta title={`${getFullName()} - Contact Details`} description="View contact details" />

            <div className="space-y-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                            onClick={() => navigate("/contacts")}
                        >
                            <ChevronLeftIcon className="size-5" />
                        </button>
                        <div>
                            <h1 className="text-sm md:text-lg font-medium text-gray-500 dark:text-gray-400 mb-0">Contact</h1>
                            <h2 className="text-base md:text-2xl font-semibold text-gray-900 dark:text-white">
                                {getFullName() || `Contact #${contact.id}`}
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleEdit}
                            className="min-height-[40px] !leading-[40px]"
                            startIcon={<PencilIcon />}
                        >
                            Edit
                        </Button>
                    </div>
                </div>


                <div className="flex md:flex-nowrap flex-wrap gap-6 mt-6">
                    <div className="max-w-[767px]:max-w-full lg:max-w-[387px] max-w-full w-full">
                        <div className="bg-white rounded-lg lg:p-6 p-3 border border-gray-200">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-white/10">
                                    <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
                                        {contact.first_name?.charAt(0).toUpperCase() || "C"}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{getFullName()}</h3>
                                    {contact.designation && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{contact.designation}</p>
                                    )}
                                    {contact.status && (
                                        <div className="mt-2">
                                            <Badge
                                                color={contact.status === 'Active' ? 'success' : 'error'}
                                            >
                                                {contact.status}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.first_name || "—"}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.last_name || "—"}</p>
                                </div>
                                {contact.gender && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">{contact.gender || "—"}</p>
                                    </div>
                                )}
                                {(contact.dob || contact.date_of_birth) && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {formatDate(contact.dob || contact.date_of_birth)}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.phone || "—"}</p>
                                </div>
                                {contact.sin_no && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">SIN Number</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.sin_no}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white break-all">{contact.email || "—"}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white"> Times Square </p>
                                </div>

                            </div>
                        </div>
                        <div className="bg-white rounded-lg lg:p-6 p-3 border border-gray-200 mt-4">
                            <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">Classification</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Classification</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.classification}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg lg:p-6 p-3 border border-gray-200 mt-4">
                            <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">License</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(contact.license_no || contact.license_number) && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">License Number</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.license_no || contact.license_number}</p>
                                    </div>
                                )}
                                {contact.license_class && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">License Class</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.license_class}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">License Country</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.license_issue_country}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">License State/Province</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.license_issue_state}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">License Date</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(contact.license_issue_date)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">License Expiry Date</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white"> {formatDate(contact.license_expire_date)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg lg:p-6 p-3 border border-gray-200 mt-4">
                            <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">Immigration</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status in Country</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white"> {contact.status_in_country}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Immigration Status</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white"> {contact.immigration_status}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Document Expiry Date</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white"> {formatDate(contact.doc_expiry_date)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg lg:p-6 p-3 border border-gray-200 mt-4">
                            <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">Employment</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Title</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white"> {contact.job_title}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Employee Number</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white"> {contact.employee_number}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Join Date</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white"> {formatDate(contact.job_join_date)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Leave Date</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white"> {formatDate(contact.job_leave_date)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Hourly Labor Rate</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white"> {contact.hourly_labor_rate}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg lg:p-6 p-3 border border-gray-200 mt-4">
                            <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">Emergency Contact</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Name</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white"> {contact.emergency_contact_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Number</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white"> {contact.emergency_contact_no}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Address</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white"> {contact.emergency_contact_address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="bg-white rounded-lg lg:p-6 p-3 border border-gray-200">
                            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-2">
                                <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
                                    No currently active vehicle assignments.
                                </h2>
                                <div className="flex gap-3">
                                    <button className="text-sm text-primary-600 font-medium hover:underline">
                                        + Add Vehicle Assignment
                                    </button>
                                    <button className="text-sm text-primary-600 font-medium hover:underline">
                                        View All
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col items-center py-6">
                                <span className="text-gray-400 text-sm">
                                    No currently active vehicle assignments.
                                </span>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg lg:p-6 p-3 border border-gray-200 mt-4">
                            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-2">
                                <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
                                    Incomplete Work Order Assignments
                                </h2>
                            </div>
                            <div className="flex flex-col items-center py-6">
                                <span className="text-gray-400 text-sm">
                                    Contact must have technican crassification to the assigned to work anders
                                </span>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg lg:p-6 p-3 border border-gray-200 mt-4">
                            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-2">
                                <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
                                    Open Issue Assignments
                                </h2>
                                <div className="flex gap-3">
                                    <button className="text-sm text-primary-600 font-medium hover:underline">
                                        View All
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col items-center py-6">
                                <span className="text-gray-400 text-sm">
                                    No open uns currently assigned
                                </span>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg lg:p-6 p-3 border border-gray-200 mt-4">
                            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-2">
                                <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
                                    Service Reminder Assignments
                                </h2>
                                <div className="flex gap-3">
                                    <button className="text-sm text-primary-600 font-medium hover:underline">
                                        View All
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col items-center py-6">
                                <span className="text-gray-400 text-sm">
                                    No service reminders currently assigned
                                </span>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </>
    );
}
