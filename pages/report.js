/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";

import { useRouter } from "next/router";
import ActivityList from "../src/components/report/activityList";
import ActivityTable from "../src/components/report/activityTable.";
import { IoSearch, IoCalendar } from "react-icons/io5";
import { Api } from "../src/services/service";
import moment from "moment";
import { timeSince } from "../src/services/service";
import Table from "../src/components/report/customTableAct";
import CountUp from "react-countup";

const Report = (props) => {
  const router = useRouter();
  const [incidentList, setIncidentList] = useState([]);
  const [notificationList, setNotificationList] = useState([]);
  const [filterData, setfilterData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [activitytype, setActiVityType] = useState("All");
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState('Activity')
  const limit = 10;
  useEffect(() => {
    getReport();
    getNotification(page);
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Activity",
        Cell: ActivityList,
      },
    ],
    []
  );

  // useEffect(() => {
  //   if (activitytype === "All") {
  //     setfilterData(notificationList);
  //   } else {
  //     let d = [];
  //     if (activitytype === "Hour") {
  //       d = notificationList.filter(
  //         (f) =>
  //           f.time.includes("Min") ||
  //           f.time.includes("Hour") ||
  //           f.time.includes("Mins") ||
  //           f.time.includes("Hours") ||
  //           f.time.includes("1 Day")
  //       );
  //     }
  //     if (activitytype === "Day") {
  //       d = notificationList.filter(
  //         (f) =>
  //           f.time.includes("Min") ||
  //           f.time.includes("Hour") ||
  //           f.time.includes("Day") ||
  //           f.time.includes("Mins") ||
  //           f.time.includes("Hours") ||
  //           f.time.includes("Days") ||
  //           f.time.includes("1 Week")
  //       );
  //     }
  //     if (activitytype === "Week") {
  //       d = notificationList.filter(
  //         (f) =>
  //           f.time.includes("Min") ||
  //           f.time.includes("Hour") ||
  //           f.time.includes("Day") ||
  //           f.time.includes("Week") ||
  //           f.time.includes("Mins") ||
  //           f.time.includes("Hours") ||
  //           f.time.includes("Days") ||
  //           f.time.includes("Weeks") ||
  //           f.time.includes("1 Month")
  //       );
  //     }

  //     setfilterData(d);
  //   }
  // }, [activitytype]);

  const getReport = () => {
    props.loader(true);
    Api("post", "provider/getAllIncident", "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          res.data.incident.forEach((element) => {
            element.date = moment(element.createdAt).format(
              "DD/MM/yyyy hh:mm a"
            );
            element.name = element.posted_by.fullName;
          });

          setIncidentList(res.data.incident);
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

  const getNotification = (p) => {
    props.loader(true);
    Api("post", "notificationPage", { page: p, limit }, router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          res?.data?.notifications?.forEach((ele) => {
            ele.time = timeSince(ele.createdAt);
            // if (ele?.invited_for?.status === "ACCEPTED") {
            //   ele.msg = `${
            //     ele?.message.split(" ")[0]
            //   } has accepted the below job.`;
            // }
            // if (ele?.message?.includes("applied")) {
            //   ele.msg = `${
            //     ele?.message.split(" ")[0]
            //   } has been selected for the below job.`;
            // }
            // if (ele?.invited_for?.status === "REJECTED") {
            //   ele.msg = `${ele?.message.split(" ")[0]} has rejected this job.`;
            // }
            // if (ele?.message?.includes("assigned")) {
            //   ele.msg = `${
            //     ele?.message.split(" ")[0]
            //   } has assigned a job to this person.`;
            // }
          });
          console.log(res?.data?.notifications)
          setNotificationList(res?.data?.notifications);
          setfilterData(res?.data?.notifications);
          setCurrentData(res?.data?.notifications)
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

  const filterClock = (type) => {
    const clockin = notificationList.filter(f => f.message.toLowerCase().includes(type))
    setfilterData(clockin)
    // setActiVityType('')
  }

  const filterShiftreport = () => {
    const clockin = notificationList.filter(f => !f.message.toLowerCase().includes('clock in') && !f.message.toLowerCase().includes('clock out'))
    setfilterData(clockin)
    // setActiVityType('')
  }
  return (
    <div className="min-h-screen bg-black md:-mt-16 overflow-x-auto">
      < div className="px-5 md:pt-[89px] pt-5">
        <div className="grid md:grid-cols-3 grid-col-1 gap-3">
          <div className="border-2  border-customGray  border-t-red-700 border-t-4 relative flex justify-center cursor-pointer" >
            <div className="bg-customGray w-full flex justify-between items-center h-24 rounded-md px-5">
              <p className="font-bold text-lg text-center text-white  px-3"><span onClick={() => { filterClock('clock in'); setTitle('Clock In') }}>Clock in</span> / <span onClick={() => { filterClock('clock out'); setTitle('Clock Out') }}>Clock out</span></p>
              {/* <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                <CountUp end={0} /> / <CountUp end={0} />
              </p> */}
            </div>
          </div>
          <div className="border-2  border-customGray  border-t-red-700 border-t-4    relative flex justify-center   cursor-pointer"  >
            <div className="bg-customGray w-full flex justify-between items-center h-24 rounded-md px-5">
              <p className="font-bold text-lg text-center text-white  px-3" onClick={() => { setTitle('Incident') }}>Incident Report</p>
              {/* <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                <CountUp end={0} />
              </p> */}
            </div>
          </div>

          <div className="border-2  border-customGray  border-t-red-700 border-t-4   relative flex justify-center    cursor-pointer" >
            <div className="bg-customGray w-full flex justify-between items-center h-24 rounded-md px-5">
              <p className="font-bold text-lg text-center text-white  px-3" onClick={() => { filterShiftreport(); setTitle('Shift') }}>Shift Report</p>
              {/* <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                <CountUp end={0} />
              </p> */}
            </div>
          </div>
        </div>
      </div>
      {title !== 'Incident' && <div className="pt-5 ">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-stone-900 md:px-5 p-4 border-x  border-t-[5px] border-red-700 md:mx-5 m mx-5">
          <div>
            <p className="text-white font-bold md:text-3xl text-lg">
              {title} Report
            </p>
          </div>
          {/* <div className="flex md:justify-end justify-start items-center md:pt-0 pt-5">
            <div className="flex rounded-lg w-60 bg-black">
              <button
                className={`text-white ${activitytype === "Hour" && "bg-red-700"
                  } rounded-lg text-xs h-8  w-20 `}
                onClick={() => setActiVityType("Hour")}
              >
                Today
              </button>
              <button
                className={`text-white ${activitytype === "Day" && "bg-red-700"
                  } rounded-lg text-xs h-8  w-20 `}
                onClick={() => setActiVityType("Day")}
              >
                Week
              </button>
              <button
                className={`text-white ${activitytype === "Week" && "bg-red-700"
                  } rounded-lg text-xs h-8  w-20 `}
                onClick={() => setActiVityType("Week")}
              >
                Month
              </button>
              <button
                className={`text-white ${activitytype === "All" && "bg-red-700"
                  } rounded-lg text-xs h-8  w-20 `}
                onClick={() => setActiVityType("All")}
              >
                All
              </button>
            </div>

          </div> */}
        </div>
        <div className="px-5">
          <div className="rounded-sm border border-red-700 py-5 px-3 border-t-0">
            {filterData.map((noti) => (
              <ActivityList data={noti} key={noti._id} />
            ))}
            <div className="flex justify-between mt-5 px-5">
              <p
                className="text-white"
                role="button"
                onClick={() => {
                  if (page !== 1) {
                    setPage(page - 1);
                    getNotification(page - 1);
                  }
                }}
              >
                Previous
              </p>
              <p
                className="text-white"
                role="button"
                onClick={() => {
                  if (currentData.length < 10) {
                    return;
                  } else {
                    setPage(page + 1);
                    getNotification(page + 1);
                  }
                }}
              >
                Next
              </p>
            </div>
            {/* <Table columns={columns} data={filterData} /> */}

            {filterData.length === 0 && (
              <p className="text-white font-bold text-lg text-center">
                There is no activities
              </p>
            )}
          </div>
        </div>
      </div>}
      {title === 'Incident' && <div className="pt-5 " id="incident">
        <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-4  border-t-8 border-red-700 md:mx-5 m mx-3">
          <div>
            <p className="text-white font-bold md:text-3xl text-lg">
              Incident Report
            </p>
          </div>
          {/* <div className="flex justify-end">
            <select className="  bg-red-700 outline-none text-white rounded-full font-bold text-lg px-5 ">
              <option className="text-red-700" value="">
                Select
              </option>
            </select>
            <div className="h-8 w-8 bg-red-700 rounded-md ml-3 flex justify-center items-center">
              <IoSearch className="text-white" />
            </div>
            <div className="h-8 w-8 bg-red-700 rounded-md ml-3 flex justify-center items-center">
              <IoCalendar className="text-white" />
            </div>
          </div> */}
        </div>
        <div className="px-5">
          <ActivityTable data={incidentList} />
        </div>
      </div>}
    </div>
  );
};

export default Report;
