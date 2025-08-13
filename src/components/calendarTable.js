/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-undef */
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { useEffect, useState } from "react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { FaUserCheck } from "react-icons/fa";
import { ImLink } from "react-icons/im";

import moment from "moment";
import { IoChevronBack, IoChevronForward, IoRepeat } from "react-icons/io5";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import { Api } from "../../src/services/service";

export function CalendarTable(props) {
  const [data, setData] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [hoverData, setHoverData] = useState({});
  const [dateObj, setDateObj] = useState();

  useEffect(() => {
    if (!!props.data) {
      setDataTable();
    }
  }, [props.data]);

  const checkColors = (item) => {
    console.log(item)
    let d = item?.invites?.filter(
      (f) =>
        f.job_status === "ACTIVE" &&
        (f.status === "ACCEPTED" || f.status === "ASSIGNED")
    );
    const R = item?.invites?.filter((f) => f.status === "REJECTED");
    if (item?.applicant?.length > 0 && d !== undefined && item.applicant?.length === item?.person) {
      return 'rgb(21 128 61)'
    } else if (R !== undefined && R?.length === item?.person) {
      return 'rgb(185 28 28)'
    }
    return 'rgb(234 179 8)'
  }

  const setDataTable = () => {
    const d = [];
    const e = [];
    props?.data.forEach((ele, index) => {
      ele?.jobs.forEach((el, i) => {
        d.push({
          title: "",
          id: el._id,
          date: moment(el.startDate).format("yyyy-MM-DD"),
          color: checkColors(el)
          // start: moment(el.startDate).format("yyyy-MM-DD"),   //for range values
          // end: moment(el.endDate).format("yyyy-MM-DD"),
          // ...el,
        });
        e.push({ ...el, name: ele.name });
        if (props?.data.length === index + 1) {
          setData(d);
          setMainData(e);
        }
      });
    });
  };

  const deleteTask = (id, date) => {
    props.loader(true);
    Api("delete", `jobs/${id}`, "", props.router).then(
      async (res) => {
        props.loader(false);
        if (res.status) {
          props.getAllJobs(
            moment(dateObj.startDate).format(),
            moment(dateObj.endDate).format()
          );
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

  function renderInnerContent(innerProps) {
    return (
      <div className="fc-event-main-frame">
        {innerProps.timeText && (
          <div className="fc-event-time">{innerProps.timeText}</div>
        )}
        <div className="fc-event-title-container">
          <div className="fc-event-title fc-sticky"></div>
        </div>
      </div>
    );
  }

  const hoverComp = () => {
    let d = hoverData?.invites?.filter(
      (f) =>
        f.job_status === "ACTIVE" &&
        (f.status === "ACCEPTED" || f.status === "ASSIGNED")
    );
    let c = []
    if (d?.length) {
      c = d?.filter(f => f.start)
    }

    return (
      <div className="bg-stone-700 p-2  rounded-sm w-40">
        <p className="text-white f11">Name: {hoverData?.name}</p>
        {/* <p className="text-white f11">Title : {hoverData?.title}</p> */}
        <p className="text-white f11">
          Start Time: {moment(new Date(hoverData?.startDate)).format("hh:mm A")}
        </p>
        <p className="text-white f11">
          End Time: {moment(new Date(hoverData?.endDate)).format("hh:mm A")}
        </p>
        <p className="text-white f11">Rate: {hoverData?.amount}</p>

        <p className="text-white f11">
          Assign:{" "}
          {d?.length === 1 &&
            hoverData?.person === 1 &&
            d?.[0].invited?.fullName.split(" ")[0]}
        </p>

        <div className="flex justify-start items-end mt-1">
          {hoverData?.invites?.length > 0 && !hoverData.public && (
            <Tooltip title={<p>Status</p>} arrow>
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
                  props.setAssignedUser(hoverData?.invites);
                  props.setShowStatus(true);
                }}
              >
                <ImLink className="text-black text-md" />
              </div>
            </Tooltip>
          )}
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
                // props.setAssignedUser(hoverData?.invites);
                props.setOpenDialog(true);
                props.getGuardList(hoverData?.applicant);
                props.setJobID(hoverData?._id);
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
                // props.setShowForm(true);
                // props.setJobID(hoverData?._id);
                // props.setRepeat("Repeat Task");

                props.getGuardList(hoverData?.applicant);
                props.setIsOpen(true);
                props.setJobID(hoverData?._id);
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
                props.setJobID(hoverData?._id);
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
                deleteTask(hoverData?._id);
              }}
            >
              <MdDeleteForever className="text-black text-md" />
            </div>
          </Tooltip>
          {d?.length > 0 && <div
            className={`w-4 h-4 ${c?.length === hoverData?.person ? 'bg-green-500' : "bg-yellow-500"} rounded-sm flex justify-center items-center`}
          >
          </div>}
        </div>
      </div>
    );
  };

  return (
    <div className="md:mx-5 mx-3 bg-white text-black">
      <FullCalendar
        datesSet={(arg) => {
          setDateObj({ startDate: arg.start, endDate: arg.end });
          props.getAllJobs(
            moment(arg.start).format(),
            moment(arg.end).format()
          );
        }}
        eventMouseEnter={function (info) {
          if (info.event.id !== undefined || info.event.id !== "") {
            const e = mainData.find((t) => t._id === info.event.id);
            setHoverData(e);
          }
        }}
        eventContent={(arg) => {
          return (
            <Tooltip title={hoverComp()} arrow>
              {renderInnerContent(arg)}
            </Tooltip>
          );
        }}
        plugins={[dayGridPlugin, timeGridPlugin, resourceTimelinePlugin]}
        editable
        selectable
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "Month,Week,Today next",
        }}
        customButtons={{
          Month: {
            text: "Month",
            click: function () {
              props.setShowCal("month");
            },
          },
          Week: {
            text: "Week",
            click: function () {
              props.setShowCal("week");
            },
          },
          Today: {
            text: "Today",
            click: function () {
              props.setShowCal("today");
            },
          },
        }}
        // eventColor="green"
        eventMaxWidth={50}
        events={[...data]}
        views={{
          monthGrid: {
            firstDay: 1,
          },
        }}
      />
    </div>
  );
}
