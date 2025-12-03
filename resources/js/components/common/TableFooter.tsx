import React from "react";

export interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface TableFooterProps {
    pagination: PaginationData;
    currentPage: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
    itemLabel?: string;
}

export default function TableFooter({
    pagination,
    currentPage,
    onPageChange,
    loading = false,
    itemLabel = "items",
}: TableFooterProps) {
    const startItem = pagination.total === 0 
        ? 0 
        : (pagination.current_page - 1) * pagination.per_page + 1;
    
    const endItem = Math.min(
        pagination.current_page * pagination.per_page,
        pagination.total
    );

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === pagination.last_page;

    const handlePrevPage = () => {
        if (!isFirstPage && !loading) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (!isLastPage && !loading) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="max-[1400px]:min-w-[1200px] border-t border-gray-200 px-4 py-3 sm:px-6 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Page</span>
                    <span className="inline-flex items-center justify-center min-w-[40px] h-8 px-2 text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                        {currentPage}
                    </span>
                    <span className="text-sm text-gray-700">of {pagination.last_page}</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevPage}
                        disabled={isFirstPage || loading}
                        className={`text-sm font-medium transition-colors ${
                            isFirstPage || loading
                                ? "text-gray-400  cursor-not-allowed"
                                : "text-gray-700 hover:text-gray-900 underline"
                        }`}
                    >
                        ← Prev. Page
                    </button>

                    <button
                        onClick={handleNextPage}
                        disabled={isLastPage || loading}
                        className={`text-sm font-medium transition-colors ${
                            isLastPage || loading
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:text-gray-900 underline"
                        }`}
                    >
                        Next Page →
                    </button>
                </div>

                <div className="text-sm text-gray-700">
                    <span className="font-medium">{startItem}</span>
                    {" - "}
                    <span className="font-medium">{endItem}</span>
                    {" of "}
                    <span className="font-medium">{pagination.total.toLocaleString()}</span>
                    {" "}
                    {itemLabel}
                </div>
            </div>
        </div>
    );
}

