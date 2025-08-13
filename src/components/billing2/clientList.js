/* eslint-disable react-hooks/exhaustive-deps */
import Table, { indexID } from "../../../src/components/table"; // new
import React, { useMemo, useContext, useState, useEffect } from "react";
import { Api } from "../../services/service";
import moment from "moment";
import { useExcelDownloder } from "react-xls";
import { IoEyeSharp } from "react-icons/io5";
import { RiDeleteBinFill } from "react-icons/ri";
import { Checkbox } from "@material-ui/core";
import { billContext } from "../../../pages/billing2";

const ClientList = (props) => {
  //  console.log(props.excelData);

  const [clientId, setClientId] = useState([]);
  const { ExcelDownloder, Type, setData, setFilename } = useExcelDownloder();
  const [clientData, setClientData] = useState(props.data)
  const [billArray, setBillArray] = useContext(billContext);
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
        Header: "Amount",
        accessor: "amount",
        // Cell: ShowBillingCycle,
      },
      {
        Header: "Action",
        Cell: selectSection,
      },
    ],
    [clientId]
  );

  useEffect(() => {
    setClientId(billArray?.clientId || [])
    setFilename(`client-${billArray.clientrange?.start} to ${billArray.clientrange?.end}`)
  }, [billArray])

  useEffect(() => {
    console.log(billArray, props.billInfo)

  }, [])

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

    setClientData(props.data)

    console.log('props?.isrefresh=====>', billArray)
    setData({ userdata: props.excelData });

  }, [props.data]);

  useEffect(() => {
    if (props?.isrefresh?.client_id?.length > 0) {
      setClientId(props?.isrefresh?.client_id || [])
    }

  }, [props?.isrefresh])

  const submits = (id) => {
    // if (clientId.length === 0) {
    //   props.toaster({
    //     type: "error",
    //     message: "Please Select client then try again",
    //   });
    //   return;
    // }
    // billInfo?.client_id.forEach((ele) => {
    //   d.push(ele?.value);
    // });
    const start = moment(props.billInfo.start, "YYYY-MM-DD").format();
    const end = moment(props.billInfo.end, "YYYY-MM-DD").format();

    const data = {
      start,
      end,
      // client_id: clientId,
      client_id: [id],
      deleted: true
    };
    // const data = {
    //   ...props.billInfo,
    //   client_id: clientId,
    // };
    console.log(data);

    Api("post", "admin/invoice", data, props.router).then((res) => {
      props.loader(false);
      if (res.status) {
        // setBillArray(data)
        // props.toaster({ type: "success", message: "Invoice generated" });
        if (res.data.invoice[0].jobDetails) {
          // props.toaster({ type: "success", message: "Invoice generated" });
          // props.setBillInfo({
          //   start: moment(
          //     new Date(new Date().getTime() - 7 * 60 * 60 * 24 * 1000)
          //   ).format("YYYY-MM-DD"),
          //   end: moment(
          //     new Date(new Date().getTime() - 1 * 60 * 60 * 24 * 1000)
          //   ).format("YYYY-MM-DD"),
          //   client_id: [],
          // });
          setClientId([]);
          // props.getClientList();
          props.setBillId(res.data.invoice[0]._id)

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });

        } else {
          if (res.data.invoice) {
            props.toaster({ type: "error", message: res.data.invoice[0].message });
          }
        }
      } else {
        props.toaster({ type: "error", message: res.message });
      }
    });
  };

  const createInvoice = () => {
    if (billArray?.clients?.length === 0) {
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
      client_id: billArray.clients,
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
          setBillArray({
            ...billArray,
            clients: []
          })

          // props.setBillInfo({
          //   start: moment(
          //     new Date(new Date().getTime() - 7 * 60 * 60 * 24 * 1000)
          //   ).format("YYYY-MM-DD"),
          //   end: moment(
          //     new Date(new Date().getTime() - 1 * 60 * 60 * 24 * 1000)
          //   ).format("YYYY-MM-DD"),
          //   client_id: [],
          // });
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
            {/* {clientId?.includes(row?.original?.client?._id) ? (
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
            ) : ( */}
            <Checkbox checked={billArray?.clients?.includes(row?.original?.client?._id)} className="border-red-700" onClick={() => {
              let c = clientData.filter(f => f._id === row?.original?.client?._id)
              if (billArray?.clients?.includes(row?.original?.client?._id)) {
                const clients = billArray.clients.filter(
                  (f) => f !== row?.original?.client?._id
                );
                setClientId(clients);
                setBillArray({
                  ...billArray,
                  clients
                })
                c.isSelected = false
              } else {
                const clients = billArray?.clients || [];
                clients.push(row?.original?.client?._id)
                c.isSelected = true
                setClientId(clients);
                console.log(clients)
                setBillArray({
                  ...billArray,
                  clients
                })
              }
              // setClientData([...clientData])

            }} sx={{
              color: 'red',
              '&.Mui-checked': {
                color: 'red',
              },
            }} />
            <button
              className="h-7 w-9 bg-white rounded-sm  flex justify-center items-center"
              // className="bg-white text-white py-1 px-2 rounded-md"
              onClick={() => {
                props.setIsRefresh({
                  ...props.isrefresh,
                  client_id: clientId
                })
                submits(row?.original?.client?._id)
                // clientId = [...clientId, row?.original?.client?._id];
                // setClientId(clientId);
              }}
            >
              <IoEyeSharp className="text-red-700 h-4 w-4 " />

              {/* Preview Invoice */}
            </button>


            {/* )} */}
          </div>
        )}
        {row.original.created &&
          <button
            className="bg-green-700 text-white py-1 px-2 rounded-md"
            onClick={() => {
              props.setBillId(row?.original?.invoice?._id)
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            Already Generated
          </button>

        }
      </div>
    );
  }

  return (
    <div className="border-2 border-red-700 rounded-lg p-5">
      <div className="flex mb-5 justify-between">
        {/* {billArray?.clientrange &&  */}
        <ExcelDownloder
          // filename={`client-${billArray.clientrange?.start} to ${billArray.clientrange?.end} `}
          type={Type.Button} // or type={'button'}
        >
          <button className="bg-red-700 text-white py-1 px-2 rounded-md mr-2" onClick={() => { console.log(billArray) }}>
            Excel
          </button>
        </ExcelDownloder>
        {/* } */}
        <button
          className="bg-green-700 text-white py-1 px-2 rounded-md"
          onClick={() => createInvoice()}
        >
          Generate Invoices
        </button>
      </div>
      <Table columns={columns} data={clientData} refs={props.refs} />
    </div>
  );
};
export default ClientList;
