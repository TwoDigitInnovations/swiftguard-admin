/* eslint-disable react-hooks/exhaustive-deps */
import { DoughnutChart } from "../src/components/daughnutChart";
import { LineChart } from "../src/components/lineChart";
import { StockBarChart } from "../src/components/stackedBarChar";
import { Api, sortByMonth } from "../src/services/service";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import moment from "moment";
import DateTimeRangeContainer from "react-advanced-datetimerange-picker";
import CountUp from "react-countup";

const Statistics = (props) => {
  const { user, organization } = props;
  const router = useRouter();
  const [stockBar, setStockBar] = useState();
  const [bar, setBar] = useState();
  const [line, setLine] = useState();
  const [orgId, setOrgId] = useState("");
  const [daughNut, setDaughNut] = useState();
  const [types, setTypes] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [jobInfo, setJobInfo] = useState({
    startDate: moment(new Date()).format("YYYY-MM-DD"),
    endDate: moment(
      new Date(new Date().setDate(new Date().getDate() + 1))
    ).format("YYYY-MM-DD"),
  });

  const [boxData, setBoxData] = useState({})

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
    format: "YYYY-MM-DD",
    sundayFirst: false,
  };
  useEffect(() => {
    var curr = new Date(); // get current date
    // var last = curr.getDate(); // First day is the day of the month - the day of the week
    // var first = last - 7; // last day is the first day + 6

    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 7; // last day is the first day + 6

    var firstday = moment(
      new Date(curr.setDate(first + 1)).toUTCString()
    ).format("YYYY-MM-DD");
    var lastday = moment(new Date(curr.setDate(last)).toUTCString()).format(
      "YYYY-MM-DD"
    );
    const currDate = new Date().getTime();
    const lastWDate = moment(
      new Date(currDate - 7 * 60 * 60 * 24 * 1000)
    ).format("YYYY-MM-DD");
    if (organization._id !== undefined) {
      getStockBarsForBoxes(`admin/stats/3/${organization._id}/AGGREGATE`)

      setOrgId(organization._id);
      getline(
        `admin/stats/1/${organization._id}/AGGREGATE?startDate=${firstday}&endDate=${lastday}`
      );
      getStockBar(
        `admin/stats/3/${organization._id}/AGGREGATE?startDate=${firstday}&endDate=${lastday}`
      );
      getDaughNut(
        `admin/stats/4/${organization._id}?startDate=${firstday}&endDate=${lastday}`
      );
    } else if (user?.isOrganization) {
      setOrgId(user?._id || user?.id);
      getStockBarsForBoxes(`admin/stats/3/${user?._id || user?.id}/AGGREGATE`)
      getline(
        `admin/stats/1/${user?._id || user?.id
        }/AGGREGATE?startDate=${firstday}&endDate=${lastday}`
      );
      getStockBar(
        `admin/stats/3/${user?._id || user?.id
        }/AGGREGATE?startDate=${firstday}&endDate=${lastday}`
      );
      getDaughNut(
        `admin/stats/4/${user?._id || user?.id
        }?startDate=${firstday}&endDate=${lastday}`
      );
    }
  }, [organization]);

  const changeType = (view) => {
    if (view === 'DAILY') {

      var curr = new Date(); // get current date
      // var last = curr.getDate(); // First day is the day of the month - the day of the week
      // var first = last - 7;
      var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      var last = first + 7; // last day is the first day + 6
      var firstday = moment(
        new Date(curr.setDate(first + 1)).toUTCString()
      ).format("YYYY-MM-DD");
      var lastday = moment(new Date(curr.setDate(last)).toUTCString()).format(
        "YYYY-MM-DD"
      );


      getline(
        `admin/stats/1/${orgId}/${view}?startDate=${firstday}&endDate=${lastday}`
      );
      getStockBar(
        `admin/stats/3/${orgId}/${view}?startDate=${firstday}&endDate=${lastday}`
      );
      getDaughNut(
        `admin/stats/4/${orgId}?startDate=${firstday}&endDate=${lastday}`
      );
      // getline(`admin/stats/1/${orgId}/${view}`);
      // getStockBar(`admin/stats/3/${orgId}/${view}`);
      // getDaughNut(`admin/stats/4/${orgId}`);
    } else {
      getline(`admin/stats/1/${orgId}/${view}`);
      getStockBar(`admin/stats/3/${orgId}/${view}`);
      getDaughNut(`admin/stats/4/${orgId}`);
    }
  };

  let applyCallback = async (startDate, endDate) => {
    setJobInfo({
      startDate: moment(startDate._d).format("YYYY-MM-DD"),
      endDate: moment(endDate._d).format("YYYY-MM-DD"),
    });
    setstart(startDate);
    setend(endDate);
  };

  const getline = (url) => {
    props.loader(true);
    Api("GET", url, "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          const data = await sortByMonth(res.data.stats);
          console.log(data)
          setLine(res.data);
        } else {
          props.toaster({ type: "success", message: res?.message });
        }
      },
      (err) => {
        console.log(err);
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
        console.log(err);
      }
    );
  };

  const getBar = (url) => {
    props.loader(true);
    Api("GET", url, "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          setBar(res.data);
        } else {
          props.toaster({ type: "success", message: res?.message });
        }
      },
      (err) => {
        console.log(err);
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
        console.log(err);
      }
    );
  };

  const getStockBar = (url, isAgre) => {
    props.loader(true);
    Api("GET", url, "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          console.log(isAgre)
          if (isAgre) {
            const data = {
              "_id": "2024-06-17",
              "Wage": 0,
              "Profit": 0,
              "Vat": 0,
              "Net Income": 0
            }
            res.data.stats.forEach(element => {
              data['Net Income'] = element['Net Income'] + data['Net Income']
              data.Profit = element.Profit + data.Profit
              data.Vat = element.Vat + data.Vat
              data.Wage = element.Wage + data.Wage
            });

            console.log(data)
            data._id = `${jobInfo?.startDate} - ${jobInfo?.endDate}`
            setStockBar({ ...res.data, stats: [data] })
          } else {
            setStockBar(res.data);
          }

          // if (view === 'AGGREGATE') {
          //   const currentYear = moment().format('YYYY');
          //   const year = [Number(currentYear) - 5, Number(currentYear) - 4, Number(currentYear) - 3, Number(currentYear) - 2, Number(currentYear) - 1, Number(currentYear)]
          //   let lable = []
          //   let newData = []
          //   year.reverse().forEach(ele => {
          //     const d = res.data?.stats.find(f => f._id === ele)
          //     if (d) {
          //       newData.push(d)
          //     } else {
          //       newData.push(
          //         {
          //           "_id": ele,
          //           "Wage": 0,
          //           "Profit": 0,
          //           "Vat": 0,
          //           "Net Income": 0
          //         })
          //     }

          //   });
          //   console.log(newData)
          //   setStockBar({ ...res.data, stats: newData })
          // } else {
          //   setStockBar(res.data);
          // }



        } else {
          props.toaster({ type: "success", message: res?.message });
        }
      },
      (err) => {
        console.log(err);
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
        console.log(err);
      }
    );
  };

  const getStockBarsForBoxes = (url) => {
    props.loader(true);
    Api("GET", url, "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          if (res?.data?.stats && res.data.stats.length > 0) {
            const year = moment().format('YYYY')
            const newdata = res.data.stats.find(f => f._id === Number(year))
            console.log(newdata)
            setBoxData(newdata);
          }
        } else {
          props.toaster({ type: "success", message: res?.message });
        }
      },
      (err) => {
        console.log(err);
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
        console.log(err);
      }
    );
  };

  const getDaughNut = (url) => {
    props.loader(true);
    Api("GET", url, "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          setDaughNut(res.data);
        } else {
          props.toaster({ type: "success", message: res?.message });
        }
      },
      (err) => {
        console.log(err);
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
        console.log(err);
      }
    );
  };

  return (
    <div className="min-h-screen bg-black md:p-5 p-3  pt-16 md:mt-0 pb-10">
      < div className="md:mt-0 mt-5">
        <div className="grid md:grid-cols-3 grid-col-1 gap-3">
          <div className="border-2  border-customGray  border-t-red-700 border-t-4 relative flex justify-center    cursor-pointer" >
            <div className="bg-customGray w-full flex justify-between items-center h-16 rounded-md px-5">
              <p className="font-bold text-lg text-center text-white  px-3">Profit</p>
              <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                <CountUp end={boxData?.Profit || 0} />
              </p>
            </div>
          </div>
          <div className="border-2  border-customGray  border-t-red-700 border-t-4    relative flex justify-center   cursor-pointer" >
            <div className="bg-customGray w-full flex justify-between items-center h-16 rounded-md px-5">
              <p className="font-bold text-lg text-center text-white  px-3">Vat</p>
              <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                <CountUp end={boxData?.Vat || 0} />
              </p>
            </div>
          </div>

          <div className="border-2  border-customGray  border-t-red-700 border-t-4   relative flex justify-center    cursor-pointer" >
            <div className="bg-customGray w-full flex justify-between items-center h-16 rounded-md px-5">
              <p className="font-bold text-lg text-center text-white  px-3">Revenue</p>
              <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                <CountUp end={(boxData?.Vat + boxData?.['Net Income']) || 0} />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between w-full md:col-span-1 col-span-2 mb-2 mt-3">
        <div>
          {!showForm && (
            <button
              className={`text-white px-3 md:h-10 h-7 bg-red-700 md:text-md f10 border-2 border-red-700 `}
              onClick={() => {
                setShowForm(true);
              }}
            >
              Enter Report Period
            </button>
          )}
        </div>
        <div>
          <p className="text-white">{showDate}</p>
        </div>
        <div className="flex md:h-10 h-7  rounded-sm items-center justify-center   bg-black">
          <button
            className={`text-white px-3 md:h-10 h-7 hover:bg-red-700 md:text-md f10 border-2 border-red-700 ${types === "AGGREGATE" && "bg-red-700 border-red-700"
              }`}
            onClick={() => {
              setShowDate(false);
              setTypes("AGGREGATE");
              changeType("AGGREGATE");
            }}
          >
            Yearly view
          </button>

          <button
            className={`text-white px-3 md:h-10 h-7 hover:bg-red-700 md:text-md f10 border-2 border-red-700 ml-2 ${types === "MONTHLY" && "bg-red-700 border-red-700"
              }`}
            onClick={() => {
              setShowDate(false);
              setTypes("MONTHLY");
              changeType("MONTHLY");
            }}
          >
            Month view
          </button>

          <button
            className={`text-white px-3 md:h-10 h-7 hover:bg-red-700 md:text-md f10 border-2 border-red-700 ml-2 ${types === "DAILY" && "bg-red-700 border-red-700"
              }`}
            onClick={() => {
              setShowDate(false);
              setTypes("DAILY");
              changeType("DAILY");
            }}
          >
            Daily view
          </button>
        </div>
      </div>
      {showForm && (
        <div className="h-auto">
          <div className=" pb-5">
            <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-3 rounded-sm  border-t-4 border-red-700 ">
              <div>
                <p className="text-white font-bold md:text-3xl text-lg">
                  Select Report Period
                </p>
              </div>
            </div>

            <div className=" border-2 border-red-700 rounded-sm p-5">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div className="grid grid-cols-1">
                  <p className="text-white text-lg font-semibold">
                    {"Start Date"}
                  </p>
                  <input
                    value={jobInfo?.startDate}
                    max={jobInfo.endDate}
                    onChange={(text) => {
                      setJobInfo({ ...jobInfo, startDate: text.target.value });
                      // getJobHour(text.target.value, jobInfo?.endDate);
                    }}
                    type="date"
                    className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 "
                  />
                </div>

                <div className="grid grid-cols-1">
                  <p className="text-white text-lg font-semibold">
                    {"End Date"}
                  </p>
                  <input
                    value={jobInfo.endDate}
                    min={jobInfo.startDate}
                    onChange={(text) => {
                      setJobInfo({ ...jobInfo, endDate: text.target.value });
                      // getJobHour(jobInfo?.startDate, text.target.value);
                    }}
                    type="date"
                    className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 "
                  />
                </div>
              </div>
              {/* <div className="grid  grid-cols-1 items-start">
                <div className="grid grid-cols-1 ">
                  <p className="text-white text-lg font-semibold">
                    {"Start Date - End Date"}
                  </p>
                  <DateTimeRangeContainer
                    className="cal"
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
                      value={jobInfo?.startDate + "  ~  " + jobInfo?.endDate}
                      onChange={() => { }}
                      placeholder="Enter text"
                      className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5  w-full"
                    />
                  </DateTimeRangeContainer>
                </div>
              </div> */}

              <div className="md:flex justify-between mt-4">
                <div className="flex gap-5">
                  <button
                    className="text-white bg-red-700 rounded-sm  text-md py-21 w-36 h-10"
                    onClick={() => {
                      // setShowForm(false);
                      setShowDate(true);

                      // getline(
                      //   `admin/stats/1/${orgId}/${types}?startDate=${jobInfo?.startDate}&endDate=${jobInfo?.endDate}`
                      // );
                      // getStockBar(
                      //   `admin/stats/3/${orgId}/${types}?startDate=${jobInfo?.startDate}&endDate=${jobInfo?.endDate}`
                      // );
                      // getDaughNut(
                      //   `admin/stats/4/${orgId}?startDate=${jobInfo?.startDate.toString()}&endDate=${jobInfo?.endDate.toString()}`
                      // );
                      getline(
                        `admin/stats/1/${orgId}/AGGREGATE?startDate=${jobInfo?.startDate}&endDate=${jobInfo?.endDate}`
                      );
                      getStockBar(
                        `admin/stats/3/${orgId}/AGGREGATE?startDate=${jobInfo?.startDate}&endDate=${jobInfo?.endDate}`
                      );
                      getDaughNut(
                        `admin/stats/4/${orgId}?startDate=${jobInfo?.startDate.toString()}&endDate=${jobInfo?.endDate.toString()}`
                      );
                      setTypes("")
                    }}
                  >
                    Search
                  </button>
                  <button className="text-white bg-red-700 rounded-sm  text-md py-21 w-36 h-10"
                    onClick={() => {
                      // setShowForm(false);
                      setShowDate(true);

                      getline(
                        `admin/stats/1/${orgId}/AGGREGATE?startDate=${jobInfo?.startDate}&endDate=${jobInfo?.endDate}`
                      );
                      getStockBar(
                        `admin/stats/3/${orgId}/AGGREGATE?startDate=${jobInfo?.startDate}&endDate=${jobInfo?.endDate}`, true
                      );
                      getDaughNut(
                        `admin/stats/4/${orgId}?startDate=${jobInfo?.startDate.toString()}&endDate=${jobInfo?.endDate.toString()}`
                      );
                      setTypes("")
                    }}>
                    Aggregate View
                  </button>
                </div>

                <button
                  className="text-white bg-red-700 rounded-sm  text-md py-21 w-36 h-10 md:mt-0 mt-5"
                  onClick={() => {
                    setShowForm(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-3 rounded-sm  border-t-4 border-red-700 ">
        <div>
          <p className="text-white font-bold md:text-3xl text-lg">
            Income Reports
          </p>
        </div>
      </div>

      <div className=" border-2 border-red-700 rounded-sm p-5">
        <div className="bg-white rounded-md max-h-80 ">
          <StockBarChart stockBar={stockBar} types={types} />
        </div>
        <div className="bg-white rounded-md max-h-80 mt-5">
          <LineChart data={line} types={types} />
        </div>

        <div className="  max-h-96 mt-5 ">
          <div className="bg-white rounded-md pb-5">
            <p className="text-center py-4 font-semibold text-sm text-gray-700">
              {daughNut?.message}
            </p>
            <DoughnutChart daughNut={daughNut} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
