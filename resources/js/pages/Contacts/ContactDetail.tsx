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
    profile_picture?: string;
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
                            <h1 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-0">Contact</h1>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
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

                <div className="bg-white dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                    <div className="p-6 border-b border-gray-200 dark:border-white/10">
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
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.first_name || "—"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.last_name || "—"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.email || "—"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.phone || "—"}</p>
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
                            {contact.sin_no && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">SIN Number</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.sin_no}</p>
                                </div>
                            )}
                            {contact.employee_number && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Employee Number</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.employee_number}</p>
                                </div>
                            )}
                            {contact.address && (
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.address}</p>
                                </div>
                            )}
                            {contact.city && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">City</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.city}</p>
                                </div>
                            )}
                            {contact.state && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">State</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.state}</p>
                                </div>
                            )}
                            {(contact.zip || contact.zip_code) && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Zip Code</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.zip || contact.zip_code}</p>
                                </div>
                            )}
                            {contact.country && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.country}</p>
                                </div>
                            )}
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
                            {contact.license_issue_date && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">License Issue Date</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(contact.license_issue_date)}</p>
                                </div>
                            )}
                            {contact.license_expire_date && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">License Expiry Date</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(contact.license_expire_date)}</p>
                                </div>
                            )}
                            {contact.license_issue_country && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">License Issue Country</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.license_issue_country}</p>
                                </div>
                            )}
                            {contact.license_issue_state && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">License Issue State</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.license_issue_state}</p>
                                </div>
                            )}
                            {contact.status_in_country && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status in Country</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">{contact.status_in_country}</p>
                                </div>
                            )}
                            {contact.immigration_status && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Immigration Status</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.immigration_status}</p>
                                </div>
                            )}
                            {contact.doc_expiry_date && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Document Expiry Date</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(contact.doc_expiry_date)}</p>
                                </div>
                            )}
                            {contact.job_join_date && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Join Date</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(contact.job_join_date)}</p>
                                </div>
                            )}
                            {contact.job_leave_date && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Leave Date</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(contact.job_leave_date)}</p>
                                </div>
                            )}
                            {contact.start_date && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(contact.start_date)}</p>
                                </div>
                            )}
                            {contact.end_date && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(contact.end_date)}</p>
                                </div>
                            )}
                            {contact.hourly_labor_rate && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Hourly Labor Rate</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">${Number(contact.hourly_labor_rate).toFixed(2)}</p>
                                </div>
                            )}
                            {contact.emergency_contact_name && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Emergency Contact Name</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.emergency_contact_name}</p>
                                </div>
                            )}
                            {contact.emergency_contact_no && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Emergency Contact Number</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.emergency_contact_no}</p>
                                </div>
                            )}
                            {contact.emergency_contact_address && (
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Emergency Contact Address</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{contact.emergency_contact_address}</p>
                                </div>
                            )}
                            {contact.comment && (
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Comments</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{contact.comment}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
