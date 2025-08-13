/* eslint-disable react-hooks/exhaustive-deps */
import Table from "../../../src/components/table"; // new
import React, { useMemo } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { RiDeleteBinFill } from "react-icons/ri";

const BillingTable = (props) => {
  console.log(props.excelData);
  const columns = useMemo(
    () => [
      {
        Header: "Invoice ID",
        accessor: "invoice_id",
      },
      {
        Header: "Client Name",
        accessor: "name",
      },
      {
        Header: "Start Date",
        accessor: "sDate",
      },
      {
        Header: "End Date ",
        accessor: "eDate",
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: amounts,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: amountSection,
      },
      {
        Header: "Action",
        Cell: ActionSection,
      },
    ],
    []
  );

  const columns2 = useMemo(
    () => [
      // {
      //   Header: "Invoice ID",
      //   accessor: "invoice_id",
      // },
      {
        Header: "Client Name",
        accessor: "name",
      },
      {
        Header: "Start Date",
        accessor: "startDate",
      },
      {
        Header: "End Date ",
        accessor: "endDate",
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: amounts,
      },
    ],
    []
  );

  function amounts({ value, row }) {
    return (
      <div className="flex">
        {/* <p>${value.amt}</p> */}
        <p className="text-white">
          {(
            (Number(value) / 100) * Number(row.original.client.vat) +
            Number(value)
          ).toFixed(2)}
        </p>
      </div>
    );
  }

  function amountSection({ value }) {
    return (
      <div className="flex">
        {/* <p>${value.amt}</p> */}
        <p
          className={`rounded-md py-1 px-2 w-20 text-center capitalize text-sm ${value === "paid" ? "bg-green-700" : "bg-red-700"
            }`}
        >
          {value === "paid" ? value : "Pending"}
        </p>
      </div>
    );
  }

  function ActionSection({ row }) {
    return (
      <div className="flex ">
        <div
          className="h-7 w-9 bg-white rounded-sm  flex justify-center items-center"
          onClick={() => {
            props.setBillId(row.original._id);
          }}
        >
          <IoEyeSharp className="text-red-700 h-4 w-4 " />
        </div>
        <div
          className="h-7 w-9 bg-red-700 rounded-sm ml-2 flex justify-center items-center"
          onClick={() => {
            props.deleteInvoice(row.original._id);
          }}
        >
          <RiDeleteBinFill className="text-white h-4 w-4 " />
        </div>
      </div>
    );
  }
  return (
    <Table
      columns={props?.from === "dashboard" ? columns2 : columns}
      data={props.data}
      from={props?.from}
    />
  );
};
export default BillingTable;
