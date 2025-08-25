import React, { useMemo } from "react";
import {
    useTable,
    useFilters,
    useGlobalFilter,
    useSortBy
} from "react-table";
import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from "@heroicons/react/solid";
import { Button, PageButton } from "./buttons";
import { SortDownIcon, SortIcon, SortUpIcon } from "./icons";

function PaginationTable({
    columns,
    data,
    pageCount,
    setPageCount,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    loading,
    from
}) {
    // Memoize and sanitize the data to prevent undefined issues
    const safeData = useMemo(() => {
        if (!data || !Array.isArray(data)) {
            return [];
        }
        
        return data
            .filter(row => row && typeof row === 'object')
            .map((row, index) => ({
                ...row,
                // Ensure each row has a unique key
                __rowId: row._id || row.id || `row-${index}`,
            }));
    }, [data]);

    // Memoize columns to prevent unnecessary re-renders
    const safeColumns = useMemo(() => {
        if (!columns || !Array.isArray(columns)) {
            return [];
        }
        return columns;
    }, [columns]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable(
        {
            columns: safeColumns,
            data: safeData,
            manualSortBy: true,
            disableMultiSort: true,
            // Add default sorting
            initialState: {
                sortBy: []
            }
        },
        useFilters,
        useGlobalFilter,
        useSortBy
    );

    const canPreviousPage = pageIndex > 1;
    const canNextPage = pageIndex < pageCount;

    // Safe pagination handlers
    const handlePreviousPage = () => {
        const newPage = Math.max(pageIndex - 1, 1);
        setPageIndex(newPage);
    };

    const handleNextPage = () => {
        const newPage = Math.min(pageIndex + 1, pageCount);
        setPageIndex(newPage);
    };

    const handleFirstPage = () => {
        setPageIndex(1);
    };

    const handleLastPage = () => {
        setPageIndex(pageCount);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(Number(newSize));
        setPageIndex(1); // Reset to first page
    };

    return (
        <>
            {/* Table */}
            <div className="flex flex-col border-red-700 border-2">
                <div className="-my-2 overflow-x-auto">
                    <div className="py-2 align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden sm:rounded-lg">
                            <table {...getTableProps()} className="min-w-full">
                                <thead className="bg-black border-b-2 border-red-700 pb-1">
                                    {headerGroups.map((headerGroup, i) => (
                                        <tr {...headerGroup.getHeaderGroupProps()} key={`header-${i}`}>
                                            {headerGroup.headers.map((column, idx) => (
                                                <th
                                                    key={`column-${idx}`}
                                                    scope="col"
                                                    className="group pl-2 py-3 text-md font-medium text-white text-left tracking-wider"
                                                    {...column.getHeaderProps(
                                                        column.getSortByToggleProps ? 
                                                        column.getSortByToggleProps() : 
                                                        {}
                                                    )}
                                                >
                                                    <div className="flex items-center justify-start">
                                                        {column.render("Header")}
                                                        {column.canSort && (
                                                            <span className="ml-1">
                                                                {column.isSorted ? (
                                                                    column.isSortedDesc ? (
                                                                        <SortDownIcon className="w-4 h-4 text-gray-400" />
                                                                    ) : (
                                                                        <SortUpIcon className="w-4 h-4 text-gray-400" />
                                                                    )
                                                                ) : (
                                                                    <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>

                                <tbody {...getTableBodyProps()} className="bg-black divide-y divide-red-900">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={safeColumns.length} className="text-center text-white py-8">
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                                                    Loading...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : safeData.length === 0 ? (
                                        <tr>
                                            <td colSpan={safeColumns.length} className="text-center text-white py-8">
                                                No data available
                                            </td>
                                        </tr>
                                    ) : (
                                        rows.map((row, i) => {
                                            try {
                                                prepareRow(row);
                                                return (
                                                    <tr {...row.getRowProps()} key={row.original.__rowId || `row-${i}`}>
                                                        {row.cells.map((cell, idx) => {
                                                            try {
                                                                return (
                                                                    <td 
                                                                        key={`cell-${idx}`} 
                                                                        {...cell.getCellProps()} 
                                                                        className="pl-2 py-4 whitespace-nowrap text-white text-left"
                                                                    >
                                                                        {cell.render("Cell")}
                                                                    </td>
                                                                );
                                                            } catch (cellError) {
                                                                console.error("Cell render error:", cellError);
                                                                return (
                                                                    <td key={`cell-error-${idx}`} className="pl-2 py-4 whitespace-nowrap text-white text-left">
                                                                        Error
                                                                    </td>
                                                                );
                                                            }
                                                        })}
                                                    </tr>
                                                );
                                            } catch (rowError) {
                                                console.error("Row render error:", rowError);
                                                return (
                                                    <tr key={`row-error-${i}`}>
                                                        <td colSpan={safeColumns.length} className="text-center text-red-400 py-4">
                                                            Error rendering row
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {from !== "dashboard" && pageCount > 0 && (
                <div className="py-3 flex items-center justify-between">
                    {/* Mobile buttons */}
                    <div className="flex-1 flex justify-between sm:hidden">
                        <Button onClick={handlePreviousPage} disabled={!canPreviousPage}>
                            Previous
                        </Button>
                        <Button onClick={handleNextPage} disabled={!canNextPage}>
                            Next
                        </Button>
                    </div>

                    {/* Desktop pagination */}
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div className="flex gap-x-2 items-baseline">
                            <span className="text-sm text-white">
                                Page <span className="font-medium">{pageIndex}</span> of{" "}
                                <span className="font-medium">{pageCount}</span>
                                {safeData.length > 0 && (
                                    <span className="text-gray-400 ml-2">
                                        ({safeData.length} items)
                                    </span>
                                )}
                            </span>
                            <label>
                                <span className="sr-only">Items Per Page</span>
                                <select
                                    className="mt-1 block w-full bg-red-700 p-1 rounded-sm text-white border-gray-300 shadow-sm"
                                    value={pageSize}
                                    onChange={(e) => handlePageSizeChange(e.target.value)}
                                >
                                    {[ 20, 50].map((size) => (
                                        <option key={size} value={size} className="text-white">
                                            Show {size}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <PageButton onClick={handleFirstPage} disabled={!canPreviousPage}>
                                    <ChevronDoubleLeftIcon className="h-5 w-5 text-black" />
                                </PageButton>
                                <PageButton onClick={handlePreviousPage} disabled={!canPreviousPage}>
                                    <ChevronLeftIcon className="h-5 w-5 text-black" />
                                </PageButton>
                                <PageButton onClick={handleNextPage} disabled={!canNextPage}>
                                    <ChevronRightIcon className="h-5 w-5 text-black" />
                                </PageButton>
                                <PageButton onClick={handleLastPage} disabled={!canNextPage}>
                                    <ChevronDoubleRightIcon className="h-5 w-5 text-black" />
                                </PageButton>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PaginationTable;