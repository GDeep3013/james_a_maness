import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { documentService } from '../../services/documentService';
import { Modal } from '../ui/modal';
import { useModal } from '../../hooks/useModal';
import Button from '../ui/button/Button';
import { ExportIcon, FileIcon } from '../../icons';
import { Document, DocumentFormData } from '../../types/DocumentTypes';
import { PaginationData } from '../common/TableFooter';
import Label from '../form/Label';

interface DocumentsTabProps {
    activeTab: string;
}

const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png', '.gif', '.webp'];

export default function DocumentsTab({ activeTab }: DocumentsTabProps) {
    const { id } = useParams<{ id: string }>();
    const { isOpen: isUploadModalOpen, openModal: openUploadModal, closeModal: closeUploadModal } = useModal(false);
    const { isOpen: isEditModalOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal(false);
    
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [documentsPagination, setDocumentsPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });
    const [documentsCurrentPage, setDocumentsCurrentPage] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);
    
    const [formData, setFormData] = useState<DocumentFormData>({
        vehicle_id: id ? parseInt(id) : 0,
        title: '',
        file: null,
        expires_date: null,
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        } catch {
            return dateString;
        }
    };

    const fetchDocuments = useCallback(async () => {
        if (!id || activeTab !== 'documents') return;

        setLoadingDocuments(true);
        try {
            const response = await documentService.getAll({
                vehicle_id: parseInt(id),
                page: documentsCurrentPage,
            });

            const data = response.data;

            if (data.status && data.documents) {
                setDocuments(data.documents.data || []);
                setDocumentsPagination({
                    current_page: data.documents.current_page,
                    last_page: data.documents.last_page,
                    per_page: data.documents.per_page,
                    total: data.documents.total,
                });
            } else {
                setDocuments([]);
            }
        } catch {
            setDocuments([]);
        } finally {
            setLoadingDocuments(false);
        }
    }, [id, activeTab, documentsCurrentPage]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const validateFile = (file: File): string | null => {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const isValidType = ALLOWED_FILE_TYPES.includes(file.type);
        const isValidExtension = ALLOWED_EXTENSIONS.includes(fileExtension);

        if (!isValidType && !isValidExtension) {
            return 'Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, and images are allowed.';
        }

        if (file.size > 10 * 1024 * 1024) {
            return 'File size must be less than 10MB.';
        }

        return null;
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const file = files[0];
            const error = validateFile(file);
            if (error) {
                setFormErrors({ file: error });
                return;
            }
            setFormData(prev => ({ ...prev, file }));
            setFormErrors(prev => ({ ...prev, file: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const error = validateFile(file);
            if (error) {
                setFormErrors({ file: error });
                return;
            }
            setFormData(prev => ({ ...prev, file }));
            setFormErrors(prev => ({ ...prev, file: '' }));
        }
    };

    const handleInputChange = (field: keyof DocumentFormData, value: string | File | null) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const resetForm = () => {
        setFormData({
            vehicle_id: id ? parseInt(id) : 0,
            title: '',
            file: null,
            expires_date: null,
        });
        setFormErrors({});
        setEditingDocument(null);
    };

    const handleOpenUploadModal = () => {
        resetForm();
        openUploadModal();
    };

    const handleOpenEditModal = (document: Document) => {
        setEditingDocument(document);
        setFormData({
            vehicle_id: document.vehicle_id,
            title: document.title,
            file: null,
            expires_date: document.expires_date ? document.expires_date.split('T')[0] : null,
        });
        setFormErrors({});
        closeUploadModal();
        openEditModal();
    };

    const handleCloseModals = () => {
        closeUploadModal();
        closeEditModal();
        resetForm();
    };

    const handleSubmit = async () => {
        const errors: Record<string, string> = {};

        if (!formData.title.trim()) {
            errors.title = 'Title is required';
        }

        if (!editingDocument && !formData.file) {
            errors.file = 'File is required';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setUploading(true);
        try {
            if (editingDocument) {
                await documentService.update(editingDocument.id, formData);
            } else {
                await documentService.create(formData);
            }
            handleCloseModals();
            fetchDocuments();
        } catch (err: unknown) {
            const errorMessage = (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data && typeof err.response.data.message === 'string') 
                ? err.response.data.message 
                : 'An error occurred';
            setFormErrors({ submit: errorMessage });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (documentId: number) => {
        if (!window.confirm('Are you sure you want to delete this document?')) {
            return;
        }

        try {
            await documentService.delete(documentId);
            fetchDocuments();
        } catch {
            alert('Failed to delete document');
        }
    };

    const renderPagination = (
        pagination: PaginationData,
        currentPage: number,
        setCurrentPage: (page: number) => void,
        loading: boolean
    ) => {
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
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-t border-gray-200">
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

    if (activeTab !== 'documents') {
        return null;
    }

    const downloadDocument = (document: Document) => {
        window.open(document.file_path || '', '_blank');
    };

    return (
        <>
            <div className="overflow-hidden rounded-xl">
             { documents.length > 0 && <div className="flex justify-end items-center">
                    <Button size="sm" variant="primary" onClick={handleOpenUploadModal}>
                        Upload Document
                    </Button>
                </div>}

                <div className="p-4 sm:p-6">
                    {loadingDocuments ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                <p className="mt-2 text-sm text-gray-600">Loading documents...</p>
                            </div>
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="flex items-center justify-center py-6">
                            <div className="text-center">
                                <FileIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No documents found</p>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    className="mt-4"
                                    onClick={handleOpenUploadModal}
                                >
                                    Upload Your First Document
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-4">
                                {documents.map((document) => (
                                    <div
                                        key={document.id}
                                        className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                                                <FileIcon className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div className="flex w-full">
                                                <div className='w-full'>
                                                <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                                                    {document.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    Uploaded: {formatDate(document.created_at || null)}
                                                </p>
                                                </div>
                                                <div className='w-full'>
                                                <div className="flex items-center justify-end">
                                                    <div className="flex gap-2">

                                                        <button
                                                            onClick={() => downloadDocument(document)}
                                                            className=" text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                                                            title="Edit"
                                                        >
                                                            <ExportIcon />
                                                        </button>

                                                        <button
                                                            onClick={() => handleOpenEditModal(document)}
                                                            className=" text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                                                            title="Edit"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(document.id)}
                                                            className="text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                                                            title="Delete"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>    
                                                {document.expires_date && (
                                                    <div className="text-right mt-1">
                                                        <p className="text-xs text-gray-500">Expires</p>
                                                        <p className="text-sm font-semibold text-gray-800">
                                                            {formatDate(document.expires_date)}
                                                        </p>
                                                    </div>
                                                )}
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {documents.length > 0 && renderPagination(documentsPagination, documentsCurrentPage, setDocumentsCurrentPage, loadingDocuments)}
                        </>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isUploadModalOpen || isEditModalOpen}
                onClose={handleCloseModals}
                className="max-w-[600px] m-4"
            >
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        {editingDocument ? 'Edit Document' : 'Upload Document'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title *</Label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                placeholder="Enter document title"
                            />
                            {formErrors.title && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="expires_date">Expires Date</Label>
                            <input
                                type="date"
                                id="expires_date"
                                value={formData.expires_date || ''}
                                onChange={(e) => handleInputChange('expires_date', e.target.value || null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <Label htmlFor="file">
                                {editingDocument ? 'File (Leave empty to keep current file)' : 'File *'}
                            </Label>
                            <div
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                    isDragging
                                        ? 'border-brand-500 bg-brand-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                {formData.file ? (
                                    <div className="space-y-2">
                                        <FileIcon className="w-8 h-8 text-brand-500 mx-auto" />
                                        <p className="text-sm font-medium text-gray-700">{formData.file.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('file', null)}
                                            className="text-sm text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <FileIcon className="w-8 h-8 text-gray-400 mx-auto" />
                                        <p className="text-sm text-gray-600">
                                            Drag and drop a file here, or click to select
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, WEBP (Max 10MB)
                                        </p>
                                        <label
                                            htmlFor="file-upload"
                                            className="inline-block mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-sm font-medium text-gray-700 transition-colors"
                                        >
                                            Select File
                                        </label>
                                        <input
                                            type="file"
                                            id="file-upload"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                )}
                            </div>
                            {formErrors.file && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.file}</p>
                            )}
                        </div>

                        {formErrors.submit && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{formErrors.submit}</p>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                size='sm' 
                                variant='outline'
                                onClick={handleCloseModals}
                                disabled={uploading}
                            >
                                Cancel
                            </Button>
                            <Button
                                size='sm'
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={uploading}
                            >
                                {uploading ? 'Saving...' : editingDocument ? 'Update' : 'Upload'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
