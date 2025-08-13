import React from "react";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  usePagination,
} from "react-table";
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/solid";
import { Button, PageButton } from "./buttons";
import { classNames } from "./utils";
import { SortIcon, SortUpIcon, SortDownIcon, Eyeicon } from "./icons";
import Image from "next/image";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <label className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">Search: </span>
      <input
        type="text"
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </label>
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id, render },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <label className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">{render("Header")}: </span>
      <select
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        name={id}
        id={id}
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function StatusPill({ value }) {
  const status = value ? value.toLowerCase() : "unknown";

  return <span className="text-white text-sm">{status}</span>;
}

export function indexID({ row }) {
  return (
    <div>
      <p>{parseInt(row.id) + 1}</p>
    </div>
  );
}

export function AvatarCell({ value, column, row }) {
  return (
    <div className="flex items-center">
      <div className="ml-4">
        <div className="text-sm font-medium text-white">{value}</div>
        {/* <div className="text-sm text-gray-500">
          {row.original[column.emailAccessor]}
        </div> */}
      </div>
    </div>
  );
}

function Table({ columns, data, refs, from }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    footerGroups,
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
    usePagination // new
  );

  // Render the UI for your table
  const defaultExpandedRows = data.map((element, index) => {
    return { index: true };
  });
  return (
    <>
      {/* <div className="sm:flex sm:gap-x-2">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) =>
            column.Filter ? (
              <div className="mt-2 sm:mt-0" key={column.id}>
                {column.render("Filter")}
              </div>
            ) : null
          )
        )}
      </div> */}
      {/* table */}
      <div className="flex flex-col  border-red-700 border-2">
        <div className="-my-2 overflow-x-auto ">
          <div className="py-2 align-middle inline-block min-w-full ">
            <div className="shadow overflow-hidden  sm:rounded-lg">
              <table
                {...getTableProps()}
                className="min-w-full "
                ref={refs}
              >
                <thead className="bg-black  border-b-2 border-red-700  pb-1">
                  {headerGroups.map((headerGroup, index) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={index} className="">
                      {headerGroup.headers.map((column, index) => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th
                          key={index}
                          scope="col"
                          className="group pl-2 py-3  text-md font-medium text-white text-left tracking-wider "
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          <div className="flex items-center justify-start">
                            {column.render("Header")}
                            {/* Add a sort direction indicator */}
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
                  className="bg-black divide-y divide-red-900 "
                >
                  {page.map((row, i) => {
                    // new
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} key={i}>
                        {row.cells.map((cell, index) => {
                          return (
                            <td
                              key={index}
                              {...cell.getCellProps()}
                              className="pl-2 py-4 whitespace-nowrap text-white text-left"
                              role="cell"
                            >
                              {
                                cell.column.Cell.name === "defaultRenderer" ? (
                                  <div className="text-sm text-white ">
                                    {cell.render("Cell")}
                                  </div>
                                ) : (
                                  <div className="text-sm text-white ">
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
                {from === 'guardhistory' && <tfoot>
                  {footerGroups.map((group, ind) => (
                    <tr {...group.getFooterGroupProps()} className="bg-black" key={ind}>
                      {group.headers.map((column, idx) => (
                        <td {...column.getFooterProps()} className="pl-2 py-4 whitespace-nowrap text-white text-left"
                          key={idx}>{column.render("Footer")}</td>
                      ))}
                    </tr>
                  ))}
                </tfoot>}
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      {from !== "dashboard" && (<div className="py-3 flex items-center justify-between d_none">
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
            <span className="text-sm text-white">
              Page <span className="font-medium">{state.pageIndex + 1}</span>{" "}
              of <span className="font-medium">{pageOptions.length}</span>
            </span>
            <label>
              <span className="sr-only">Items Per Page</span>
              <select
                className="mt-1 block w-full bg-red-700 p-1 rounded-sm text-black border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                className="rounded-full"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">First</span>
                <ChevronDoubleLeftIcon
                  className="h-5 w-5 text-black"
                  aria-hidden="true"
                />
              </PageButton>
              <PageButton
                className="rounded-full"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon
                  className="h-5 w-5 text-black"
                  aria-hidden="true"
                />
              </PageButton>
              <PageButton className="rounded-full" onClick={() => nextPage()} disabled={!canNextPage}>
                <span className="sr-only">Next</span>
                <ChevronRightIcon
                  className="h-5 w-5 text-black"
                  aria-hidden="true"
                />
              </PageButton>
              <PageButton
                className="rounded-full"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <span className="sr-only">Last</span>
                <ChevronDoubleRightIcon
                  className="h-5 w-5 text-black"
                  aria-hidden="true"
                />
              </PageButton>
            </nav>
          </div>
        </div>

      </div>
      )}
    </>
  );
}

export default Table;
