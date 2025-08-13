/* eslint-disable react-hooks/exhaustive-deps */
import Table, { indexID } from "../../../src/components/table"; // new
import React, { useMemo, useContext, useState, useEffect } from "react";
import { Api } from "../../services/service";
import moment from "moment";
import { useExcelDownloder } from "react-xls";

const ClientList = (props) => {
  //  console.log(props.excelData);
  const [clientId, setClientId] = useState([]);
  const { ExcelDownloder, Type, setData } = useExcelDownloder();

  const columns = useMemo(
    () => [
      {
        Header: "No",
        Cell: indexID,
      },
      {
        Header: "Name",
        accessor: "client",
        Cell: ShowClientName,
      },
      {
        Header: "Start Date",
        accessor: "startDate",
      },
      {
        Header: "End Date",
        accessor: "endDate",
      },
      {
        Header: "Billing Cycle",
        accessor: "billingcycle",
        // Cell: ShowBillingCycle,
      },
      {
        Header: "Action",
        Cell: selectSection,
      },
    ],
    [clientId]
  );

  // useEffect(()=>{
  //   set
  // },[props.isrefresh])

  function ShowClientName({ value }) {
    return (
      <div>
        <p className="text-white">{value.fullName}</p>
      </div>
    );
  }

  function ShowBillingCycle({ row }) {
    return (
      <div>
        <p className="text-white">{row?.original?.client?.billingcycle}</p>
      </div>
    );
  }

  useEffect(() => {
    setClientId([]);
    setData({ userdata: props.excelData });
  }, [props.data]);

  const submits = () => {
    if (clientId.length === 0) {
      props.toaster({
        type: "error",
        message: "Please Select client then try again",
      });
      return;
    }
    // billInfo?.client_id.forEach((ele) => {
    //   d.push(ele?.value);
    // });
    const start = moment(props.billInfo.start, "YYYY-MM-DD").format();
    const end = moment(props.billInfo.end, "YYYY-MM-DD").format();

    const data = {
      start,
      end,
      client_id: clientId,
      deleted: false
    };
    // const data = {
    //   ...props.billInfo,
    //   client_id: clientId,
    // };
    console.log(data);

    Api("post", "admin/invoice", data, props.router).then((res) => {
      props.loader(false);
      if (res.status) {
        if (res.data.invoice[0].jobDetails) {
          props.toaster({ type: "success", message: "Invoice generated" });
          props.setBillInfo({
            start: moment(
              new Date(new Date().getTime() - 7 * 60 * 60 * 24 * 1000)
            ).format("YYYY-MM-DD"),
            end: moment(
              new Date(new Date().getTime() - 1 * 60 * 60 * 24 * 1000)
            ).format("YYYY-MM-DD"),
            client_id: [],
          });
          setClientId([]);
          props.getClientList();
          // props.setBillId(res.data.invoice[0]._id)

          // window.scrollTo({
          //   top: 0,
          //   behavior: "smooth",
          // });

        } else {
          if (!res.data.invoice) {
            props.toaster({ type: "error", message: res.data.message });
          }
        }
      } else {
        props.toaster({ type: "error", message: res.message });
      }
    });
  };

  function selectSection({ row, value }) {
    return (
      <div>
        {!row.original.created && (
          <div className="flex  items-center">
            {clientId?.includes(row?.original?.client?._id) ? (
              <button
                className="bg-green-700 text-white py-1 px-2 rounded-md"
                onClick={() => {
                  clientId = clientId.filter(
                    (f) => f !== row?.original?.client?._id
                  );
                  setClientId(clientId);
                }}
              >
                Selected
              </button>
            ) : (
              <button
                className="bg-red-700 text-white py-1 px-2 rounded-md"
                onClick={() => {
                  clientId = [...clientId, row?.original?.client?._id];
                  setClientId(clientId);
                }}
              >
                Select
              </button>
            )}
          </div>
        )}
        {row.original.created && (
          <button
            className="bg-green-700 text-white py-1 px-2 rounded-md"
            onClick={() => {
              clientId = clientId.filter(
                (f) => f !== row?.original?.client?._id
              );
              setClientId(clientId);
            }}
          >
            Already Generated
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="border-2 border-red-700 rounded-lg p-5">
      <div className="flex mb-5 justify-between">
        <ExcelDownloder
          filename={`client-${props?.billInfo?.start} to ${props?.billInfo?.end} `}
          type={Type.Button} // or type={'button'}
        >
          <button className="bg-red-700 text-white py-1 px-2 rounded-md mr-2">
            Excel
          </button>
        </ExcelDownloder>
        <button
          className="bg-green-700 text-white py-1 px-2 rounded-md"
          onClick={() => submits()}
        >
          Generate Invoices
        </button>
      </div>
      <Table columns={columns} data={props.data} refs={props.refs} />
    </div>
  );
};
export default ClientList;
