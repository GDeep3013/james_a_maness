import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import { contactService } from "../../services/contactService";
import { PencilIcon, TrashBinIcon, ExportIcon, EyeIcon } from "../../icons";
import Select from "../../components/form/Select";


interface Contact {
  id: number;
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  license_no?: string;
  license_class?: string;
  status?: string;
  user: {
    profile_picture: string;
  };
  designation?: string;
  created_at?: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface ContactsResponse {
  status: boolean;
  contact: {
    data: Contact[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function ContactsList() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchContacts = useCallback(async (page: number = 1, search: string = "" , status: string = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await contactService.getAll({ page, search, status });
      const data = response.data as ContactsResponse;

      if (data.status && data.contact) {
        setContacts(data.contact.data || []);
        setPagination({
          current_page: data.contact.current_page,
          last_page: data.contact.last_page,
          per_page: data.contact.per_page,
          total: data.contact.total,
        });
      } else {
        setError("Failed to load contacts");
        setContacts([]);
      }
    } catch {
      setError("An error occurred while loading contacts");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts(currentPage, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter, fetchContacts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchContacts(1, searchTerm, statusFilter);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    setDeletingId(id);
    try {
      await contactService.delete(id);
      fetchContacts(currentPage, searchTerm , statusFilter);
    } catch {
      alert("Failed to delete contact. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/contacts/${id}`);
  };

  const handleView = (id: number) => {
    navigate(`/contacts/${id}/ContactDetail`);
  };

  const handleExport = async () => {
    try {
      const response = await contactService.export({
        search: searchTerm,
        status: statusFilter,
      });

      const blob = response.data instanceof Blob 
        ? response.data 
        : new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });

      if (blob.size === 0) {
        alert("The exported file is empty. Please try again.");
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
      let fileName = `contacts_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, '').trim();
        }
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const text = reader.result as string;
              const json = JSON.parse(text);
              alert(json.message || "Failed to export contacts. Please try again.");
            } catch {
              alert("Failed to export contacts. Please try again.");
            }
          };
          reader.readAsText(errorData);
        } else {
          alert(errorData.message || "Failed to export contacts. Please try again.");
        }
      } else {
        alert("Failed to export contacts. Please try again.");
      }
    }
  };

  const getFullName = (contact: Contact) => {
    return `${contact.first_name} ${contact.last_name || ""}`.trim();
  };

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const renderPagination = () => {
    const pages: number[] = [];
    const maxPages = 5;
    let startPage = Math.max(1, pagination.current_page - Math.floor(maxPages / 2));
    const endPage = Math.min(pagination.last_page, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="min-height-[34px] !leading-[34px]"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pagination.last_page || loading}
            className="min-height-[34px] !leading-[34px]"
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {pagination.total === 0
                  ? 0
                  : (pagination.current_page - 1) * pagination.per_page + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  pagination.current_page * pagination.per_page,
                  pagination.total
                )}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="rounded-r-none min-height-[34px] !leading-[34px]"
              >
                Previous
              </Button>
              {pages.map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  disabled={loading}
                  className="rounded-none border-l-0 min-height-[34px] !leading-[34px]"
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.last_page || loading}
                className="rounded-l-none border-l-0 min-height-[34px] !leading-[34px]"
              >
                Next
              </Button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <PageMeta
        title="Contacts List"
        description="Manage and view all contacts"
      />

      <div className="space-y-6">
        <form onSubmit={handleSearch} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-full max-w-full md:max-w-[50%]">
              <Input
                type="text"
                placeholder="Search by name, email, phone, or license..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!bg-[#F3F3F5] max-w-full border-none !rounded-[8px]"
              />
            </div>
            <div className="w-full max-w-[50%] md:max-w-[20%]">
              <Select
                options={statusOptions}
                placeholder="All Status"
                onChange={(value) => setStatusFilter(value)}
                defaultValue=""
                className="!bg-[#F3F3F5] border-gray-200"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleExport}
              className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-gray-800 w-full max-w-100 md:max-w-[10%] min-h-[44px] !leading-[44px]"
            >
              <ExportIcon />
              Export
            </Button>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
            <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="max-w-full overflow-hidden overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                  <p className="mt-2 text-sm text-gray-600  ">
                    Loading contacts...
                  </p>
                </div>
              </div>
            ) : contacts.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-600  ">
                    No contacts found
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/5">
                    <TableRow className="bg-[#E5E7EB]">
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm"
                      >
                        Contact
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm  "
                      >
                        Email/Phone
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm  "
                      >
                        License
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm  "
                      >
                        Designation
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm  "
                      >
                        Status
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-sm   w-[10%]"
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {getFullName(contact)}
                              </span>
                              <span className="block text-gray-500 text-sm  ">
                                ID: {contact.id}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="space-y-1">
                            <div className="text-gray-800 text-theme-sm dark:text-white/90">
                              {contact.email}
                            </div>
                            <div className="text-gray-500 text-sm  ">
                              {contact.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="space-y-1">
                            <div className="text-gray-800 text-theme-sm dark:text-white/90">
                              {contact.license_no || "N/A"}
                            </div>
                            {contact.license_class && (
                              <div className="text-gray-500 text-sm  ">
                                {contact.license_class}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm  ">
                          {contact.designation || "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <Badge
                            size="sm"
                            color={
                              contact.status === "Active"
                                ? "success"
                                : contact.status === "Inactive"
                                ? "error"
                                : "warning"
                            }
                          >
                            {contact.status || "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="actions-buttons">
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleView(contact.id)}
                              className="view-button hover:scale-105 transition-all duration-300"
                              startIcon={<EyeIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleEdit(contact.id)}
                              className="edit-button hover:scale-105 transition-all duration-300"
                              startIcon={<PencilIcon />}
                            >
                              {""}
                            </Button>
                            <Button
                              variant="none"
                              size="sm"
                              onClick={() => handleDelete(contact.id)}
                              disabled={deletingId === contact.id}
                              className="delete-button hover:scale-105 transition-all duration-300"
                              startIcon={<TrashBinIcon />}
                            >
                              {""}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
