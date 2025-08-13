/* eslint-disable react-hooks/exhaustive-deps */
import Table from "../table"; // new
import React, { useMemo, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaWindowRestore } from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";


const ArchiveTable = (props) => {
    console.log(props.excelData);
    const [open, setOpen] = useState(false);
    const [restore, setRestore] = useState(false);
    const [invoiceId, setInvoiiceId] = useState('');
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
            // {
            //     Header: "Status",
            //     accessor: "status",
            //     Cell: amountSection,
            // },
            {
                Header: "Action",
                Cell: ActionSection,
            },
        ],
        []
    );

    const columns2 = useMemo(
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
                    className="h-7 w-9 bg-white rounded-sm  flex justify-center items-center ml-2"
                    onClick={() => {
                        setRestore(true)
                        setInvoiiceId(row.original._id)
                        // props.resStoreInvoice(row.original._id);
                    }}
                >
                    <FaWindowRestore className="text-red-700 h-4 w-4 " />
                </div>
                <div
                    className="h-7 w-9 bg-red-700 rounded-sm ml-2 flex justify-center items-center"
                    onClick={() => {
                        setOpen(true)
                        setInvoiiceId(row.original._id)
                        // props.deleteInvoice(row.original._id);
                    }}
                >
                    <RiDeleteBinFill className="text-white h-4 w-4 " />
                </div>
            </div>
        );
    }

    const handleClose = () => {
        setOpen(false)
        setRestore(false)
    }
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
                    Are you sure?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {` You won't be able to revert this!`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setOpen(false)
                            props.deleteInvoice(invoiceId);
                        }}
                    >
                        Yes, delete it!
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={restore}
                onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
                    Are you sure?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {` Are you sure you want to restore this ?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setRestore(false)
                            props.resStoreInvoice(invoiceId);
                        }}
                    >
                        Yes, restore it!
                    </Button>
                </DialogActions>
            </Dialog>
            <Table
                columns={props?.from === "dashboard" ? columns2 : columns}
                data={props.data}
                from={props?.from}
            />
        </div>

    );
};
export default ArchiveTable;
