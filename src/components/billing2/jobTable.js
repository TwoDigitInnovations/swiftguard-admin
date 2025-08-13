import React, { useMemo } from "react";
import Table, { indexID } from "../../../src/components/table"; // new

function JobTable(props) {
  const columns = useMemo(
    () => [
      {
        Header: "No",
        Cell: indexID,
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Discription",
        accessor: "msg",
      },
      {
        Header: "Rate",
        accessor: "rate",
      },
      {
        Header: "Hour",
        accessor: "hour",
      },
      {
        Header: "Amount",
        accessor: "amount",
      },
    ],
    []
  );
  return <Table columns={columns} data={props.data} />;
}

export default JobTable;
