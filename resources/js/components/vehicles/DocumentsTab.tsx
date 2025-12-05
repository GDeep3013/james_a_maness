import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { vehicleService } from '../../services/vehicleService';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Button from '../ui/button/Button';
import { FileIcon } from '../../icons';
import { Document } from '../../types/DocumentTypes';
import { PaginationData } from '../common/TableFooter';

interface DocumentsTabProps {
    activeTab: string;
}

export default function DocumentsTab({ activeTab }: DocumentsTabProps) {
    const { id } = useParams<{ id: string }>();
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [documentsPagination, setDocumentsPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });
    const [documentsCurrentPage, setDocumentsCurrentPage] = useState(1);

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

    useEffect(() => {
        const fetchDocumentRecords = async () => {
            if (!id || activeTab !== 'documents') return;

            setLoadingDocuments(true);
            try {
                const response = await vehicleService.getAll({
                    page: documentsCurrentPage,
                    search: '',
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
            } catch (error) {
                console.error("Failed to load documents:", error);
                setDocuments([]);
            } finally {
                setLoadingDocuments(false);
            }
        };

        fetchDocumentRecords();
    }, [id, activeTab, documentsCurrentPage]);

    if (activeTab !== 'documents') {
        return null;
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="max-w-full overflow-x-auto">
                {loadingDocuments ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                            <p className="mt-2 text-sm text-gray-600">Loading documents...</p>
                        </div>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <p className="text-gray-600">No documents found</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader className="border-b border-gray-100">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                        Document ID
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                        Title
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                        Uploaded Date
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                                        Expires Date
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100">
                                {documents.map((document) => (
                                    <TableRow key={document.id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                                                    <FileIcon className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <span className="block font-medium text-gray-800 text-theme-sm">
                                                    DOC-{document.id}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm font-semibold">
                                                {document.title}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                {document.uploadedDate}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            <div className="text-gray-800 text-theme-sm">
                                                {document.expiresDate}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {documents.length > 0 && renderPagination(documentsPagination, documentsCurrentPage, setDocumentsCurrentPage, loadingDocuments)}
                    </>
                )}
            </div>
        </div>
    );
}

