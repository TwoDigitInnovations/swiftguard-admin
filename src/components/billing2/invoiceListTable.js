/* eslint-disable react-hooks/exhaustive-deps */
import Table, { indexID } from "../../../src/components/table"; // new
import React, { useMemo, useContext, useState, useEffect } from "react";
// import { IoEyeSharp } from "react-icons/io5";
// import { RiDeleteBinFill } from "react-icons/ri";
// import { Context, userContext } from "../../../pages/_app";

const InvoicesList = (props) => {
  // const [initial, setInitial] = useContext(Context);
  const [guardRange, setGuardRange] = useState();
  // const [columns, setColumns] = useState([
  //   {
  //     Header: "No",
  //     Cell: indexID,
  //   },
  //   {
  //     Header: "Outlet Name",
  //     accessor: "name",
  //   },
  //   {
  //     Header: "Wage",
  //     accessor: "wages",
  //   },
  //   {
  //     Header: "Action",
  //     Cell: ActionSection,
  //   },
  // ]);

  // useEffect(() => {
  //   setColumns([
  //     {
  //       Header: "No",
  //       Cell: indexID,
  //     },
  //     {
  //       Header: "Outlet Name",
  //       accessor: "name",
  //     },
  //     {
  //       Header: "Wage",
  //       accessor: "wages",
  //     },
  //     {
  //       Header: "Action",
  //       Cell: ActionSection,
  //     },
  //   ]);
  // }, []);

  const columns = useMemo(
    () => [
      {
        Header: "No",
        Cell: indexID,
      },
      {
        Header: "Outlet Name",
        accessor: "name",
      },
      {
        Header: "Wage",
        accessor: "wages",
      },
      {
        Header: "Payroll",
        accessor: "payroll",
      },
      {
        Header: "Action",
        Cell: ActionSection,
      },
    ],
    []
  );

  useEffect(() => {
    setGuardRange(props?.guardRange);
  }, [props]);

  function selectSection({ value }) {
    return (
      <div className="flex  items-center">
        <input type="checkbox" />
      </div>
    );
  }

  function ActionSection({ row, value }) {
    return (
      <div className="flex">
        <button
          className="bg-green-700 text-white py-1 px-2 rounded-md"
          onClick={() => {
            const data = { startDate: row?.original?.startDate, endDate: row?.original?.endDate }
            localStorage.setItem('history', JSON.stringify(data))
            props?.router.push(
              `${row?.original?._id}?start=${row?.original?.startDate}&end=${row?.original?.endDate}`
            );
          }}
        >
          View
        </button>
      </div>
    );
  }
  return <Table columns={columns} data={props.data} refs={props.refs} />;
};
export default InvoicesList;
