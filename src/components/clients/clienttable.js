/* eslint-disable react-hooks/exhaustive-deps */
import Table, { indexID } from "../../../src/components/table"; // new { indexID }
import React, { useMemo, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { RiDeleteBinFill } from "react-icons/ri";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Api } from "../../services/service";
import { useRouter } from "next/router";

function ClientTable(props) {
  const router = useRouter();
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('')
  const [client, setClient] = useState({})
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        // Cell: indexID,
        accessor: "indexID",
      },
      {
        Header: "Name",
        accessor: "fullName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone",
        accessor: "phoneNumber",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: verifyCol,

      },
      {
        Header: "Action",
        Cell: ActionSection,
      },
    ],
    []
  );

  const onVerify = () => {
    props.loader(true);
    const data = {
      clientId: client._id,
      status: type
    }
    Api("post", "client/update", data, router).then(
      async (res) => {
        props.loader(false);
        if (res.status) {
          setClient({})
          setType('')
          props.getClientList()
        } else {
          props.toaster({ type: "success", message: res.message });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err.message });
        console.log(err);
      }
    );
  }

  function verifyCol({ value }) {
    return (
      <div className="flex justify-start items-center ">
        <p className={`${value === 'Verified' ? 'text-green-700' : 'text-red-700'}`}>{value}</p>
      </div>
    );
  };

  function ActionSection({ row }) {
    return (
      <div className="flex ">
        <div
          className="h-7 w-9 bg-red-700 rounded-sm ml-2 flex justify-center items-center cursor-pointer"
          onClick={() => {
            props.setClientID(row.original._id);
            props.setShowForm(true);
            props.goToTop();
          }}
        >
          <MdModeEditOutline className="text-white h-4 w-4 " />
        </div>
        <div
          className="h-7 w-9 bg-red-700 rounded-sm ml-2 flex justify-center items-center cursor-pointer"
          onClick={() => {
            props.deleteClient(row.original._id);
          }}
        >
          <RiDeleteBinFill className="text-white h-4 w-4 " />
        </div>
        {row.original.status === 'Verified' && <div
          className="h-7 w-20 px-2 bg-red-700 rounded-sm ml-2 flex justify-center items-center cursor-pointer"
          onClick={() => {
            setOpen(true)
            setClient(row.original)
            setType('Suspended')
          }}
        >
          <p className="text-white">Suspend</p>
        </div>}
        {row.original.status === 'Suspended' && <div
          className="h-7 px-2 w-20 bg-green-700 rounded-sm ml-2 flex justify-center items-center cursor-pointer"
          onClick={() => {
            setOpen(true)
            setClient(row.original)
            setType('Verified')
          }}
        >
          <p className="text-white">Verify</p>
        </div>}
      </div>
    );
  }

  function statusSection({ value }) {
    return <p className={`${"text-green-700"} text-semibold`}>Done</p>;
  }

  return (
    <>
      <Table columns={columns} data={props.data} />
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setClient({})
          setType('')
        }}
        aria-labelledby="draggable-dialog-title"
      >
        <div className="p-5 border-t-4  border-t-red-900 bg-customGray relative overflow-hidden">
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title" className="text-white">
            Alert
          </DialogTitle>
          <DialogContent>
            <DialogContentText className="text-white" >
              <p className="text-white" >  {
                `Do you want to ${type === 'Suspended' ? 'suspend' : 'verify'} this client ?`}</p>

            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button className={`border-2 border-white w-24 py-2  rounded-lg text-white`} autoFocus onClick={() => {
              setOpen(false)
            }}>
              Close
            </button>
            <button
              className={` w-24 py-2  rounded-lg text-white ${type === 'Suspended' ? 'bg-red-700' : 'bg-green-700'}`}
              onClick={() => {
                setOpen(false)
                onVerify()
              }}
            >
              {`${type === 'Suspended' ? 'Suspend' : 'Verify'}`}
            </button>
          </DialogActions>
        </div>
      </Dialog>
    </>

  );


}

export default ClientTable;
