/* eslint-disable react-hooks/exhaustive-deps */
import CustomCalendarTable from "./customCalendar";
import React, { useEffect, useMemo, useState } from "react";
import { IoChevronBack, IoChevronForward, IoRepeat } from "react-icons/io5";
import { FaUserCheck } from "react-icons/fa";
import moment from "moment";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { ImLink } from "react-icons/im";
import Tooltip from "@mui/material/Tooltip";
import { Api } from "../../../src/services/service";
import Stickytables from "./stickytables";



const TodayTable = (props) => {
  const [curruntDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [dateObj, setDateObj] = useState(props.date);

  useEffect(() => {
    if (!!props.data) {
      setDataTable();
    }
  }, [props.data]);

  const setDataTable = () => {
    const d = [];
    setData([]);
    props?.data.forEach((ele, index) => {
      // obj.event = [];
      // obj.time = [];

      // ele?.jobs?.forEach((el, i) => {
      //   obj.event.push({
      //     startTime: el.startTime,
      //     endTime: el.endTime,
      //     rate: el.amount,
      //     staff: el.startDate,
      //   });
      //   obj.time.push({
      //     startTime: moment(el.startTime, "HH:mm").format("hh:mm A"),
      //     endTime: moment(el.endTime, "HH:mm").format("hh:mm A"),
      //   });

      ele?.jobs?.forEach((el, i) => {
        if (
          moment(el.startDate).format("DD/MM/YYYY") ===
          moment(curruntDate).format("DD/MM/YYYY")
        ) {
          el = {
            ...el,
            sd: props.date.startDate,
            ed: props.date.endDate,
          };
          let obj = {};
          obj.name = i == 0 ? ele.name : "";
          obj.event = el;
          obj.time = {
            startTime: moment(el.startDate).format("hh:mm A"),
            endTime: moment(el.endDate).format("hh:mm A"),
          };
          d.push(obj);
          setData(d);
        }

        // if (ele?.jobs.length === i + 1) {
        //   d.push(obj);
        //   setData(d);
        // }
        // if (props?.data.length === index + 1) {
        //   setData(d);
        // }
      });
    });
  };

  function dateRange(startDate, endDate, steps = 1) {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dateArray.push(new Date(currentDate));
      // Use UTC date to prevent problems with time zones and DST
      currentDate = moment(new Date(currentDate, "YYYY/MM/DD")).add(
        steps,
        "days"
      );
      // currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }

    return dateArray;
  }

  const columns = useMemo(
    () => [
      {
        Header: "Clients",
        accessor: "name",
        sticky: "left",
        Cell: clientsName
      },
      {
        Header: "Time",
        accessor: "time",
        Cell: timeCell,
      },
      {
        Header: "Detail",
        accessor: "event",
        Cell: eventCell,
      },
    ],
    []
  );

  useEffect(() => {
    props.getAllJobs(
      // moment(new Date(new Date().setDate(new Date().getDate()))).format(
      //   "yyyy/MM/DD"
      // ),
      // moment(new Date(new Date().setDate(new Date().getDate() + 1))).format(
      //   "yyyy/MM/DD"
      // )
      moment(new Date().setHours(0, 0, 0, 0)).format(),
      moment(new Date().setHours(0, 0, 0, 0)).format()
    );
  }, []);

  const backWeek = () => {
    setCurrentDate(new Date(curruntDate.setDate(curruntDate.getDate() - 1)));
    props.getAllJobs(
      // moment(new Date(curruntDate.setDate(curruntDate.getDate()))).format(
      //   "yyyy/MM/DD"
      // ),
      // moment(new Date(curruntDate.setDate(curruntDate.getDate() + 1))).format(
      //   "yyyy/MM/DD"
      // )
      moment(new Date(curruntDate).setHours(0, 0, 0, 0)).format(),
      moment(new Date(curruntDate).setHours(0, 0, 0, 0)).format()
    );

    // props.getAllJobs(
    //   moment(curruntDate).format(),
    //   moment(new Date(curruntDate.setDate(curruntDate.getDate() + 1))).format()
    // );
  };

  const nextWeek = () => {
    setCurrentDate(new Date(curruntDate.setDate(curruntDate.getDate() + 1)));
    props.getAllJobs(
      // moment(new Date(curruntDate.setDate(curruntDate.getDate()))).format(
      //   "yyyy/MM/DD"
      // ),
      // moment(new Date(curruntDate.setDate(curruntDate.getDate() + 1))).format(
      //   "yyyy/MM/DD"
      // )
      moment(new Date(curruntDate).setHours(0, 0, 0, 0)).format(),
      moment(new Date(curruntDate).setHours(0, 0, 0, 0)).format()
    );

    // props.getAllJobs(
    //   moment(curruntDate).format(),
    //   moment(new Date(curruntDate.setDate(curruntDate.getDate() + 5))).format()
    // );
  };

  const deleteTask = (id, task) => {
    props.loader(true);
    Api("delete", `jobs/${id}`, "", props.router).then(
      async (res) => {
        props.loader(false);
        if (res.status) {
          props.getAllJobs(moment(task.sd).format(), moment(task.ed).format());
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
  };

  function eventCell({ value, row }) {
    let d = value?.invites?.filter(
      (f) =>
        f.job_status === "ACTIVE" &&
        (f.status === "ACCEPTED" || f.status === "ASSIGNED")
    );
    const R = value?.invites?.filter((f) => f.status === "REJECTED");
    let c = []
    if (d?.length) {
      c = d?.filter(f => f.start)
    }
    return (
      <div className="w-32">
        {!!value ? (
          <div
            className={`${value?.applicant.length > 0 &&
              d !== undefined &&
              value?.applicant?.length === value?.person
              ? "bg-green-700"
              : R !== undefined && R?.length === value?.person
                ? "bg-red-700"
                : "bg-yellow-500"
              } p-2 m-1 rounded-sm w-32`}

          // className={`${
          //   value?.applicant.length > 0 ||
          //   (d !== undefined && d?.length === value?.invites?.length)
          //     ? "bg-green-700"
          //     : R?.length === value?.invites?.length
          //     ? "bg-red-900"
          //     : "bg-yellow-500"
          // }  p-2 m-1 rounded-sm w-full`}
          >
            {/* <p className="text-white f11">Title : {value?.title}</p> */}
            <p className="text-white f11">
              Start Time: {moment(value?.startDate).format("hh:mm A")}
            </p>
            <p className="text-white f11">
              End Time: {moment(value?.endDate).format("hh:mm A")}
            </p>
            <p className="text-white f11">Rate: £{value?.amount}</p>

            <p className="text-white f11">
              Assign:{" "}
              {d?.length === 1 &&
                value?.person === 1 &&
                d?.[0].invited?.fullName.split(" ")[0]}
            </p>

            <div className="flex justify-start items-end mt-1">
              {/* {value?.invites?.length > 0 && !value.public && ( */}
              <Tooltip title={<p>Status</p>} arrow>
                <div
                  className={`marker:w-4 h-4 ${value?.applicant?.length > 0 ||
                    value?.invites?.length > 1 ||
                    (value?.invites?.length > 0 && value?.invites[0]?.invited)
                    ? "bg-white"
                    : "bg-red-700"
                    } rounded-sm flex justify-center items-center mr-1`}
                  onClick={() => {
                    if (
                      props?.organization?._id === undefined &&
                      props?.user?.type === "ADMIN"
                    ) {
                      props.toaster({
                        type: "warning",
                        message: "Please select any organization",
                      });
                      return;
                    }
                    props.setAssignedUser(value?.invites);
                    props.setShowStatus(true);
                  }}
                >
                  <ImLink
                    className={` ${value?.applicant?.length > 0 ||
                      value?.invites?.length > 1 ||
                      (value?.invites?.length > 0 && value?.invites[0]?.invited)
                      ? "text-black"
                      : "text-white"
                      }  text-md`}
                  />
                </div>
              </Tooltip>
              {/* )} */}
              <Tooltip title={<p>Assign</p>} arrow>
                <div
                  className="w-4 h-4 bg-white rounded-sm flex justify-center items-center mr-1"
                  onClick={() => {
                    if (
                      props?.organization?._id === undefined &&
                      props?.user?.type === "ADMIN"
                    ) {
                      props.toaster({
                        type: "warning",
                        message: "Please select any organization",
                      });
                      return;
                    }
                    props.setOpenDialog(true);
                    props.getGuardList(value?.applicant);
                    props.setJobID(value?._id);
                  }}
                >
                  <FaUserCheck className="text-black text-md" />
                </div>
              </Tooltip>
              <Tooltip title={<p>Repeat</p>} arrow>
                <div
                  className="w-4 h-4 bg-white rounded-sm flex justify-center items-center mr-1"
                  onClick={() => {
                    if (
                      props?.organization?._id === undefined &&
                      props?.user?.type === "ADMIN"
                    ) {
                      props.toaster({
                        type: "warning",
                        message: "Please select any organization",
                      });
                      return;
                    }
                    props.getGuardList(value?.applicant);
                    props.setIsOpen(true);
                    props.setJobID(value?._id);
                    // props.goToTop();
                    // props.setShowForm(true);
                    // props.setJobID(value?._id);
                    // props.setRepeat("Repeat Task");
                  }}
                >
                  <IoRepeat className="text-black text-md" />
                </div>
              </Tooltip>
              <Tooltip title={<p>Edit</p>} arrow>
                <div
                  className="w-4 h-4 bg-white rounded-sm flex justify-center items-center mr-1"
                  onClick={() => {
                    props.goToTop();
                    props.setShowForm(true);
                    props.setJobID(value?._id);
                    props.setRepeat("Update Task");
                  }}
                >
                  <MdModeEditOutline className="text-black text-md" />
                </div>
              </Tooltip>
              <Tooltip title={<p>Delete</p>} arrow>
                <div
                  className="w-4 h-4 bg-white rounded-sm flex justify-center items-center mr-1"
                  onClick={() => {
                    deleteTask(value?._id, row.original.event);
                    // deleteTask(value?._id);
                  }}
                >
                  <MdDeleteForever className="text-black text-md" />
                </div>
              </Tooltip>
              {d?.length > 0 && <div
                className={`w-4 h-4 ${c?.length === value.person ? 'bg-green-500' : "bg-yellow-500"} rounded-sm flex justify-center items-center`}
              >
              </div>}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // function eventCell({ value }) {
  //   return (
  //     <div>
  //       {!!value ? (
  //         <div>
  //           {value?.map((item, index) => (
  //             <div className="bg-green-700 p-2 m-1 rounded-md" key={index}>
  //               <p className="text-white">Start Time : {item?.startTime}</p>
  //               <p className="text-white">End Time : {item?.endTime}</p>
  //               <p className="text-white">Rate : {item?.rate}</p>
  //               <p className="text-white">Staff : {item?.staff}</p>
  //             </div>
  //           ))}
  //         </div>
  //       ) : null}
  //     </div>
  //   );
  // }

  // function timeCell({ value }) {
  //   return (
  //     <div>
  //       {!!value ? (
  //         <div>
  //           {value?.map((item, index) => (
  //             <p key={index}>
  //               {item?.startTime} - {item?.endTime}
  //             </p>
  //           ))}
  //         </div>
  //       ) : null}
  //     </div>
  //   );
  // }

  function timeCell({ value }) {
    return (
      <div>
        {!!value ? (
          <p>
            {value?.startTime} - {value?.endTime}
          </p>
        ) : null}
      </div>
    );
  }

  function clientsName({ value, row }) {
    console.log(row)
    return (
      <div>
        <p >{row.index + 1}. {value}</p>
      </div>
    );
  }

  return (
    <div className="md:mx-5 mx-3">
      <div className=" bg-stone-900  rounded-sm border-t-4 border-red-700  relative">
        <div className="grid md:grid-cols-4 grid-cols-3 items-center bg-stone-900 md:px-5 p-3 rounded-sm   relative">
          <div className="col-span-1">
            <div
              className="md:h-10 h-7 md:w-12 w-8 rounded-md border-2 border-red-700 flex items-center justify-center cursor-pointer bg-black"
              onClick={() => {
                backWeek();
              }}
            >
              <IoChevronBack className="text-white md:text-xl text-xs" />
            </div>
          </div>
          <div className=" md:block hidden col-span-2">
            <p className="text-white text-center text-lg ">
              {" "}
              {curruntDate.toString()}{" "}
            </p>
          </div>
          <div className="flex items-center justify-end w-full md:col-span-1 col-span-2">
            <div className="flex md:h-10 h-7 border-2 border-red-700 rounded-sm items-center justify-center md:mr-5 mr-1 bg-black">
              <button
                className="text-white px-3 md:h-10 h-7 hover:bg-red-700 md:text-md f10"
                onClick={() => {
                  props?.setShowCal("month");
                }}
              >
                Month
              </button>
              <button
                onClick={() => {
                  props?.setShowCal("week");
                }}
                className="text-white px-3 md:h-10 h-7 hover:bg-red-700  rounded-sm f10  md:text-md"
              >
                Week
              </button>
              <button className="text-white px-3 md:h-10 h-7 bg-red-700 border-red-700 md:text-md f10">
                Today
              </button>
            </div>
            <div
              className="md:h-10 h-7 md:w-12 w-8 rounded-md border-2 border-red-700 flex items-center justify-center cursor-pointer bg-black"
              onClick={nextWeek}
            >
              <IoChevronForward className="text-white md:text-xl text-xs" />
            </div>
          </div>
        </div>
        <div className=" md:hidden block">
          <p className="text-white text-center md:text-xl pb-1 f10">
            {curruntDate.toString()}
          </p>
        </div>
      </div>
      <div className=" w-full overflow-hidden ">
        <div className="h-full overflow-auto">
          <Stickytables columns={columns} data={data} type='week' />
        </div>

      </div>

      {/* <CustomCalendarTable columns={columns} data={data} /> */}
    </div>
  );
};
export default TodayTable;
