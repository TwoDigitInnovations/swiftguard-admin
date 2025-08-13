/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Table from "../../../src/components/table"; // new
import React, { useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import { IoCloseCircleOutline, IoEyeSharp } from "react-icons/io5";
import Image from "next/image";

const ActivityTable = (props) => {
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState("");
  const columns = useMemo(
    () => [
      {
        Header: "Guard Name",
        accessor: "name",
      },
      // {
      //   Header: "SIA Batch",
      //   accessor: "sia",
      // },
      {
        Header: "Job ID",
        accessor: "job",
      },
      {
        Header: "Date & Time",
        accessor: "date",
      },
      {
        Header: "Issue",
        accessor: "title",
      },
      {
        Header: "Details",
        accessor: "details",
        Cell: Details
      },
      {
        Header: "Image",
        Cell: images,
      },
    ],
    [images]
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function Details({ value }) {
    return (
      <p className=" w-80 text-balance flex-nowrap whitespace-normal text-white">{value}</p>
    );
  }

  function images({ row }) {
    console.log(row);
    return (
      <img
        onClick={() => {
          setImage(`${row?.original?.url}/${row?.original?.photos[0]?.key || row?.original?.photos?.key}`);
          handleClickOpen();
        }}
        className="h-10 w-10 rounded-md object-cover"
        src={`${row?.original?.url}/${row?.original?.photos[0]?.key || row?.original?.photos?.key}`}
      />
    );
  }

  return (
    <>
      <Table columns={columns} data={props.data} />
      <Dialog open={open} onClose={handleClose}>
        <div className="p-5 border-2  border-red-900 bg-black relative overflow-hidden">
          <IoCloseCircleOutline
            className="text-red-700 h-8 w-8 absolute right-2 top-2"
            onClick={handleClose}
          />

          <div className="flex flex-col  justify-center mt-5">
            <div className="md:w-80 md:h-auto w-60 h-auto relative rounded-lg ">
              <img src={image} className="rounded-sm  w-full object-contain" />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
export default ActivityTable;
