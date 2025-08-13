/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  usePagination,
} from "react-table";
import ReactTable from 'react-table';
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/solid";
import { Button, PageButton } from "./../buttons";
import { SortIcon, SortUpIcon, SortDownIcon } from "./../icons";
import { MdImportantDevices } from "react-icons/md";
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css'
import { useSticky } from "react-table-sticky";
// const ReactTableFixedColumns = withFixedColumns(ReactTable);



function CustomCalendarTable({ columns, data, type }) {
  let h = 600
  let w = 700
  if (typeof window !== "undefined") {
    h = window.screen.height
    w = window.screen.width
  }

  console.log(h)
  // Use the state and functions returned from useTable to build your UI
  const [hoveredRow, setHoveredRow] = useState(null);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    rows,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      autoResetPage: false,
      autoResetFilters: false,
      autoResetSortBy: false
    },
    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy,
    useSticky,
    usePagination // new
    // setPageSize(data?.length)
  );

  // useEffect(() => {
  //   return () => {
  //     setPageSize(data?.length);
  //   };
  // }, [columns]);

  // Render the UI for your table
  const defaultExpandedRows = data.map((element, index) => {
    return { index: true };
  });

  return (
    <>
      <div className="flex flex-col  border-black border-2">
        <div className="-my-2 overflow-x-auto ">
          <div className="py-2 align-middle inline-block min-w-full ">
            <div className="shadow overflow-hidden relative ">
              <table {...getTableProps()} className="min-w-full relative tables">
                {/* ${type === 'week' && 'w-[calc(100%-16px)]  overflow-x-auto table'} */}
                <thead className={`bg-white pb-1 ${type === 'week' && 'w-[calc(100%-16px)]  overflow-x-auto table'} theads`} >
                  {headerGroups.map((headerGroup, index) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={index} >
                      {headerGroup.headers.map((column, index) => (
                        <th
                          key={index}
                          scope="col"
                          className="group ths py-1 font-semibold text-black   tracking-wider uppercase bg-white fixWidth border-r-2 w-40"
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          <div className="flex items-center justify-between text-sm w-40 ">
                            {column.render("Header")}
                            <span>
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
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  // ${type === 'week' && 'block'}
                  // , width: w - 300 + 'px' 
                  style={{ maxHeight: h - 450 + 'px' }}
                  className={`divide-y divide-red-900 bg-white w-full overflow-y-scroll ${type === 'week' && 'block'}  `}
                >
                  {rows.map((row, i) => {
                    // new
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        key={i}
                        className="align-baseline hover:bg-bg-slate-50 w-full"
                      >
                        {row.cells.map((cell, index) => {
                          return (
                            <td
                              key={index}
                              {...cell.getCellProps()}
                              // style={{ width: 'calc(100% /' + row.cells.length + ')' }}
                              // ${type === 'week' ? 'w-[calc(100%/8)]' : 'w-[calc(100%/3)]'}
                              className={`pr-2 py-4 text-black border-r-2 w-60`}
                              role="cell"
                            >
                              {
                                cell.column.Cell.name === "defaultRenderer" ? (
                                  <div className="text-sm text-black  capitalize   w-40">
                                    {cell.render("Cell")}
                                  </div>
                                ) : (
                                  <div className="text-sm text-black capitalize w-40">
                                    {cell.render("Cell")}
                                  </div>
                                )
                                // (cell.render("Cell"))
                              }
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      {/* <div className="py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-x-2 items-baseline">
            <span className="text-sm text-black">
              Page <span className="font-medium">{state.pageIndex + 1}</span> of{" "}
              <span className="font-medium">{pageOptions.length}</span>
            </span>
            <label>
              <span className="sr-only">Items Per Page</span>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={state.pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 20].map((pageSize) => (
                  <option
                    key={pageSize}
                    value={pageSize}
                    className="text-red-700"
                  >
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <PageButton
                className="rounded-l-md"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">First</span>
                <ChevronDoubleLeftIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </PageButton>
              <PageButton
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </PageButton>
              <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
                <span className="sr-only">Next</span>
                <ChevronRightIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </PageButton>
              <PageButton
                className="rounded-r-md"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <span className="sr-only">Last</span>
                <ChevronDoubleRightIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </PageButton>
            </nav>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default CustomCalendarTable;


