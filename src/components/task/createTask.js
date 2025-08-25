/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from "react";
import { Api } from "../../services/service";
import { checkForEmptyKeys } from "../../services/InputsNullChecker";
import LocationDropdown from "../LocationDropdown";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";
import JobFilter from "../JobFilter";
import DateTimeRangeContainer from "react-advanced-datetimerange-picker";
import DateTimePicker from "react-datetime-picker";
import Select from "react-dropdown-select";
import _, { map } from 'underscore';

const CreateTask = (props) => {
  // const router = useRouter();
  const [clientlist, setClientList] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [jobInfo, setJobInfo] = useState({
    startDate: moment(new Date()).format().slice(0, 16),
    endDate: moment(new Date()).format().slice(0, 16),
    // endDate: new Date().setDate(new Date().getDate() + 1),
    // startTime: "",
    // endTime: "",
    title: "",
    location: "",
    latitude: "",
    longitude: "",
    description: "",
    jobtype: "event",
    amount: "",
    jobPerson: "",
  });
  const [publics, setPublic] = useState(false);

  const [taskList, setTaskList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [opt, setOpt] = useState([]);
  const [mainOpt, setMainOpt] = useState([]);
  const [clientOpt, setClientOpt] = useState([]);
  const [selectClient, setSelectClient] = useState([]);
  const [client, setClient] = useState("");
  const [pageURL, setPageURL] = useState("");
  const [isNativeShare, setNativeShare] = useState(false);
  const [value, onChange] = useState(new Date());
  const [isOrg, setIsOrg] = useState(false);
  const [isPast, setIsPast] = useState(false);
  const [currentUser, setCurrentUser] = useState([])

  let now = new Date();
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
  let maxDate = moment(start).add(24, "hour");

  let applyCallback = async (startDate, endDate) => {
    setJobInfo({
      ...jobInfo,
      startDate: startDate._d,
      endDate: endDate._d,
      hours: parseFloat(
        await JobFilter({
          startDate: startDate._d,
          endDate: endDate._d,
        })
      ).toFixed(2),
    });
    setstart(startDate);
    setend(endDate);
  };

  const getJobHour = async (startDate, endDate) => {
    setJobInfo({
      ...jobInfo,
      hours: parseFloat(await JobFilter({ startDate, endDate })).toFixed(2),
      startDate,
      endDate,
    });
  };

  useEffect(() => {
    if (props?.organization?._id || props.user.isOrganization) {
      setIsOrg(true);
    }
    setJobInfo({
      startDate: new Date(),
      endDate: new Date(),
      title: "",
      location: "",
      latitude: "",
      longitude: "",
      description:
        "Resumption: Please try to arrive 10 minutes before your resumption time so you can be at your duty post on time.\n\nDress code: Clean Black suit, white shirt, black shoes, and black tie.\n\nDuties: Customer service and security service.\n\nCancellation policy: If after accepting this shift, you change your mind, please notify the Operation Manager via text (07827297538) at least 48 hours before the start of your shift, otherwise you will be fined for not complying with our cancellation policy",
      jobtype: "event",
      amount: "",
      jobPerson: "",
    });
    getConfig();
    getClientList("");
  }, []);

  useEffect(() => {
    if (props?.organization?._id || props.user.isOrganization) {
      setIsOrg(true);
    }
    setJobInfo({
      startDate: new Date(),
      endDate: new Date(),
      title: "",
      location: "",
      latitude: "",
      longitude: "",
      description:
        "Resumption: Please try to arrive 10 minutes before your resumption time so you can be at your duty post on time.\n\nDress code: Clean Black suit, white shirt, black shoes, and black tie.\n\nDuties: Customer service and security service.\n\nCancellation policy: If after accepting this shift, you change your mind, please notify the Operation Manager via text (07827297538) at least 48 hours before the start of your shift, otherwise you will be fined for not complying with our cancellation policy",
      jobtype: "event",
      amount: "",
      jobPerson: "",
    });
    getConfig();
    getClientList("");
  }, [props?.jobId]);

  const getClientList = (client_id) => {
    props.loader(true);
    let url = "provider/client?sort=a";
    if (props?.organization?._id) {
      url = `provider/client?org_id=${props?.organization?._id}?sort=a`;
    }
    Api("get", url, "", props.router).then(
      async (res) => {
        // props.loader(false);
        if (res?.status) {
          let options = [];
          res.data.clients.forEach((ele, index) => {
            options.push({
              label: ele.fullName,
              value: ele._id,
              disabled: false,
              rate: ele.rate,
              address: ele.address,
            });
            if (res.data.clients.length === index + 1) {
              setClientOpt(options);
            }
          });
          setClientList(res.data.clients);
          getStaff(options);
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

  const getClientByUser = (client_id) => {
    props.loader(true);

    let url = `/getclientuser/${client_id}?sort=a`;

    Api("get", url, "", props.router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          console.log(res)
          setCurrentUser(res.data.users)

          let options = [];
          let userlist = []
          if (res.data.users.length > 0) {
            res.data.users.forEach((ele, index) => {
              options.push({
                label: `${ele.fullName} - Last Worked`,
                value: ele._id,
              });
              userlist.push(ele._id)
              if (res.data.users.length === index + 1) {

                const newOpt = opt.filter(f => !userlist.includes(f.value))

                console.log([...options, ...newOpt])
                setOpt([...options, ...newOpt])
                // setClientOpt(options);
              }
            });

          } else {
            setOpt(mainOpt)
          }

          // opt.forEach((ele, index) => {
          //   options.push({
          //     label: ele.fullName,
          //     value: ele._id,
          //   });
          //   if (res.data.users.length === index + 1) {
          //     setOpt([...options, ...opt])
          //     // setClientOpt(options);
          //   }
          // });
          // setClientList(res.data.clients);
          // getStaff(options);
        } else {
          props.loader(false);
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

  const getConfig = () => {
    // props.loader(true);

    Api("get", "user/config", "", props.router).then((res) => {
      // props.loader(false);
      if (res.status) {
        setTaskList(res.data.title);
      } else {
        props.toaster({ type: "error", message: res.message });
      }
    });
  };

  const getStaff = (o) => {
    props.loader(true);

    Api("post", "user/guardList?sort=a", "", props.router).then((res) => {
      if (res.status) {
        let options = [];
        res.data.guards.forEach((ele, index) => {
          options.push({
            label: ele.fullName, //username
            value: ele._id,
          });
          if (res.data.guards.length === index + 1) {
            setOpt(options);
            setMainOpt(options)
          }
        });

        if (!!props.jobId) {
          getJobDetail(props.jobId, o, options);
        } else {
          props.loader(false);
        }
      } else {
        props.toaster({ type: "error", message: res.message });
      }
    });
  };
  const getJobDetail = (id, o, guard) => {
    // props.loader(true);

    Api("get", `jobs/${id}`, "", props.router).then(async (res) => {
      props.loader(false);
      if (res.status) {
        setJobInfo({
          startDate: moment(new Date(res?.data?.job?.startDate))
            .format()
            .slice(0, 16),

          endDate: moment(new Date(res?.data?.job?.endDate))
            .format()
            .slice(0, 16),
          hours: res?.data?.job?.job_hrs.toFixed(2),
          title: res.data?.job?.title,
          location: res?.data?.job?.address || "",
          latitude: res.data?.job?.location?.coordinates[1],
          longitude: res.data?.job?.location?.coordinates[0],
          description: res.data?.job?.description,
          jobtype: res.data?.job?.type,
          amount: res?.data?.job?.amount?.toString(),
          jobPerson: res?.data?.job?.person.toString() || "",
        });
        let now = new Date(res?.data?.job?.startDate);
        let startt = moment(now);
        let end = new Date(res?.data?.job?.endDate);
        let ends = moment(end);
        setstart(startt);
        setend(ends);

        setPublic(res?.data?.job?.public);
        if (!!res?.data?.job?.client) {
          const c = o.find((f) => f.value === res?.data?.job?.client);
          setSelectClient([c]);
        }


        if (!!guard) {
          const std = res?.data?.job?.invited.map(f => f._id);
          const st = [...std, ...res?.data?.job?.applicant || []]
          st = _.unique(st)
          console.log(st)
          let c = [];
          st.forEach((el, i) => {
            const check = guard.find((v) => v.value === el);
            if (!!check) {
              c.push(check);
            }

            if (st.length === i + 1) {
              setSelected(c);
            }
          });
        }
      } else {
        props.toaster({ type: "error", message: res.message });
      }
    });
  };

  const updateJob = () => {
    const user = localStorage.getItem("userDetail");

    let { anyEmptyInputs } = checkForEmptyKeys(jobInfo);
    if (anyEmptyInputs.length > 0) {
      setSubmitted(true);
      return;
    }

    if (
      jobInfo.jobPerson === "" ||
      jobInfo.jobPerson === 0 ||
      jobInfo.jobPerson === "0"
    ) {
      setSubmitted(true);
      return;
    }

    if (jobInfo.amount == "") {
      setSubmitted(true);
      return;
    }

    if (jobInfo.latitude == "" || jobInfo.longitude == "") {
      props.toaster({
        type: "error",
        message: "Please select location from list",
      });
      return;
    }

    if (selectClient !== undefined && selectClient?.length > 0) {
      if (jobInfo.amount > selectClient[0].rate) {
        props.toaster({
          type: "error",
          message: `Please enter rate same or less as client rate `,
        });
        return;
      }
    }

    if (jobInfo.rate == "") {
      props.toaster({
        type: "error",
        message: "Please select the rate per hour",
      });
      return;
    }

    if (jobInfo?.hours <= 0 || jobInfo?.hours === undefined) {
      props.toaster({
        type: "error",
        message: "Please select currect date range",
      });
      return;
    }

    if (!!user) {
      const data = {
        title: jobInfo.title,
        amount: jobInfo.amount,
        description: jobInfo.description,
        posted_by:
          props?.organization?._id !== undefined
            ? props?.organization._id
            : props.user.id,
        startDate: moment(jobInfo.startDate).format(),
        endDate: moment(jobInfo.endDate).format(),
        type: jobInfo.jobtype,
        person: jobInfo.jobPerson,
        location: [jobInfo.longitude.toString(), jobInfo.latitude.toString()],
        address: jobInfo.location,
        public: publics,
        client_id: selectClient[0]?.value,
        isPast,
      };
      if (isPast && selected.length == 0) {
        setSubmitted(true);
        return;
      }

      if (!publics) {
        // if (selected.length == 0) {
        //   setSubmitted(true);
        //   return;
        // }
        if (selected.length > 0) {
          data.staff = [];
          selected.forEach((ele) => {
            data.staff.push(ele.value);
          });
        }
      }
      props.loader(true);
      console.log(data)
      Api("put", `jobs/${props.jobId}`, data, props.router).then((res) => {
        props.loader(false);
        if (res.status) {
          props.setShowForm(false);
          props.getJobs();
          props.updateTask();
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
        } else {
          props.toaster({ type: "error", message: res.message });
        }
      }, err => {
        props.loader(false);
        console.log(err)
        props.toaster({ type: "error", message: err.message });
      });
    }
  };

  const submit = (type) => {
    const user = localStorage.getItem("userDetail");
    let { anyEmptyInputs } = checkForEmptyKeys(jobInfo);
    if (anyEmptyInputs.length > 0) {
      if (jobInfo.client_id === undefined) {
      } else {
        setSubmitted(true);
        return;
      }
    }

    if (
      jobInfo.jobPerson === "" ||
      jobInfo.jobPerson === 0 ||
      jobInfo.jobPerson === "0"
    ) {
      setSubmitted(true);
      return;
    }

    if (jobInfo.amount == "") {
      setSubmitted(true);
      return;
    }

    if (jobInfo.latitude == "" || jobInfo.longitude == "") {
      props.toaster({
        type: "error",
        message: "Please select location from list",
      });
      return;
    }

    if (selectClient !== undefined && selectClient?.length > 0) {
      if (jobInfo.amount > selectClient[0].rate) {
        props.toaster({
          type: "error",
          message: `Please enter rate same or less as client rate `,
        });
        return;
      }
    }

    if (jobInfo.rate == "") {
      props.toaster({
        type: "error",
        message: "Please select the rate per hour",
      });
      return;
    }

    if (jobInfo?.hours <= 0 || jobInfo?.hours === undefined) {
      props.toaster({
        type: "error",
        message: "Please select currect date range",
      });
      return;
    }

    if (!!user) {
      const data = {
        title: jobInfo.title,
        amount: jobInfo.amount,
        description: jobInfo.description,
        client_id: selectClient[0]?.value,
        posted_by:
          props?.organization?._id !== undefined
            ? props?.organization._id
            : props.user.id,
        startDate: moment(jobInfo.startDate).format(),
        endDate: moment(jobInfo.endDate).format(),
        type: jobInfo.jobtype,
        person: jobInfo.jobPerson,
        location: [Number(jobInfo.longitude), Number(jobInfo.latitude)],
        address: jobInfo.location,
        public: publics,
      };

      if (isPast && selected.length == 0) {
        setSubmitted(true);
        return;
      }

      if (!publics) {

        if (selected.length > 0) {
          data.staff = [];
          selected.forEach((ele) => {
            data.staff.push(ele.value);
          });
        }
      }

      Api(
        "post",
        isPast ? "createtoassignjobs" : "jobs",
        data,
        props.router
      ).then((res) => {
        props.loader(false);
        if (res.status) {
          // if (isPast) {
          //   assignJob(res.data.id, data.staff);
          // } else {
          props.setShowForm(false);
          props.getJobs();
          props.updateTask();
          setIsPast(false);
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
          // }
        } else {
          props.toaster({ type: "error", message: res.message });
        }
      });
    }
  };

  const getLocationVaue = (lat, add) => {
    setJobInfo({
      ...jobInfo,
      latitude: lat.lat,
      longitude: lat.lng,
      location: add,
    });
  };

  const assignJob = (jobID, staff) => {
    props.loader(true);

    const data = {
      applicant: staff,
    };
    Api("post", `admin/jobs/${jobID}/assign`, data, props.router).then(
      async (res) => {
        props.loader(false);
        if (res.status) {
          props.setShowForm(false);
          props.getJobs();
          props.updateTask();
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

  useEffect(() => {
    if (jobInfo.endDate) {
      if (new Date().getTime() > new Date(jobInfo.endDate).getTime()) {
        setIsPast(true);
      } else {
        setIsPast(false);
      }
    }
  }, [jobInfo]);

  return (
    <div className=" bg-black  overflow-x-auto">
      <div className=" pb-5">
        <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-3 rounded-sm  border-t-4 border-red-700 ">
          <div>
            <p className="text-white font-bold md:text-3xl text-lg">
              {props.repeat}
            </p>
          </div>
        </div>

        <div className=" border-2 border-red-700 rounded-sm p-5">
          <div className="grid md:grid-cols-2 grid-cols-1 items-start">
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold">Task Name</p>
              <select
                value={jobInfo.title}
                onChange={(text) => {
                  setJobInfo({ ...jobInfo, title: text.target.value });
                }}
                name="cars"
                className={`rounded-md border-2 border-red-900 mt-1 outline-none ${jobInfo.title === "" ? "text-neutral-500" : "text-neutral-500"
                  }  bg-black p-2`}
              >
                <option className="text-red-700" value="">
                  Select Task
                </option>
                {taskList.map((item, index) => (
                  <option
                    className="text-red-700"
                    value={item.name}
                    key={index}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
              {submitted && jobInfo.title === "" && (
                <p className="text-red-700 mt-1">Task Name is required</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1">
              <div className="grid grid-cols-1">
                <p className="text-white text-lg font-semibold">
                  {"Start Date & Time"}
                </p>
                <input
                  value={jobInfo?.startDate}
                  max={jobInfo.endDate}
                  onChange={(text) => {
                    setJobInfo({ ...jobInfo, startDate: text.target.value });
                    getJobHour(text.target.value, jobInfo?.endDate);
                  }}
                  type="datetime-local"
                  className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 "
                />
              </div>

              <div className="grid grid-cols-1">
                <p className="text-white text-lg font-semibold">
                  {"End Date & Time"}
                </p>
                <input
                  value={jobInfo.endDate}
                  min={jobInfo.startDate}
                  onChange={(text) => {
                    setJobInfo({ ...jobInfo, endDate: text.target.value });
                    getJobHour(jobInfo?.startDate, text.target.value);
                  }}
                  type="datetime-local"
                  className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 "
                />
              </div>
            </div>
          </div>

          <div
            className={`grid ${isOrg ? "md:grid-cols-2 " : "md:grid-cols-1"
              } grid-cols-1 mt-3 items-start`}
          >
            {isOrg && (
              <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start md:mr-3">
                <p className="text-white text-lg font-semibold">
                  Select Client
                </p>
                <MultiSelect
                  options={clientOpt}
                  hasSelectAll={false}
                  value={selectClient}
                  onChange={(text) => {
                    console.log(text);
                    if (text.length > 1) {
                      setSelectClient([text[1]]);
                      getClientByUser(text[1].value)
                      setJobInfo({
                        ...jobInfo,
                        location: text[1]?.address,
                      });
                    } else if (text.length === 1) {
                      setSelectClient(text)
                      getClientByUser(text[0].value)
                      setJobInfo({
                        ...jobInfo,
                        location: text[0]?.address,
                      });
                    } else {
                      setSelectClient([])
                      setJobInfo({
                        ...jobInfo,
                        location: '',
                      });
                    }


                  }}

                  labelledBy="Select Client"
                  ClearSelectedIcon
                />
                {/* <Select
                  options={clientOpt}
                  values={selectClient}
                  onChange={(values) => {
                    console.log(values);
                    setSelectClient(values);
                    getClientByUser(values[0].value)
                    setJobInfo({
                      ...jobInfo,
                      location: values[0]?.address,
                    });
                  }}
                  className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 w-full"
                  multi={false}
                /> */}
              </div>
            )}

            <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start">
              <p className="text-white text-lg font-semibold">Hours</p>
              <input
                readOnly
                value={jobInfo?.hours}
                onChange={(text) => {
                  setJobInfo({ ...jobInfo, hours: text.target.value });
                }}
                min="0"
                type="number"
                placeholder="00"
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 icncolor"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 mt-3 items-start">
            <div className="grid grid-cols-1 md:mr-2 ">
              <div className="grid grid-cols-2 mb-1">
                <p className="text-white text-lg font-semibold ">
                  Select Staff
                </p>
                <div className="flex justify-end items-center md:pr-5">
                  <input
                    type="checkbox"
                    className="mr-3"
                    checked={publics}
                    onChange={(text) => {
                      setPublic(text.target.checked);
                    }}
                  />
                  <p className="text-white text-sm font-semibold">
                    Post for Every One
                  </p>
                </div>
              </div>
              <MultiSelect
                options={opt}
                value={selected}
                onChange={(text) => {
                  setSelected(text);
                }}
                labelledBy="Select Staff"
                ClearSelectedIcon
                disabled={publics}
              />
              {/* {submitted && !publics && selected.length == 0 && (
                <p className="text-red-700 mt-1">Staff is required</p>
              )} */}
            </div>

            <div className="grid grid-cols-1 ">
              <p className="text-white text-lg font-semibold">Guard Rate Per Hour</p>
              <input
                value={jobInfo.amount}
                onChange={(text) => {
                  setJobInfo({ ...jobInfo, amount: text.target.value });
                }}
                min="0"
                type="number"
                placeholder="£ 00"
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
              {submitted && jobInfo.amount === "" && (
                <p className="text-red-700 mt-1">Amount is required</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 mt-3 items-start">
            <div className="grid grid-cols-1  items-start">
              <div className="grid grid-cols-1 md:mr-2">
                <p className="text-white text-lg font-semibold">
                  Number of Staff
                </p>
                <input
                  value={jobInfo.jobPerson}
                  onChange={(text) => {
                    setJobInfo({ ...jobInfo, jobPerson: text.target.value });
                  }}
                  min="0"
                  type="number"
                  placeholder="00"
                  className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
                />
                {submitted && !jobInfo.jobPerson && (
                  <p className="text-red-700 mt-1">
                    Number of Staff is required
                  </p>
                )}
              </div>
            </div>
            <LocationDropdown
              value={jobInfo.location}
              getLocationVaue={getLocationVaue}
              setJobInfo={setJobInfo}
              title="Work Location"
            />
          </div>

          <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start">
            <p className="text-white text-lg font-semibold">
              Job Responsibility
            </p>
            <textarea
              value={jobInfo.description}
              onChange={(text) => {
                setJobInfo({ ...jobInfo, description: text.target.value });
              }}
              min="0"
              type="number"
              rows={5}
              className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
            />
            {submitted && jobInfo.description === "" && (
              <p className="text-red-700 mt-1">
                Job Responsibility is required
              </p>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex gap-5">
              <button
                disabled={isPast}
                className={`text-white ${isPast ? "bg-red-800" : "bg-red-600"
                  } rounded-sm  text-md py-21 w-36 h-10`}
                onClick={props.repeat === "Update Task" ? updateJob : submit}
              >
                {props.repeat === "Create New Task" ? "Create" : props.repeat}
              </button>
              {props.repeat !== "Update Task" && (
                <button
                  disabled={!isPast}
                  className={`text-white ${!isPast ? "bg-red-800" : "bg-red-600"
                    } rounded-sm  text-md py-21 w-36 h-10`}
                  onClick={() => {
                    submit("assign");
                  }}
                >
                  Assign
                </button>
              )}
              {props.repeat === "Update Task" && (
                <button
                  disabled={!isPast}
                  className={`text-white ${isPast ? "bg-red-800" : "bg-red-600"
                    } rounded-sm  text-md py-21 w-36 h-10`}
                  onClick={() => {
                    updateJob();
                  }}
                >
                  Update & Assign
                </button>
              )}
            </div>

            <button
              className="text-white bg-red-700 rounded-sm  text-md py-21 w-36 h-10"
              onClick={() => {
                props.setShowForm(false);
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
    </div>
  );
};

export default CreateTask;
