/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from "react";
import { Api } from "../services/service";
import { checkForEmptyKeys } from "../services/InputsNullChecker";
import LocationDropdown from "./LocationDropdown";
// import { useRouter } from "next/router";
// import Constants from "../../src/services/constant";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";
// import { CalendarPicker, RangePicker } from "react-minimal-datetime-range";
// import "react-minimal-datetime-range/lib/react-minimal-datetime-range.min.css";
import JobFilter from "./JobFilter";
import DateTimeRangeContainer from "react-advanced-datetimerange-picker";
import DateTimePicker from "react-datetime-picker";
import Select from "react-dropdown-select";

const StaticQuery = (props) => {
  const [jobInfo, setJobInfo] = useState({
    startDate: new Date(),
    endDate: new Date().setDate(new Date().getDate() + 1),
  });

  let startt = moment(new Date());
  let ends = moment(new Date());

  let [start, setstart] = useState(startt);
  let [end, setend] = useState(ends);

  let ranges = {
    "Today Only": [moment(start), moment(end)],
    "Yesterday Only": [
      moment(start).subtract(1, "days"),
      moment(end).subtract(1, "days"),
    ],
    "3 Days": [moment(start).subtract(3, "days"), moment(end)],
  };
  let local = {
    format: "DD-MM-YYYY HH:mm",
    sundayFirst: false,
  };

  let applyCallback = async (startDate, endDate) => {
    setJobInfo({
      startDate: startDate._d,
      endDate: endDate._d,
    });
    setstart(startDate);
    setend(endDate);
  };

  const getConfig = () => {
    props.loader(true);

    Api("get", "user/config", "", props.router).then((res) => {
      props.loader(false);
      if (res.status) {
        setTaskList(res.data.title);
      } else {
        props.toaster({ type: "error", message: res.message });
      }
    });
  };

  return (
    <div className=" bg-black md:-mt-16 overflow-x-auto">
      <div className=" pb-5">
        <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-3 rounded-sm  border-t-4 border-red-700 ">
          <div>
            <p className="text-white font-bold md:text-3xl text-lg">
              Select Report Period
            </p>
          </div>
        </div>

        <div className=" border-2 border-red-700 rounded-sm p-5">
          <div className="grid md:grid-cols-2 grid-cols-1 items-start">
            <div className="grid md:grid-cols-1 grid-cols-1 items-start">
              <div className="grid grid-cols-1 ">
                <p className="text-white text-lg font-semibold">
                  {"Start Date & Time - End Date & Time"}
                </p>
                <DateTimeRangeContainer
                  ranges={ranges}
                  start={start}
                  end={end}
                  local={local}
                  applyCallback={applyCallback}
                  smartMode
                  // noMobileMode
                >
                  <input
                    id="formControlsTextB"
                    type="text"
                    label="Text"
                    value={
                      moment(jobInfo?.startDate).format("DD-MM-YYYY HH:mm") +
                      "  ~  " +
                      moment(jobInfo?.endDate).format("DD-MM-YYYY HH:mm")
                    }
                    onChange={() => {}}
                    placeholder="Enter text"
                    className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5  w-full"
                  />
                </DateTimeRangeContainer>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button className="text-white bg-red-700 rounded-sm  text-md py-21 w-36 h-10">
              {/* {!props.repeat ? "Update" : "Create"} */}
              Query
            </button>
            <button
              className="text-white bg-red-700 rounded-sm  text-md py-21 w-36 h-10"
              onClick={() => {
                props?.setShowForm(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    // </html>
  );
};
export default StaticQuery;
