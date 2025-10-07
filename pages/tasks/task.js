/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useContext, useMemo } from "react";
import { useRouter } from "next/router";
import { Api } from "../../src/services/service";
import Table, { indexID } from "../../src/components/table";
import CreateTask from "../../src/components/task/createTask";
import CustomCalendarTable from "../../src/components/task/customCalendar";
import WeekDayTable from "../../src/components/task/weekDayTable";
import TodayTable from "../../src/components/task/todayTable";

import Dialog from "@mui/material/Dialog";
import { IoList, IoChevronBack, IoCloseCircleOutline } from "react-icons/io5";
import { MultiSelect } from "react-multi-select-component";
import { Context, userContext } from "../../pages/_app";
import { CalendarTable } from "../../src/components/calendarTable";
import Modal from "react-modal";
import moment from "moment";
import CountUp from "react-countup";

const Task = (props) => {
  const router = useRouter();
  const [dashStatus, setDashStatus] = useState({})
  const [user, setUser] = useContext(userContext);
  const [jobList, setJobList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCal, setShowCal] = useState(router?.query?.type || "week");
  const [jobID, setJobID] = useState("");
  const [adminjobList, setAdminjobList] = useState([]);
  const [dateObj, setDateObj] = useState({
    startDate: "",
    endDate: "",
  });
  const [repeat, setRepeat] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [opt, setOpt] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showStatus, setShowStatus] = useState(false);
  const [assinedUser, setAssignedUser] = useState([]);
  const [guardList, setGuardList] = React.useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [selectedLenght, setLength] = React.useState(0);
  const [jobInfo, setJobInfo] = useState({
    currentWeek: false,
    nextWeek: false,
    startDate: "",
    endDate: "",
    repeatType: "Daily",
  });

  const [days, setDays] = useState([
    {
      day: "Mon",
      value: 1,
      selected: false,
    },
    {
      day: "Tue",
      value: 2,
      selected: false,
    },
    {
      day: "Wed",
      value: 3,
      selected: false,
    },
    {
      day: "Thu",
      value: 4,
      selected: false,
    },
    {
      day: "Fri",
      value: 5,
      selected: false,
    },
    {
      day: "Sat",
      value: 6,
      selected: false,
    },
    {
      day: "Sun",
      value: 0,
      selected: false,
    },
  ]);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "50%",
      transform: "translate(-50%, -50%)",
      background: "black",
      borderRadius: "10px",
      // padding: "0px",
    },
  };

  // useEffect(() => {}, [adminjobList]);

  // const ctx = useMemo(
  //   () => ({
  //     value: dateObj,
  //     setValue: (newValue) => {
  //       setDateObj(newValue);

  //     },
  //   }),
  //   [dateObj]
  // );

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  const getGuardList = (item) => {

    props.loader(true);
    Api("post", "user/guardList", "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          let options = [];
          res.data.guards.forEach((ele, index) => {
            options.push({
              label: ele.fullName,
              value: ele._id,
              // disabled: false,
              // rate: ele.rate,
              // address: ele.address,
            });
            if (res.data.guards.length === index + 1) {
              if (item !== undefined) {
                setAssignedUser(item);
                const opts = options.filter((el) => {
                  return item?.find((element) => {
                    return element === el.value;
                  });
                });
                setSelected(opts);
              }
              const o = options.sort((a, b) => {
                return a.label.toLowerCase() - b.label.toLowerCase();
              });
              // options.sort((a, b) => a.label - b.label)
              setOpt(o);
            }
          });
          setGuardList(res.data.guards);
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

  const getJobs = () => {
    props.loader(true);
    setJobID("");
    Api("get", "user/jobs", "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          setJobList(res.data.jobs);
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



  const getAllJobs = (startDate, endDate) => {
    setUser({
      ...user,
      startDate,
      endDate,
    });

    let data = {
      startDate,
      endDate,
      // org_id:
    };

    if (props?.organization?._id) {
      data = {
        ...data,
        org_id: props?.organization?._id,
      };
    }

    props.loader(true);
    setJobID("");
    Api("post", "admin/jobs", data, router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          setDateObj({ startDate, endDate });
          // setJobList(res.data.jobs);
          setAdminjobList(res.data.jobs);
          setDashStatus({
            pendingJob: res?.data?.pendingJob || 0,
            totalJobs: res?.data?.totalJobs || 0
          })
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

  const updateTask = () => {
    getAllJobs(dateObj.startDate, dateObj.endDate);
  };

  const assignJob = () => {
    props.loader(true);
    let assignId = [];
    selected.forEach((ele) => {
      if (assinedUser.length > 0) {
        assinedUser.forEach((e) => {
          if (ele?.value !== e && !assignId?.includes(ele.value)) {
            assignId.push(ele.value);
          }
        });
      } else {
        assignId.push(ele.value);
      }
    });
    const data = {
      applicant: assignId,
    };
    Api("post", `admin/jobs/${jobID}/assign`, data, router).then(
      async (res) => {
        props.loader(false);
        if (res.status) {
          setSelected([]);
          setJobID("");
          assignId = [];
          setAssignedUser([]);
          updateTask();
          props.toaster({ type: "success", message: res.data.message || "" });
        } else {
          props.toaster({ type: "success", message: res.message });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err.message });
      }
    );
  };

  const repeatJob = () => {
    if (jobInfo?.startDate === "" || jobInfo?.endDate === "") {
      setSubmitted(true);
      return;
    }

    let assignId = [];
    selected.forEach((ele) => {
      // if (assinedUser.length > 0) {
      //   assinedUser.forEach((e) => {
      //     if (ele?.value !== e) {
      //       assignId.push(ele.value);
      //     }
      //   });
      // } else {
      assignId.push(ele.value);
      // }
    });
    let repeat = [] || "";
    if (jobInfo?.repeatType === "Weekly") {
      days.forEach((ele) => {
        if (ele.selected) {
          repeat.push(ele.value);
        }
      });
    } else {
      repeat = 1;
    }
    setLength(repeat.length);
    if (jobInfo?.repeatType === "Weekly" && repeat.length === 0) {
      setSubmitted(true);
      props.toaster({ type: "error", message: "please select the day(s)" });
      return;
    }
    const data = {
      staff: assignId,
      startDate: jobInfo?.startDate,
      endDate: jobInfo?.endDate,
      repeat,
    };
    //     POST http://localhost:3006/v1/api/admin/repeatJob/{job_id}

    // Body:   startDate, endDate, repeat=[1,2,3,4](for weekly), staff
    props.loader(true);
    Api("post", `admin/repeatJob/${jobID}`, data, router).then(
      async (res) => {
        props.loader(false);
        if (res.status) {
          setSelected([]);
          setJobID("");
          assignId = [];
          setAssignedUser([]);
          updateTask();
          setIsOpen(false);
          setJobInfo({
            currentWeek: false,
            startDate: "",
            endDate: "",
            repeatType: "Daily",
          });
          setSubmitted(false);
          props.toaster({ type: "success", message: res.data.message || "" });
        } else {
          props.toaster({ type: "success", message: res.message });
        }
      },
      (err) => {
        props.loader(false);
      }
    );
  };

  const deleteTask = (id, date) => {
    props.loader(true);
    Api("delete", `jobs/${id}`, "", router).then(
      async (res) => {
        props.loader(false);
        if (res.status) {
          adminjobList.splice(
            adminjobList.findIndex((a) => a._id === id),
            1
          );

          props.toaster({ type: "success", message: res.data.message });
          setAdminjobList(adminjobList);
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

  const assignedUser = (item) => {
    getGuardList(item);
  };

  function ActionButton({ row }) {
    return (
      <div className="flex  items-center">
        <button
          className="bg-green-700 w-20 rounded-sm py-1 text-white text-sm mr-5"
          onClick={() => {
            setJobID(row.original._id);
            setShowForm(true);
            // router.push(`/tasks/${row.original._id}`);
            // update(row);
          }}
        >
          Update
        </button>
        <button
          className="bg-red-700 w-20 rounded-sm py-1 text-white text-sm"
          onClick={() => {
            deleteTask(row.original._id, row.getRowProps.index);
          }}
        >
          Delete
        </button>
      </div>
    );
  }

  const columns = React.useMemo(
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
        Header: "Action",
        Cell: ActionButton,
      },
    ],
    []
  );

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <div className="overflow-auto  h-screen bg-black ">
      < div className="px-5 md:pt-2 pt-6">
        <div className="grid md:grid-cols-3 grid-col-1 gap-3">
          <div className="border-2  border-customGray  border-t-red-700 border-t-4 relative flex justify-center    cursor-pointer" >
            <div className="bg-customGray w-full flex justify-between items-center h-16 rounded-md px-5">
              <p className="font-bold text-lg text-center text-white  px-3">Total Task</p>
              <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                <CountUp end={dashStatus?.totalJobs || 0} />
              </p>
            </div>
          </div>
          <div className="border-2  border-customGray  border-t-red-700 border-t-4    relative flex justify-center   cursor-pointer" >
            <div className="bg-customGray w-full flex justify-between items-center h-16 rounded-md px-5">
              <p className="font-bold text-lg text-center text-white  px-3">Open Task</p>
              <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                <CountUp end={dashStatus?.pendingJob || 0} />
              </p>
            </div>
          </div>

          <div className="border-2  border-customGray  border-t-red-700 border-t-4   relative flex justify-center    cursor-pointer" >
            <div className="bg-customGray w-full flex justify-between items-center h-16 rounded-md px-5">
              <p className="font-bold text-lg text-center text-white  px-3">Close Task</p>
              <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                <CountUp end={(dashStatus?.totalJobs - dashStatus?.pendingJob) || 0} />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`grid ${!showForm ? "grid-cols-2 " : "grid-cols-1"
          }  items-start px-5 py-4`}
      >
        {!showForm && (
          <div className="">
            <button
              // disabled={props?.organization?._id === undefined ? true : false}
              className="bg-red-700 text-white p-2 rounded-sm w-40 "
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
                if (!showForm) {
                  setJobID("");
                }
                setRepeat("Create New Task");
                setShowForm(!showForm);
              }}
            >
              {/* {showForm ? "Close" : "Create New Task"} */}
              Create New Task
            </button>
          </div>
        )}

        {/* {!showForm && ( */}
        <div className="flex justify-end ">
          <button
            // disabled={props?.organization?._id === undefined ? true : false}
            className={`bg-red-700 text-white p-2 rounded-sm w-20 `}
            onClick={() => {
              getAllJobs(dateObj?.startDate, dateObj?.endDate);
            }}
          >
            {/* {showForm ? "Close" : "Create New Task"} */}
            Refresh
          </button>
        </div>
        {/* )} */}
      </div>
      {showForm && (
        <div className="px-5">
          <CreateTask
            {...props}
            router={router}
            setShowForm={setShowForm}
            getJobs={getJobs}
            jobId={jobID}
            updateTask={updateTask}
            repeat={repeat}
            guardOpt={opt}
          />

        </div>)}
      <div>
        {showCal === "month" && (
          <CalendarTable
            setShowCal={setShowCal}
            getAllJobs={getAllJobs}
            data={adminjobList}
            setShowForm={setShowForm}
            setJobID={setJobID}
            deleteTask={deleteTask}
            setRepeat={setRepeat}
            {...props}
            goToTop={goToTop}
            setOpenDialog={setOpenDialog}
            date={dateObj}
            getGuardList={getGuardList}
            setAssignedUser={setAssignedUser}
            setShowStatus={setShowStatus}
            router={router}
            setIsOpen={setIsOpen}
          />
        )}
      </div>

      <div className="w-full">
        {showCal === "week" && (
          <WeekDayTable
            setShowCal={setShowCal}
            getAllJobs={getAllJobs}
            data={adminjobList}
            setAdminjobList={setAdminjobList}
            setShowForm={setShowForm}
            setJobID={setJobID}
            deleteTask={deleteTask}
            setRepeat={setRepeat}
            {...props}
            goToTop={goToTop}
            setOpenDialog={setOpenDialog}
            date={dateObj}
            assignedUser={assignedUser}
            getGuardList={getGuardList}
            setAssignedUser={setAssignedUser}
            setShowStatus={setShowStatus}
            router={router}
            setIsOpen={setIsOpen}
          />
        )}
      </div>
      <div>
        {showCal === "today" && (
          <TodayTable
            setShowCal={setShowCal}
            getAllJobs={getAllJobs}
            data={adminjobList}
            setShowForm={setShowForm}
            setJobID={setJobID}
            deleteTask={deleteTask}
            setRepeat={setRepeat}
            {...props}
            goToTop={goToTop}
            setOpenDialog={setOpenDialog}
            date={dateObj}
            getGuardList={getGuardList}
            setAssignedUser={setAssignedUser}
            setShowStatus={setShowStatus}
            router={router}
            setIsOpen={setIsOpen}
          />
        )}
      </div>
      {/* <div className="px-5 overflow-visible">
        <Table columns={columns} data={jobList} />
      </div> */}

      {openDialog ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-md shadow-lg relative flex flex-col w-full bg-black outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5   rounded-t">
                  <h3 className="text-2xl font-semibold text-white">
                    Assign Job
                  </h3>
                </div>
                {/*body*/}
                <div className="px-5 pt-5 pb-5 border-2  border-red-900 bg-black relative  md:h-auto w-80">
                  <MultiSelect
                    options={opt}
                    value={selected}
                    onChange={(text) => {
                      setSelected(text);
                    }}
                    labelledBy="Select Staff"
                    ClearSelectedIcon
                  />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-3  bg-black rounded-b">
                  <button
                    className={`${selected?.length === 0 ? 'text-green-500' : 'text-green-500'} background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
                    type="button"
                    // onClick={() => {
                    //   setOpenDialog(false);
                    //   assignJob();
                    // }}
                    onClick={() => {
                      // setOpenDialog(false);
                      if (selected?.length === 0) {
                        props.toaster({ type: "error", message: 'Please select any staff.' });
                      } else {
                        setOpenDialog(false);
                        assignJob();
                      }
                    }}
                  >
                    Assign
                  </button>
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setOpenDialog(false);
                      setSelected([]);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className=" bg-black">
          <div className="">
            <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-3 rounded-sm  border-t-4 border-red-700 ">
              <div>
                <p className="text-white font-bold md:text-3xl text-lg">
                  Repeat Task
                </p>
              </div>
            </div>
          </div>
          <div className=" border-2 border-red-700 rounded-sm p-5">
            <div className="grid grid-cols-1  ">
              <div className="grid grid-cols-2 mb-1">
                <p className="text-white text-lg font-semibold ">
                  Select Staff
                </p>
              </div>
              <MultiSelect
                options={opt}
                value={selected}
                onChange={(text) => {
                  setSelected(text);
                }}
                labelledBy="Select Staff"
                ClearSelectedIcon
              // disabled={publics}
              />
            </div>
            <div className="grid grid-cols-1 mt-3">
              <p className="text-white text-lg font-semibold">Repeat</p>
              <select
                value={jobInfo.repeatType}
                onChange={(text) => {
                  setJobInfo({ ...jobInfo, repeatType: text.target.value });
                }}
                name="cars"
                className={`rounded-md border-2 border-red-900 mt-1 outline-none ${jobInfo.repeatType === ""
                  ? "text-neutral-500"
                  : "text-neutral-500"
                  }  bg-black p-2`}
              >
                <option className="text-red-700" value={"Daily"}>
                  Daily
                </option>
                <option className="text-red-700" value={"Weekly"}>
                  Weekly
                </option>
              </select>
            </div>
            <div className="grid grid-cols-1 mt-3">
              <p className="text-white text-lg font-semibold">Repeat On</p>
              <div className="rounded-md border-2 border-red-900 pb-2 pt-1 flex">
                {days.map((d) => (
                  <div
                    className="flex justify-center flex-col w-10"
                    key={d.value}
                  >
                    <p className="text-white text-sm font-semibold text-center mb-2 mt-0">
                      {d?.day}
                    </p>
                    <input
                      type="checkbox"
                      checked={d?.selected}
                      disabled={jobInfo.repeatType === "Daily"}
                      onChange={(text) => {
                        d.selected = text.target.checked;
                        setDays([...days]);
                      }}
                    ></input>
                  </div>
                ))}
              </div>
              {submitted &&
                jobInfo?.repeatType === "Weekly" &&
                selectedLenght === 0 && (
                  <p className="text-red-700 mt-1">
                    Please Select the day(s) from week
                  </p>
                )}
            </div>
            <div className="flex">
              <div className=" grid-cols-1 mt-3 flex">
                <div className=" flex">
                  <div className="flex justify-center flex-col mr-3">
                    <input
                      type="checkbox"
                      disabled={jobInfo.repeatType === "Daily"}
                      value={jobInfo?.currentWeek}
                      checked={jobInfo?.currentWeek || false}
                      onChange={(text) => {
                        var startOfWeek = moment().startOf("isoweek").toDate();
                        var endOfWeek = moment().endOf("isoweek").toDate();
                        // startOfWeek = new Date(
                        //   startOfWeek.setDate(startOfWeek.getDate() + 1)
                        // );
                        // endOfWeek = new Date(
                        //   endOfWeek.setDate(endOfWeek.getDate() + 1)
                        // );
                        setJobInfo({
                          ...jobInfo,
                          currentWeek: text?.target?.checked,
                          nextWeek: false,
                          startDate: text?.target?.checked
                            ? moment(new Date(startOfWeek)).format("YYYY-MM-DD")
                            : "",
                          endDate: text?.target?.checked
                            ? moment(new Date(endOfWeek)).format("YYYY-MM-DD")
                            : "",
                        });
                      }}
                    ></input>
                  </div>
                </div>
                <p className="text-white text-lg font-semibold">Current Week</p>
              </div>
              <div className=" grid-cols-1 mt-3 flex ml-10">
                <div className=" flex">
                  <div className="flex justify-center flex-col mr-3">
                    <input
                      type="checkbox"
                      disabled={jobInfo.repeatType === "Daily"}
                      value={jobInfo?.nextWeek}
                      checked={jobInfo?.nextWeek || false}
                      onChange={(text) => {
                        let nextweekDay = new Date().setDate(new Date().getDate() + 7)
                        console.log(nextweekDay)
                        var startOfWeek = moment(new Date(nextweekDay)).startOf("isoweek").toDate();
                        var endOfWeek = moment(new Date(nextweekDay)).endOf("isoweek").toDate();
                        console.log(startOfWeek, endOfWeek)
                        // startOfWeek = new Date(
                        //   startOfWeek.setDate(startOfWeek.getDate() + 1)
                        // );
                        // endOfWeek = new Date(
                        //   endOfWeek.setDate(endOfWeek.getDate() + 1)
                        // );

                        setJobInfo({
                          ...jobInfo,
                          currentWeek: false,
                          nextWeek: text?.target?.checked,
                          startDate: text?.target?.checked
                            ? moment(new Date(startOfWeek)).format("YYYY-MM-DD")
                            : "",
                          endDate: text?.target?.checked
                            ? moment(new Date(endOfWeek)).format("YYYY-MM-DD")
                            : "",
                        });
                      }}
                    ></input>
                  </div>
                </div>
                <p className="text-white text-lg font-semibold">Next Week</p>
              </div>
            </div>

            <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start">
              <p className="text-white text-lg font-semibold">Start Date</p>
              <input
                value={jobInfo?.startDate}
                disabled={jobInfo?.currentWeek || jobInfo?.nextWeek}
                onChange={(text) => {
                  setJobInfo({ ...jobInfo, startDate: text.target.value });
                }}
                type="date"
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 icncolor"
              />
              {submitted && jobInfo.startDate === "" && (
                <p className="text-red-700 mt-1">StartDate is required</p>
              )}
            </div>
            <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start">
              <p className="text-white text-lg font-semibold">End Date</p>
              <input
                value={jobInfo?.endDate}
                disabled={jobInfo?.currentWeek || jobInfo?.nextWeek}
                onChange={(text) => {
                  setJobInfo({ ...jobInfo, endDate: text.target.value });
                }}
                type="date"
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 icncolor"
              />
              {submitted && jobInfo.endDate === "" && (
                <p className="text-red-700 mt-1">EndDate is required</p>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button
                className="text-white bg-red-700 rounded-sm  text-md py-21 w-36 h-10"
                onClick={() => repeatJob()}
              >
                {/* {!props.repeat ? "Update" : "Create"} */}
                Repeat
              </button>
              <button
                className="text-white bg-red-700 rounded-sm  text-md py-21 w-36 h-10"
                onClick={() => {
                  setIsOpen(false);
                  setJobInfo({
                    startDate: new Date(),
                    endDate: new Date(),
                    title: "",
                    location: "",
                    latitude: "",
                    longitude: "",
                    description: "",
                    jobtype: "event",
                    amount: "",
                    jobPerson: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {showStatus ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative  my-6 mx-auto max-w-3xl w-1/2">
              {/*content*/}
              <div className="border-0 rounded-md shadow-lg relative flex flex-col w-full bg-black outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5   rounded-t">
                  <h3 className="text-2xl font-semibold text-white">
                    Assign Status
                  </h3>
                </div>
                {/*body*/}
                <div className="px-5 pt-5 pb-5    bg-black relative  md:h-auto w-full">
                  <table className="w-full">
                    <tr>
                      <th className="text-red-900  text-left">No</th>
                      <th className="text-red-900 text-left">Name</th>
                      <th className="text-red-900  text-left">status</th>
                    </tr>
                    {assinedUser?.map((item, index) => (
                      <tr
                        key={index}
                        className={`${item?.job_status === "ACTIVE" ? "" : "hidden"
                          }`}
                      >
                        <th className="text-white  text-left text-sm">
                          {index + 1}
                        </th>
                        <td className="text-white text-left text-sm">
                          {item?.invited?.fullName}
                        </td>
                        <td className="text-white text-left text-sm">
                          {item.status}
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-3  bg-black rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setShowStatus(false);
                      setAssignedUser([]);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};

export default Task;
