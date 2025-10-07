/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useContext } from "react";
import { Api } from "../../src/services/service";
import { checkForEmptyKeys } from "../../src/services/InputsNullChecker";
import LocationDropdown from "../../src/components/LocationDropdown";
import { userContext } from "../_app";

const options = [];

const Register = (props) => {
  const { clienID } = props;
  const [submitted, setSubmitted] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [user, setUser] = useContext(userContext)
  const [clientObj, setClientObj] = useState({
    fullName: "",
    billingName: "",
    // WorkerRatePerHour: "",
    // TaskType: "",
    rate: "",
    vat: "",
    address: "",
    billingAddress: "",
    email: "",
    phoneNumber: "",
    clientRef: "",
    billingcycle: "Weekly",
    discount: '0'
  });

  useEffect(() => {
    const getClientList = () => {
      props.loader(true);
      Api("get", `provider/client/${clienID}`, "", props.router).then(
        async (res) => {
          props.loader(false);
          if (res?.status) {
            const client = res.data.clients.find((c) => c._id === clienID);
            setClientObj({
              fullName: client.fullName,
              billingName: client.billingName,
              rate: client.rate,
              vat: client.vat,
              address: client.address,
              // WorkerRatePerHour: client.WorkerRatePerHour,
              // TaskType: client.TaskType,
              billingAddress: client.billingAddress,
              email: client.email,
              phoneNumber: client.phoneNumber,
              clientRef: client.clientRef,
              billingcycle: client?.billingcycle || "Weekly",
              discount: client?.discount || '0'
            });
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
    if (!!clienID) {
      getClientList();
    }
    getConfig()
  }, [clienID, props]);

  const getConfig = () => {
    Api("get", "user/config", "", props.router).then((res) => {
      if (res.status) {
        setTaskList(res.data.title);
      } else {
        props.toaster({ type: "error", message: res.message });
      }
    });
  };
  const submit = () => {
    // const user = localStorage.getItem("userDetail");

    let { anyEmptyInputs } = checkForEmptyKeys(clientObj);
    if (anyEmptyInputs.length > 0) {
      setSubmitted(true);
      return;
    }
    const Client = {
      ...clientObj,
      organization: user.isOrganization ? user.id : undefined
    };
    console.log(user.isOrganization);
    console.log(user.id);
    console.log(Client);
    Api("post", "provider/regClient", Client, props.router).then((res) => {
      props.loader(false);
      props.setShowForm(false);
      props.getClientList();
      if (res.status) {
        setClientObj({
          fullName: "",
          billingName: "",
          rate: "",
          vat: "",
          address: "",
          // WorkerRatePerHour: "",
          // TaskType: "",
          billingAddress: "",
          email: "",
          phoneNumber: "",
          clientRef: "",
          billingcycle: "Weekly",
          discount: ""
        });
      } else {
        props.toaster({ type: "error", message: res.message });
      }
    });
  };

  const Update = () => {

    let { anyEmptyInputs } = checkForEmptyKeys(clientObj);
    console.log(anyEmptyInputs);
    if (anyEmptyInputs.length > 0) {
      if (anyEmptyInputs.includes("VAT") || anyEmptyInputs.includes("VAT")) {
      } else {
        setSubmitted(true);
        return;
      }
    }

    const Client = {
      ...clientObj,
      organization: user.isOrganization ? user.id : undefined
    };

    Api("put", `provider/client/${clienID}`, Client, props.router).then(
      (res) => {
        props.loader(false);
        props.setShowForm(false);
        props.getClientList();
        if (res.status) {
          setClientObj({
            fullName: "",
            billingName: "",
            rate: "",
            vat: "",
            address: "",
            // WorkerRatePerHour: "",
            // TaskType: "",
            billingAddress: "",
            email: "",
            phoneNumber: "",
            clientRef: "",
          });
        } else {
          props.toaster({ type: "error", message: res.message });
        }
      }
    );
  };

  const getLocationVaue = (lat, add) => {
    setClientObj({
      ...clientObj,
      //   latitude: lat.lat.toString(),
      //   longitude: lat.lng.toString(),
      address: add,
    });
  };

  const getLocationVaue2 = (lat, add) => {
    setClientObj({
      ...clientObj,
      //   latitude: lat.lat.toString(),
      //   longitude: lat.lng.toString(),
      billingAddress: add,
    });
  };

  return (
    <div className=" bg-black overflow-x-auto">
      <div className="pt-16 pb-5 ">
        <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-3 rounded-sm  border-t-4 border-red-700 ">
          <div>
            <p className="text-white font-bold md:text-3xl text-lg">
              {!!clienID ? "Update Client" : "Register new client"}
            </p>
          </div>
        </div>

        <div className=" border-2 border-red-700 rounded-sm p-5">
          <div className="grid md:grid-cols-2 grid-cols-1 items-start">
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold">
                Client/Building/Business name{" "}
              </p>
              <input
                value={clientObj.fullName}
                onChange={(text) => {
                  setClientObj({ ...clientObj, fullName: text.target.value });
                }}
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
              {submitted && clientObj.fullName === "" && (
                <p className="text-red-700 mt-1">Full Name is required</p>
              )}
            </div>
            <div className="grid grid-cols-1 ">
              <p className="text-white text-lg font-semibold">Billing Name</p>
              <input
                value={clientObj.billingName}
                onChange={(text) => {
                  setClientObj({
                    ...clientObj,
                    billingName: text.target.value,
                  });
                }}
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
              {submitted && clientObj.billingName === "" && (
                <p className="text-red-700 mt-1">Billing Name is required</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 mt-3 items-start">
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold">Client Rate Per Hour</p>
              <input
                value={clientObj.rate}
                type="number"
                onChange={(text) => {
                  setClientObj({ ...clientObj, rate: text.target.value });
                }}
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
              {submitted && clientObj.rate === "" && (
                <p className="text-red-700 mt-1">Rate is required</p>
              )}
            </div>
            {/* <div className="grid grid-cols-1 ">
              <p className="text-white text-lg font-semibold">Worker Rate Per Hour</p>
              <input
                value={clientObj.WorkerRatePerHour}
                type="number"
                onChange={(text) => {
                  setClientObj({ ...clientObj, WorkerRatePerHour: text.target.value });
                }}
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
              {submitted && clientObj.WorkerRatePerHour === "" && (
                <p className="text-red-700 mt-1">Worker Rate Per Hour is required</p>
              )}
            </div> */}

            <div className="grid grid-cols-1 md:mr-2 mt-2">
              <p className="text-white text-lg font-semibold">Vat (%)</p>
              <input
                value={clientObj.vat}
                type="number"
                onChange={(text) => {
                  setClientObj({ ...clientObj, vat: text.target.value });
                }}
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
              {submitted && clientObj.vat === "" && (
                <p className="text-red-700 mt-1">Vat is required</p>
              )}
            </div>
            {/* <div className="grid grid-cols-1 mt-3">
              <p className="text-white text-lg font-semibold">Task Type</p>
              <select
                value={clientObj.TaskType}
                onChange={(e) => {
                  setClientObj({ ...clientObj, TaskType: e.target.value });
                }}
                className={`rounded-md border-2 border-red-900 mt-1 outline-none ${clientObj.TaskType === "" ? "text-neutral-500" : "text-neutral-500"
                  } bg-black p-2`}
              >
                <option className="text-red-700" value="">
                  Select Task Type
                </option>
                {taskList.map((type, index) => (
                  <option className="text-red-700" value={type.name} key={index}>
                    {type.name}
                  </option>
                ))}
              </select>

              {submitted && clientObj.TaskType === "" && (
                <p className="text-red-700 mt-1">Task Type is required</p>
              )}
            </div> */}

          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 mt-3 items-start">
            <div className="grid grid-cols-1  items-start md:mr-2">
              <LocationDropdown
                value={clientObj.address}
                getLocationVaue={getLocationVaue}
                setClientObj={setClientObj}
                title="Work Location"
              />
              {submitted && clientObj.address === "" && (
                <p className="text-red-700 mt-1">Address is required</p>
              )}
            </div>
            <div className="grid grid-cols-1  items-start ">
              <LocationDropdown
                value={clientObj.billingAddress}
                getLocationVaue={getLocationVaue2}
                setClientObj={setClientObj}
                title="Billing Address"
              />
              {submitted && clientObj.billingAddress === "" && (
                <p className="text-red-700 mt-1">Billing Address is required</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 items-start mt-3 ">
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold">Email</p>
              <input
                value={clientObj.email}
                onChange={(text) => {
                  setClientObj({ ...clientObj, email: text.target.value });
                }}
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
              {submitted && clientObj.email === "" && (
                <p className="text-red-700 mt-1">Email is required</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold">Phone Number</p>
              <input
                value={clientObj.phoneNumber}
                onChange={(text) => {
                  setClientObj({
                    ...clientObj,
                    phoneNumber: text.target.value,
                  });
                }}
                type="number"
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
              {submitted && clientObj.phoneNumber === "" && (
                <p className="text-red-700 mt-1">Phone Number is required</p>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 items-start mt-3 ">
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold">Billing Cycle</p>
              {/* <input
                value={clientObj.clientRef}
                onChange={(text) => {
                  setClientObj({ ...clientObj, clientRef: text.target.value });
                }}
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              /> */}
              <select
                value={clientObj.billingcycle}
                onChange={(text) => {
                  setClientObj({
                    ...clientObj,
                    billingcycle: text.target.value,
                  });
                }}
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-2.5 icncolor"
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
              {submitted && clientObj.billingcycle === "" && (
                <p className="text-red-700 mt-1">Billing Cycle is required</p>
              )}
            </div>

            <div className="grid grid-cols-1 ">
              <p className="text-white text-lg font-semibold">Client Ref</p>
              <input
                value={clientObj.clientRef}
                onChange={(text) => {
                  setClientObj({ ...clientObj, clientRef: text.target.value });
                }}
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
              {submitted && clientObj.clientRef === "" && (
                <p className="text-red-700 mt-1">Client Ref is required</p>
              )}
            </div>

            <div className="grid grid-cols-1 mt-1">
              <p className="text-white text-lg font-semibold">Discount (%)</p>
              <input
                value={clientObj.discount}
                type="number"
                onChange={(text) => {
                  setClientObj({ ...clientObj, discount: text.target.value });
                }}
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
              />
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="text-white bg-red-700 rounded-sm  text-md py-21 w-40 h-10"
              //   onClick={props.repeat === "Update Task" ? updateJob : submit}
              onClick={!!clienID ? Update : submit}
            >
              {!!clienID ? "Update client" : "Register new client"}
            </button>
            <button
              className="text-white bg-red-700 rounded-sm  text-md py-21 w-36 h-10"
              onClick={() => {
                props.setShowForm(false);
                setClientObj({
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

export default Register;
