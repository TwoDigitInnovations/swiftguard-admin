/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, useContext } from "react";
import InvoicesList from "./invoiceListTable";
import { IoSearch, IoCalendar } from "react-icons/io5";
import { Api } from "../../services/service";
import { checkForEmptyKeys } from "../../services/InputsNullChecker";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { useExcelDownloder } from "react-xls";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment";
import { Context, userContext } from "../../../pages/_app";
import ClientList from "./clientList";
import { billContext } from "../../../pages/billing2";
import Payroll from "./payroll";

function getWeekNumbersForYear(year) {
  const weekNumbers = [];
  const date = new Date(year, 0, 4);
  weekNumbers.push("Select");
  while (date.getFullYear() === year) {
    const weekNumber = getISOWeekNumber(date);
    weekNumbers.push(weekNumber + 1);
    date.setDate(date.getDate() + 7); // Move to the next week
  }
  console.log(weekNumbers);

  return weekNumbers;
}
function getISOWeekNumber(date) {
  const dt = new Date(date);
  dt.setHours(0, 0, 0);
  dt.setDate(dt.getDate() + 4 - (dt.getDay() || 7));
  const startOfYear = new Date(dt.getFullYear(), 0, 1);
  const diff = (dt - startOfYear) / 86400000; // 86,400,000 milliseconds in a day
  return Math.ceil((diff + 1) / 7);
}

const Bill = (props) => {
  const { ExcelDownloder, Type, setData, setFilename } = useExcelDownloder();
  const [clentData, setClentdata] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [selectType, setSelectType] = useState("Custom");
  const [guardRange, setGuardRange] = useState({
    endDate: moment(
      new Date(new Date().getTime() - 1 * 60 * 60 * 24 * 1000)
    ).format("YYYY-MM-DD"),
    startDate: moment(
      new Date(new Date().getTime() - 7 * 60 * 60 * 24 * 1000)
    ).format("YYYY-MM-DD"),
  });

  const [gRange, setGRange] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [billInfo, setBillInfo] = useState({
    start: moment(
      new Date(new Date().getTime() - 7 * 60 * 60 * 24 * 1000)
    ).format("YYYY-MM-DD"),
    end: moment(
      new Date(new Date().getTime() - 1 * 60 * 60 * 24 * 1000)
    ).format("YYYY-MM-DD"),
    client_id: [],
  });
  const [weekStartDate, setWeekStartDate] = useState(billInfo?.start);
  const [weekEndDate, setWeekEndDate] = useState(billInfo?.end);
  const [week, setWeek] = useState();
  const [month, setMonth] = useState(moment(billInfo?.start).format("YYYY-MM"));
  const [monthStart, setMonthStart] = useState(new Date());
  const [monthEnd, setMonthEnd] = useState(new Date());
  const [billArray, setBillArray] = useContext(billContext);

  console.log(month);

  useEffect(() => {
    let d = [];
    props?.gaurdHistory?.forEach((element, i) => {
      d.push({
        No: i + 1,
        "Outlet Name": element?.name,
        Wage: element?.wages,
      });
    });
    setData({ userdata: d });
    setBillArray({
      ...billArray,
      clientrange: billInfo
    })
    // getClientList();
  }, [props.gaurdHistory]);

  useEffect(() => {
    getClientList();
    // setBillArray({
    //   ...billArray,
    //   clientrange: billInfo
    // })
    checkHistory()

  }, [])

  const checkHistory = () => {
    const history = localStorage.getItem('history');
    if (history) {
      const h = JSON.parse(history)
      setGuardRange(h)
      props.getGuardHistory(h)
      localStorage.removeItem('history')
      window.scrollTo({
        bottom: 0,
        behavior: "smooth",
      });
    }
  }

  useEffect(() => {

    setBillArray({
      ...billArray,
      clientrange: billInfo
    })

    console.log(billInfo)
  }, [billInfo])

  useEffect(() => {

    setBillArray({
      ...billArray,
      guardRange
    })
  }, [guardRange])

  const Setrange = (ids) => {
    setGuardRange({ ...guardRange, client_id: ids?.client_id });
  };

  useEffect(() => {
    console.log(props?.isrefresh)
    if (props?.isrefresh?.url) {
      setBillInfo(
        props?.isrefresh
      )
      console.log('njkik>', props?.isrefresh)
      setTimeout(() => {
        getClientList(props?.isrefresh);
      }, 1000);

    } else {
      if (props.isrefresh.start && props.isrefresh.end) {
        setBillInfo(
          props?.isrefresh
        )
      }
    }

  }, [props.isrefresh])

  const submits = (range) => {
    // let { anyEmptyInputs } = checkForEmptyKeys(billInfo);
    // if (anyEmptyInputs.length > 0) {
    //   setSubmitted(true);
    //   return;
    // }
    if (billInfo?.client_id.length === 0) {
      props.toaster({
        type: "error",
        message: "Please Select client then try again",
      });
      return;
    }

    let d = [];
    billInfo?.client_id.forEach((ele) => {
      d.push(ele?.value);
    });
    const start = encodeURIComponent(
      moment(billInfo.start, "YYYY-MM-DD").format()
    );
    const end = encodeURIComponent(moment(billInfo.end, "YYYY-MM-DD").format());
    const data = {
      start,
      end,
      client_id: d,
    };

    Api("post", "admin/invoice", data, props.router).then((res) => {
      props.loader(false);
      if (res.status) {
        if (res.data.invoice) {
          props.toaster({ type: "success", message: "Invoice generated" });
          setBillInfo({
            start: moment(
              new Date(new Date().getTime() - 7 * 60 * 60 * 24 * 1000)
            ).format("YYYY-MM-DD"),
            end: moment(
              new Date(new Date().getTime() - 1 * 60 * 60 * 24 * 1000)
            ).format("YYYY-MM-DD"),
            client_id: [],
          });
          setSubmitted(false);
          getClientList();
        } else {
          if (!res.data.invoice) {
            props.toaster({ type: "error", message: res.data.message });
          }
        }
      } else {
        props.toaster({ type: "error", message: res.message });
      }
    });
  };

  const getClientList = (info) => {
    props.loader(true);
    const start = encodeURIComponent(
      moment(info?.start || billInfo.start, "YYYY-MM-DD").format()
    );
    const end = encodeURIComponent(moment(info?.end || billInfo.end, "YYYY-MM-DD").format());
    const url = info?.url ? info.url : `listClient?start=${start}&end=${end}`
    Api("get", url, "", props.router).then(
      (res) => {
        props.loader(false);
        if (res.status) {

          const d1 = [];
          const d = res?.data?.clients.filter((f) => f !== null);
          d.forEach((element, i) => {
            element.startDate = info?.start || billInfo.start;
            element.endDate = info?.end || billInfo.end;
            element.billingcycle = element.client?.billingcycle;

            if (element.invoice) {
              element.amount = ((element.invoice.amount / 100) * element.invoice.client.vat +
                element.invoice.amount).toFixed(2)
            }

            d1.push({
              No: i + 1,
              Name: element.client.fullName,
              startDate: info?.start || billInfo.start,
              endDate: info?.end || billInfo.end,
              "Billing Cycle": element.client?.billingcycle,
              amount: element?.amount || ''
            });
          });
          console.log(res?.data?.clients);
          console.log(d);
          setClentdata(d);
          setExcelData(d1);
        } else {
          props.toaster({ type: "error", message: res.message });
        }
      }
    );
  };

  // const year = 2023; // Specify the year
  // const weekNumber = 35; // Specify the week number
  // function getWeekDates(year, weekNumber) {
  //   const startDate = new Date(year, 0, 1); // January 1st of the given year
  //   const daysToAdd = (weekNumber - 1) * 7; // Calculate days to add based on the week number
  //   startDate.setDate(startDate.getDate() + daysToAdd); // Set the start date

  //   // Calculate the end date by adding 6 days (a week) to the start date
  //   const endDate = new Date(startDate);
  //   endDate.setDate(startDate.getDate() + 6);
  //   setWeekStartDate(startDate)
  //   setWeekEndDate(endDate)
  // }

  const weekHandler = (w = 0) => {
    const d = moment().week(Number(w));
    var startOfWeek = moment(new Date(d.toString())).startOf("isoweek").toDate();
    var endOfWeek = moment(new Date(d.toString())).endOf("isoweek").toDate();
    console.log(startOfWeek, endOfWeek)
    setBillInfo({
      start: moment(new Date(new Date(startOfWeek))).format("YYYY-MM-DD"),
      end: moment(new Date(new Date(endOfWeek))).format("YYYY-MM-DD"),
      client_id: [],
    });
    setMonth(moment(startOfWeek).format("YYYY-MM"));
    if (!w) {
      setWeek(weekNumber);
    }
  };

  function getStartAndEndDates(selectedMonth) {
    // Parse the selectedMonth (assuming it's in the 'yyyy-MM' format)
    const [year, month] = selectedMonth.split("-").map(Number);

    // Create a Date object for the first day of the selected month
    const startDate = new Date(year, month - 1, 1);

    // Create a Date object for the last day of the selected month
    const endDate = new Date(year, month, 0);

    // Format the dates as strings (if needed)
    // const formattedStartDate = new Date(startDate.toISOString().split("T")[0]);
    // const formattedEndDate = new Date(endDate.toISOString().split("T")[0]);

    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);
    console.log(formattedStartDate, formattedEndDate)

    // formattedStartDate.setDate(formattedStartDate.getDate() + 1);
    // formattedEndDate.setDate(formattedEndDate.getDate() + 1);

    setMonthStart(moment(formattedStartDate).format("YYYY-MM-DD"));
    setMonthEnd(moment(formattedEndDate).format("YYYY-MM-DD"));

    setBillInfo({
      start: moment(formattedStartDate).format("YYYY-MM-DD"),
      end: moment(formattedEndDate).format("YYYY-MM-DD"),
      client_id: [],
    });
    setWeek("Select");
    // return {
    //   startDate: formattedStartDate,
    //   endDate: formattedEndDate,
    // };
  }

  // useEffect(() => {
  //   var currentDate = new Date();
  //   console.log(billInfo.start)
  //   var startDate = new Date(currentDate.getFullYear(), 0, 1);
  //   var days = Math.floor((currentDate - startDate) /
  //     (24 * 60 * 60 * 1000));
  //   setWeek(Math.ceil(days / 7))
  //   console.log(Math.ceil(days / 7))
  //   weekHandler()
  // }, [])

  function ActionSection({ row, value }) {
    return (
      <div className="flex">
        <button
          className="bg-green-700 text-white py-1 px-2 rounded-md"
          onClick={() => {
            // const start = localStorage.getItem("start") || "";
            // const end = localStorage.getItem("end") || "";
            // props?.router.push(
            //   `${row?.original?._id}?start=${localStorage.getItem(
            //     "start"
            //   )}&end=${localStorage.getItem("end")}`
            // );
          }}
        >
          View
        </button>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="border-2 border-red-700 rounded-lg p-5">
          {/* <div className="grid grid-cols-1">
          <p className="text-white text-lg font-semibold">Select Client</p>

          <MultiSelect
            options={props?.opt || []}
            value={billInfo?.client_id}
            onChange={(text) => {
            }}
            labelledBy="Select Client"
            ClearSelectedIcon
          />
        
          {submitted && billInfo.client_id.length === 0 && (
            <p className="text-red-700 mt-1">Client is required</p>
          )}
        </div> */}

          {/* {submitted && !publics && selected.length == 0 && (
                <p className="text-red-700 mt-1">Staff is required</p>
              )} */}
          {/* <select
            value={billInfo.client_id}
            onChange={(text) => {
              setBillInfo({ ...billInfo, client_id: text.target.value });
            }}
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black  p-1.5 "
          >
            <option value="">Select client</option>
            {props.opt.map((res) => (
              <option value={res.value} key={res.value}>
                {res.label}
              </option>
            ))}
          </select> */}
          <div>
            <p className="text-white text-lg font-semibold mt-3">Select By </p>
            <select
              value={selectType}
              onChange={(text) => {
                setSelectType(text.target.value);
                if (text.target.value === "Months") {
                  setMonth(moment(new Date()).format("YYYY-MM"));
                  getStartAndEndDates(moment(new Date()).format("YYYY-MM"));
                }
                if (text.target.value === "Weeks") {
                  const weekNumber = moment().week()
                  setWeek(weekNumber);
                  weekHandler(weekNumber);
                }
              }}
              className="rounded-md w-1/2 border-2 h-11 mb-10 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5"
            >
              <option value="Months">Month</option>
              <option value="Weeks">Weeks</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2 items-start">
            {selectType === "Months" && (
              <div className=" col-span-1 ">
                <p className="text-white text-lg font-semibold mt-3">
                  Months
                </p>
                <div className="flex gap-2 items-center w-full ">
                  <input
                    type="month"
                    className="rounded-md w-full border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5"
                    value={month}
                    onChange={(e) => {
                      setMonth(moment(e.target.value).format("YYYY-MM"));
                      getStartAndEndDates(
                        moment(e.target.value).format("YYYY-MM")
                      );
                    }}
                  />
                </div>
              </div>
            )}
            {selectType === "Weeks" && (
              <div>
                <p className="text-white text-lg font-semibold mt-3">Weeks </p>
                <div className="flex gap-2 items-center">
                  <select
                    className=" w-full rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-2.5 "
                    value={week}
                    onChange={(e) => {
                      setWeek(e.target.value);
                      weekHandler(Number(e.target.value));
                    }}
                  >
                    {getWeekNumbersForYear(
                      new Date(billInfo?.start).getFullYear()
                    ).map((week, idx) => (
                      <option value={week} key={idx}>
                        {typeof week === "number"
                          ? `${week + " WK"}`
                          : week}
                      </option>
                    ))}
                  </select>
                  {/* <p className="text-white">
                  {moment(weekStartDate).format("yyyy/MM/DD")} -{" "}
                  {moment(weekEndDate).format(
                    "yyyy/MM/DD"
                  )}{" "}
                </p> */}
                </div>
              </div>
            )}
          </div>
          {selectType === "Custom" && (
            <div>
              <p className="text-white text-lg font-semibold mt-3">
                Customize Date
              </p>
              <div className="grid md:grid-cols-2 grid-cols-1 items-start">
                <div className="grid grid-cols-1 md:mr-2 ">
                  <p className="text-white text-md font-semibold mt-1">
                    Start Date
                  </p>
                  <input
                    value={billInfo.start}
                    onChange={(text) => {
                      setBillInfo({ ...billInfo, start: text.target.value });
                    }}
                    type="date"
                    className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 "
                  />
                  {submitted && billInfo.start === "" && (
                    <p className="text-red-700 mt-1">End date is required</p>
                  )}
                </div>
                <div className="grid grid-cols-1">
                  <p className="text-white text-md font-semibold mt-1">
                    End Date
                  </p>
                  <input
                    value={billInfo.end}
                    onChange={(text) => {
                      if (
                        new Date(text.target.value) < new Date(billInfo.start)
                      ) {
                        props.toaster({
                          type: "error",
                          message: "End date must be after start date",
                        });
                        return;
                      }
                      setBillInfo({ ...billInfo, end: text.target.value });
                    }}
                    type="date"
                    className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black  p-1.5 "
                  />
                  {submitted && billInfo.end === "" && (
                    <p className="text-red-700 mt-1">End date is required</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="flex mt-5 justify-end">
            <button
              className="bg-green-700 text-white py-1 px-2 rounded-md"
              onClick={getClientList}
            >
              Search
            </button>
            {/* <button
            className="bg-white text-red-700 py-1 px-3 rounded-md ml-2"
            onClick={() => {
              setBillInfo({
                start: new Date(),
                end: new Date(),
                client_id: "",
              });
            }}
          >
            Reset
          </button> */}
          </div>
        </div>

        {/* <div className="border-2 border-red-700 rounded-lg p-5">
          <div className="flex mb-5 justify-end">
            <button
              className="bg-green-700 text-white py-1 px-2 rounded-md"
              onClick={() => submits(props.guardRange)}
            >
              Generate Invoices
            </button> */}
        {/* <button
            className="bg-white text-red-700 py-1 px-3 rounded-md ml-2"
            onClick={() => {
              setBillInfo({
                start: new Date(),
                end: new Date(),
                client_id: "",
              });
            }}
          >
            Reset
          </button> */}
        {/* </div> */}

        <ClientList
          data={clentData}
          {...props}
          getClientList={getClientList}
          billInfo={billInfo}
          setBillInfo={setBillInfo}
          excelData={excelData}
          setBillId={props.setBillId}
          isrefresh={props.isrefresh}
          setIsRefresh={props.setIsRefresh}
        />
        {/* </div> */}
      </div>
      {/* <Payroll {...props} /> */}
      {/* <div className="mt-5">
        <div className="border-2 border-red-700 rounded-lg p-5">
          <p className="text-white text-lg font-bold">
            Payroll from {guardRange?.startDate} to{" "}
            {guardRange?.endDate}
          </p>

          <div className="flex justify-end items-start">
          </div>
      
          <div className=" grid md:grid-cols-2 grid-cols-1  mt-5">
            <div className="grid grid-cols-1 md:mr-2 ">
              <p className="text-white text-lg font-semibold mt-2">
                Start Date
              </p>
              <input
                value={guardRange?.startDate}
                onChange={(text) => {
                  setGuardRange({
                    ...guardRange,
                    startDate: text.target.value,
                  });
                  localStorage.setItem("start", text.target.value);
                  props?.gaurdHistory.forEach((ele) => {
                    ele.startDate = text.target.value;
                  });
                  props?.setGuardHistory([...props?.gaurdHistory]);
                }}
                type="date"
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 "
              />
            </div>
            <div className="grid grid-cols-1">
              <p className="text-white text-lg font-semibold mt-2">End Date</p>
              <input
                value={guardRange?.endDate}
                onChange={(text) => {
                  setGuardRange({
                    ...guardRange,
                    endDate: text.target.value,
                  });
                  localStorage.setItem("end", text.target.value);
                  props?.gaurdHistory.forEach((ele) => {
                    ele.endDate = text.target.value;
                  });

                  props?.setGuardHistory([...props?.gaurdHistory]);
                }}
                type="date"
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black  p-1.5 "
              />
            </div>

          </div>

          <div className=" flex justify-between mt-5">
            <ExcelDownloder
              filename={"book"}
              type={Type.Button} 
            >
              <button className="bg-red-700 text-white py-1 px-3 rounded-md ml-2">
                Excel
              </button>
            </ExcelDownloder>
            <button
              className="bg-green-700 text-white py-1 px-2 rounded-md"
              onClick={() => {
                props?.getGuardHistory(guardRange);
              }}
            >
              Search
            </button>
          </div>
        </div>
        <InvoicesList
          data={props?.gaurdHistory}
          {...props}
          guardRange={guardRange}
          ActionSection={ActionSection}

        />
      
      </div> */}


    </div>
  );
};

export default Bill;
