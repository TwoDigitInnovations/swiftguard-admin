import Table, { indexID } from "../../../src/components/table"; // new
import React, { useMemo } from "react";
import JobFilter from "../JobFilter";
import { MdEventAvailable } from "react-icons/md";

const HistoryTable = (props) => {
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        Cell: indexID,
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Time",
        accessor: "time",
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Amount($)",
        accessor: "amount",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: statusSection,
      },
      // {
      //   Header: "Email",
      //   accessor: "email",
      // },
    ],
    [statusSection]
  );

  const available = async (startDate, endDate) => {
    // const date = parseFloat(
    const date = await JobFilter({
      startDate,
      endDate,
    });
    // ).toFixed(2);
    return date;
  };

  function statusSection({ row }) {
    return (
      <p className={`${"text-white"} text-semibold`}>
        {row?.original?.applicant.length > 0
          ? available(new Date(), row?.original?.endDate) > 0
            ? "Accepted"
            : "Done"
          : available(new Date(), row?.original?.endDate) > 0
            ? "Posted"
            : "Not accepted"}
      </p>
    );
  }

  return <Table columns={columns} data={props.data} />;
};
export default HistoryTable;
