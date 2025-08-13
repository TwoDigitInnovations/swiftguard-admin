/* eslint-disable react-hooks/exhaustive-deps */
import CustomCalendarTable from "./customCalendar";
import React, { useEffect, useMemo, useState, useContext } from "react";
import { IoChevronBack, IoChevronForward, IoRepeat } from "react-icons/io5";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import { ImLink } from "react-icons/im";
import moment from "moment";
import Tooltip from "@mui/material/Tooltip";
import { Api } from "../../../src/services/service";
import Stickytables from "./stickytables";

const WeekDayTable = (props) => {
  const [week, setWeek] = useState();
  const [dateArray, setDateArray] = useState([]);
  const [cols, setCols] = useState([]);
  const [data, setData] = useState([]);
  const [dateObj, setDateObj] = useState({});
  const [wo, setWo] = useState([]);
  const [t, setT] = useState();

  console.log(week)

  useEffect(() => {
    setData([]);


    if (!!props.data) {
      setDataTable();
    }
    console.log(props.date)
    // setDateObj(props.date);
  }, [props.data]);

  const setDataTable = () => {
    const d = [];

    props.data.forEach((ele, index) => {
      let obj = {};
      obj.name = ele.name;
      obj.event1 = [];
      obj.event2 = [];
      obj.event3 = [];
      obj.event4 = [];
      obj.event5 = [];
      obj.event6 = [];
      obj.event7 = [];
      obj.event8 = {
        sd: props.date.startDate,
        ed: props.date.endDate,
      };

      ele?.jobs?.forEach((el, i) => {
        dateArray.forEach(function (e, i) {
          // console.log(
          //   moment(e).format("yyyy-MM-DD"),
          //   moment(el.startDate).format("yyyy-MM-DD")
          // );
          if (
            moment(e).format("yyyy-MM-DD") ===
            moment(el.startDate).format("yyyy-MM-DD")
          ) {
            el = {
              ...el,
              sd: dateObj.startDate,
              ed: dateObj.endDate,
            };
            obj["event" + (i + 1)].push(el);
          }
        });

        if (ele?.jobs.length === i + 1) {
          d.push(obj);
        }
        if (props.data.length === index + 1) {
          setData(d);
        }
      });
    });
  };

  function getISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    const temp = {
      d: ISOweekStart.getDate(),
      m: ISOweekStart.getMonth(),
      y: ISOweekStart.getFullYear(),
    };
    const numDaysInMonth = new Date(temp.y, temp.m + 1, 0).getDate();

    return Array.from({ length: 7 }, (_) => {
      if (temp.d > numDaysInMonth) {
        temp.m += 1;
        temp.d = 1;
      }
      return new Date(temp.y, temp.m, temp.d++).toUTCString();
    });
  }

  useMemo(() => {
    var col = [];
    // var currentDate = new Date();
    // var startDate = new Date(currentDate.getFullYear(), 0, 1);
    // var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    // var year = moment(currentDate).format("yyyy");
    // var Number = Math.ceil(days / 7);
    // setWeek(Math.ceil(days / 7));
    // const weekNumber = `${Number} ${year}`;
    // const weekYearArr = weekNumber.split(" ").map((n) => parseInt(n));
    // const weekOut = getISOWeek(...weekYearArr);
    setWeek(moment().week())
    const firstDay = moment().startOf("isoweek").toDate()
    const weekOut = [
      new Date(firstDay),
      new Date(firstDay).setDate(firstDay.getDate() + 1),
      new Date(firstDay).setDate(firstDay.getDate() + 2),
      new Date(firstDay).setDate(firstDay.getDate() + 3),
      new Date(firstDay).setDate(firstDay.getDate() + 4),
      new Date(firstDay).setDate(firstDay.getDate() + 5),
      new Date(firstDay).setDate(firstDay.getDate() + 6),
      // new Date(firstDay).setDate(firstDay.getDate() + 7),
    ]
    // setWo(weekOut);
    setDateArray(weekOut);
    // const t = new Date(weekOut[weekOut.length - 1]);
    // // t.setDate(t.getDate() + 1);
    // setT(t);

    props.getAllJobs(
      moment(weekOut[0]).format(),
      moment(weekOut[6]).format()
      // moment(t).format()
    );
    // props.getAllJobs(
    //   moment(
    //     new Date(
    //       new Date(weekOut[0]).setDate(new Date(weekOut[0]).getDate() - 3)
    //     )
    //   ).format(),
    //   moment(t).format()
    // );
    col.push({
      Header: "Clients",
      accessor: "name",
      sticky: "left",
      Cell: clientsName
    });
    weekOut.forEach((element, index) => {
      col.push({
        // Header: `${moment(new Date(element)).format("ddd")}-${moment(
        //   new Date(element)
        // ).format("yyyy/MM/DD")}`,
        Header: `${moment(new Date(element)).format("ddd-yyyy/MM/DD")}`,
        accessor: `event${index + 1}`,
        Cell: eventCell,
      });
    });
    setCols(col);
    setDateObj({
      startDate: moment(weekOut[0]).format("yyyy/MM/DD"),
      endDate: moment(t).format("yyyy/MM/DD"),
    });

    // return col;
  }, []);

  const backWeek = () => {
    const tomorrow = new Date(dateArray[0]);
    tomorrow.setDate(tomorrow.getDate() - 2);
    var col = [];
    // var currentDate = tomorrow;
    // var startDate = new Date(currentDate.getFullYear(), 0, 1);
    // var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    // var year = moment(currentDate).format("yyyy");
    // var Number = Math.ceil(days / 7);
    // setWeek(Math.ceil(days / 7));
    // const weekNumber = `${Number} ${year}`;
    // const weekYearArr = weekNumber.split(" ").map((n) => parseInt(n));
    // const weekOut = getISOWeek(...weekYearArr);
    setWeek(week - 1)
    const firstDay = moment(tomorrow).startOf("isoweek").toDate()
    const weekOut = [
      new Date(firstDay),
      new Date(firstDay).setDate(firstDay.getDate() + 1),
      new Date(firstDay).setDate(firstDay.getDate() + 2),
      new Date(firstDay).setDate(firstDay.getDate() + 3),
      new Date(firstDay).setDate(firstDay.getDate() + 4),
      new Date(firstDay).setDate(firstDay.getDate() + 5),
      new Date(firstDay).setDate(firstDay.getDate() + 6),
      // new Date(firstDay).setDate(firstDay.getDate() + 7),
    ]
    // setWo(weekOut);
    setDateArray(weekOut);
    // const t = new Date(weekOut[weekOut.length - 1]);
    // // t.setDate(t.getDate() + 1);
    // setT(t);
    setDateObj({
      startDate: moment(weekOut[0]).format(),
      endDate: moment(weekOut[6]).format(),
    });
    props.getAllJobs(moment(weekOut[0]).format(), moment(weekOut[6]).format());
    col.push({
      Header: "Clients",
      accessor: "name",
      sticky: "left",
      Cell: clientsName
    });
    weekOut.forEach((element, index) => {
      col.push({
        // Header: `${moment(new Date(element)).format("ddd")}-${moment(
        //   new Date(element)
        // ).format("yyyy/MM/DD")}`,
        Header: `${moment(new Date(element)).format("ddd-yyyy/MM/DD")}`,
        accessor: `event${index + 1}`,
        Cell: eventCell,
      });
    });
    setCols(col);
  };

  const nextWeek = () => {
    const tomorrow = new Date(dateArray[dateArray.length - 1]);
    tomorrow.setDate(tomorrow.getDate() + 3);
    var col = [];
    // var currentDate = tomorrow;
    // var startDate = new Date(currentDate.getFullYear(), 0, 1);
    // var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    // var year = moment(currentDate).format("yyyy");
    // var Number = Math.ceil(days / 7);
    // setWeek(Math.ceil(days / 7));
    // const weekNumber = `${Number} ${year}`;
    // const weekYearArr = weekNumber.split(" ").map((n) => parseInt(n));
    // const weekOut = getISOWeek(...weekYearArr);
    setWeek(week + 1)
    const firstDay = moment(tomorrow).startOf("isoweek").toDate()
    const weekOut = [
      new Date(firstDay),
      new Date(firstDay).setDate(firstDay.getDate() + 1),
      new Date(firstDay).setDate(firstDay.getDate() + 2),
      new Date(firstDay).setDate(firstDay.getDate() + 3),
      new Date(firstDay).setDate(firstDay.getDate() + 4),
      new Date(firstDay).setDate(firstDay.getDate() + 5),
      new Date(firstDay).setDate(firstDay.getDate() + 6),
      // new Date(firstDay).setDate(firstDay.getDate() + 7),
    ]
    setWo(weekOut);
    setDateArray(weekOut);
    const t = new Date(weekOut[weekOut.length - 1]);
    // t.setDate(t.getDate() + 1);
    setT(t);
    setDateObj({
      startDate: moment(weekOut[0]).format(),
      endDate: moment(t).format(),
    });
    console.log(weekOut);
    props.getAllJobs(moment(weekOut[0]).format(), moment(t).format());
    col.push({
      Header: "Clients",
      accessor: "name",
      sticky: "left",
      Cell: clientsName
    });

    weekOut.forEach((element, index) => {
      col.push({
        // Header: `${moment(new Date(element)).format("ddd")}-${moment(
        //   new Date(element)
        // ).format("yyyy/MM/DD")}`,
        Header: `${moment(new Date(element)).format("ddd-yyyy/MM/DD")}`,
        accessor: `event${index + 1}`,
        Cell: eventCell,
      });
    });
    setCols(col);
  };

  const deleteTask = (id, task) => {
    console.log(task)
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

  function clientsName({ value, row }) {
    // console.log(row)
    return (
      <div>
        <p >{row.index + 1}. {value}</p>
      </div>
    );
  }

  function eventCell({ value, row }) {
    return (
      <div className="w-32">
        {!!value ? (
          <div className="w-full">
            {value?.map((item, index) => {
              let d = item?.invites?.filter(
                (f) =>
                  f.job_status === "ACTIVE" &&
                  (f.status === "ACCEPTED" || f.status === "ASSIGNED")
              );
              const R = item?.invites?.filter((f) => f.status === "REJECTED");
              let c = []
              if (d?.length) {
                c = d?.filter(f => f.start)
              }
              return (
                <div
                  className={`${item?.applicant?.length > 0 &&
                    d !== undefined &&
                    item.applicant?.length === item?.person
                    ? "bg-green-700"
                    : R !== undefined && R?.length === item?.person
                      ? "bg-red-700"
                      : "bg-yellow-500"
                    } p-2 m-1 rounded-sm w-full`}
                  key={index}
                >
                  {/* <p className="text-white f11">Title : {item.title}</p> */}
                  <p className="text-white f11">
                    Start Time:{" "}
                    {moment(new Date(item?.startDate)).format("hh:mm A")}
                  </p>
                  <p className="text-white f11">
                    End Time:{" "}
                    {moment(new Date(item?.endDate)).format("hh:mm A")}
                  </p>

                  <p className="text-white f11">Rate: £{item?.amount}</p>

                  <p className="text-white f11">
                    Assign:{" "}
                    {d?.length === 1 &&
                      item?.person === 1 &&
                      d?.[0].invited?.fullName.split(" ")[0]}
                  </p>

                  <div className="flex justify-start items-end mt-1">
                    {/* {item?.invites?.length > 0 && !item.public && ( */}
                    <Tooltip title={<p>Status</p>} arrow>
                      <div
                        className={`w-4 h-4  ${item?.applicant?.length > 0 ||
                          item?.invites?.length > 1 ||
                          (item?.invites?.length > 0 &&
                            item?.invites[0]?.invited)
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
                          props.setAssignedUser(item?.invites);
                          props.setShowStatus(true);
                        }}
                      >
                        <ImLink
                          className={` ${item?.applicant?.length > 0 ||
                            item?.invites?.length > 1 ||
                            (item?.invites?.length > 0 &&
                              item?.invites[0]?.invited)
                            ? "text-black"
                            : "text-white"
                            }  text-md`}
                        />
                        {/* <ImLink className="text-black text-md" /> */}
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
                          // props.goToTop();
                          // props.setShowForm(true);
                          props.getGuardList(item?.applicant);
                          props.setJobID(item?._id);
                          // props.setRepeat("Repeat Task");
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
                          // props.goToTop();
                          props.getGuardList(item?.applicant);
                          props.setIsOpen(true);
                          props.setJobID(item?._id);
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
                          props.setJobID(item?._id);
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
                          deleteTask(item?._id, row.original.event8);
                        }}
                      >
                        <MdDeleteForever className="text-black text-lmd" />
                      </div>
                    </Tooltip>
                    {d?.length > 0 && <div
                      className={`w-4 h-4 ${c?.length === item.person ? 'bg-green-500' : "bg-yellow-500"} rounded-sm flex justify-center items-center`}
                    >
                    </div>}
                    {/* {d.length > 0 && <div
                      className={`w-4 h-4 bg-white rounded-sm flex justify-center items-center`}
                    >
                      <p className={`${d[0].start ? 'bg-green-700' : "bg-yellow-500"} h-2 w-2 rounded-full`}></p>
                    </div>} */}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="md:mx-5 mx-3 flex flex-col  overflow-hidden" style={{ height: "calc(100vh - 175px)" }}>
      <div className=" bg-stone-900  rounded-sm border-t-4 border-red-700  relative">
        <div className="grid md:grid-cols-3 grid-cols-3 items-center bg-stone-900 md:px-5 p-3 rounded-sm   relative">
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
          <div className=" md:block hidden">
            <p className="text-white text-center text-lg ">
              {" "}
              WK - {week} ({moment(new Date(dateArray[0])).format("yyyy/MM/DD")} -{" "}
              {moment(new Date(dateArray[dateArray.length - 1])).format(
                "yyyy/MM/DD"
              )})
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
              <button className="text-white px-3 md:h-10 h-7 bg-red-700 border-red-700 rounded-sm md:text-md f10">
                Week
              </button>
              <button
                className="text-white px-3 md:h-10 h-7 hover:bg-red-700 md:text-md f10"
                onClick={() => {
                  props?.setShowCal("today");
                }}
              >
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
          <p className="text-white text-center md:text-3xl f10 pb-1">
            {" "}
            WK - {week} ( {moment(new Date(dateArray[0])).format("yyyy/MM/DD")}{" "}
            -{" "}
            {moment(new Date(dateArray[dateArray.length - 1])).format(
              "yyyy/MM/DD"
            )}{" "}
            )
          </p>
        </div>
      </div>
      <div className=" w-full overflow-hidden ">
        {/* <div className="grid grid-cols-8 bg-white w-full">
          <div clientsName='border border-r-'>Client</div>
        </div> */}
        <div className="h-full overflow-auto">
          <Stickytables columns={cols} data={data} type='week' />
        </div>

        {/* <CustomCalendarTable columns={cols} data={data} type='week' /> */}
      </div>
    </div>
  );
};
export default WeekDayTable;
