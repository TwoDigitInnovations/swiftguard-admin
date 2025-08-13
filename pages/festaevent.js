/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { Api } from "../src/services/service";
import React, { useEffect, useState, useMemo } from "react";
import Table, { indexID } from "../src/components/table"; // new
import { IoCloseCircleOutline, IoEyeSharp } from "react-icons/io5";
import { RiDeleteBinFill } from "react-icons/ri";
import moment from "moment";

const FestaEvent = (props) => {
  const router = useRouter();
  const [eventData, setEventData] = React.useState([]);
  const [eventInfo, setEventInfo] = React.useState({});

  useEffect(() => {
    getEvent();
  }, []);

  const getEvent = () => {
    props.loader(true);
    Api("get", "festa/get-event", "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          setEventData(res.data);
        } else {
          props.toaster({ type: "success", message: res?.message });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err.message });
        console.log(err);
      }
    );
  };

  const eventDelete = (row) => {
    props.loader(true);
    const data = {
      id: row?._id,
    };
    Api("post", "festa/delete-event", data, router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          getEvent();
        } else {
          props.toaster({ type: "success", message: res?.message });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err.message });
        console.log(err);
      }
    );
  };

  const eventCreate = () => {
    props.loader(true);
    Api("post", "festa/create-event", eventInfo, router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          getEvent();
        } else {
          props.toaster({ type: "success", message: res?.message });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err.message });
        console.log(err);
      }
    );
  };

  function ActiveStatus({ row }) {
    return (
      <div
        className="flex justify-start items-center"
        onClick={() => {
          eventDelete(row.original);
          // setSingalData(row.original);
          // handleClickOpen();
        }}
      >
        <div className="h-7 w-9 bg-white rounded-sm ml-2 flex justify-center items-center">
          <RiDeleteBinFill className="text-red-700 h-4 w-4 " />
        </div>
      </div>
    );
  }

  function date({ value, row }) {
    return (
      <div className="flex justify-start items-center ">
        <p className="text-white">
          {moment(new Date(row?.original?.event_date)).format("DD MMM, YYYY")}
        </p>
      </div>
    );
  }

  const columns = useMemo(
    () => [
      {
        Header: "No",
        // accessor: "event_date",
        Cell: indexID,
      },
      {
        Header: "Date",
        // accessor: "event_date",
        Cell: date,
      },
      {
        Header: "Singer",
        accessor: "singer",
      },
      {
        Header: "With",
        accessor: "with",
      },
      {
        Header: "Action",
        Cell: ActiveStatus,
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-black mt-16 overflow-x-auto">
      <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-3 rounded-sm  border-t-4 border-red-700 ">
        <div>
          <p className="text-white font-bold md:text-3xl text-lg">
            Create Event
          </p>
        </div>
      </div>
      <div className=" border-2 border-red-700 rounded-sm p-5 m-5">
        <div className="grid md:grid-cols-2 grid-cols-1 items-start">
          <div className="grid grid-cols-1 ">
            <p className="text-white text-lg font-semibold">{"Date"}</p>
            <input
              value={eventInfo.event_date}
              onChange={(text) => {
                setEventInfo({ ...eventInfo, event_date: text.target.value });
              }}
              type="date"
              className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 "
            />

            {/* {submitted && jobInfo.endDate === "" && (
                <p className="text-red-700 mt-1">
                  End Date and Time is required
                </p>
              )} */}
          </div>
          <div className="grid grid-cols-1 ml-3">
            <p className="text-white text-lg font-semibold">{"Singer"}</p>
            <input
              value={eventInfo.singer}
              onChange={(text) => {
                setEventInfo({ ...eventInfo, singer: text.target.value });
              }}
              type="text"
              className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 "
            />

            {/* {submitted && jobInfo.endDate === "" && (
                <p className="text-red-700 mt-1">
                  End Date and Time is required
                </p>
              )} */}
          </div>
          <div className="grid grid-cols-1">
            <p className="text-white text-lg font-semibold">{"With"}</p>
            <input
              value={eventInfo.with}
              onChange={(text) => {
                setEventInfo({ ...eventInfo, with: text.target.value });
              }}
              type="text"
              className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 "
            />

            {/* {submitted && jobInfo.endDate === "" && (
                <p className="text-red-700 mt-1">
                  End Date and Time is required
                </p>
              )} */}
          </div>
          <div className="flex justify-end mt-8">
            <button
              className="text-white bg-red-700 rounded-sm  text-md py-21 w-36 h-10"
              onClick={eventCreate}
            >
              Create
            </button>
          </div>
        </div>
      </div>
      <div className="px-5">
        <Table columns={columns} data={eventData} />
      </div>
    </div>
  );
};

export default FestaEvent;
