/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Api } from "../../src/services/service";
import { checkForEmptyKeys } from "../../src/services/InputsNullChecker";
import LocationDropdown from "../../src/components/LocationDropdown";
import { useRouter } from "next/router";
import Constants from "../../src/services/constant";
import moment from "moment";
import Organization from "./organization";

const CUorganization = (props) => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [organization, setorganization] = useState({
    organizationName: "",
    code: "",
    email: "",
    location: "",
    phone: "",
    // startTime: "",
    // endTime: "",
    // logo: "",
    // comment: "",
    // latitude: "",
    // longitude: "",
    username: "",
    password: "",
  });

  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    getConfig();
  }, []);

  const getConfig = () => {
    props.loader(true);

    Api("get", "user/config", "", router).then((res) => {
      props.loader(false);
      if (res.status) {
        setTaskList(res.data.title);
      } else {
        props.toaster({ type: "error", message: res.message });
      }
    });
  };

  const submit = () => {
    const user = localStorage.getItem("userDetail");
    let { anyEmptyInputs } = checkForEmptyKeys(organization);
    if (anyEmptyInputs.length > 0) {
      setSubmitted(true);
      return;
    }
    // if (organization.latitude == "" || organization.longitude == "") {
    //   props.toaster({
    //     type: "error",
    //     message: "Please select location from list",
    //   });
    //   return;
    // }

    if (!!user) {
      const data = {
        username: organization.username,
        password: organization.password,
        isOrganization: true,
        organization: organization.organizationName,
        email: organization.email,
        orgShortCode: organization.code,
        orgAddress: organization.location,
        orgPhone: organization.phone,
      };

      Api("post", "signUp", data, router).then((res) => {
        props.loader(false);
        if (res.status) {
          router.push("/organization/organization");
          setorganization({
            organizationName: "",
            code: "",
            email: "",
            location: "",
            phone: "",
            // startTime: "",
            // endTime: "",
            // logo: "",
            // comment: "",
            // latitude: "",
            // longitude: "",
            username: "",
            password: "",
          });
        } else {
          props.toaster({ type: "error", message: res.message });
        }
      });
    }
  };

  const getLocationVaue = (lat, add) => {
    setorganization({
      ...organization,
      latitude: lat.lat.toString(),
      longitude: lat.lng.toString(),
      location: add,
    });
  };

  return (
    <div className="min-h-screen bg-black md:-mt-16 overflow-x-auto">
      <div className="pt-20 ">
        <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-3 rounded-xl border-t-4 border-red-700 md:mx-5  mx-3">
          <div>
            <p className="text-white font-bold md:text-3xl text-lg">
              Organization
            </p>
          </div>
          <div className="flex justify-end" onClick={submit}>
            <button className="text-white bg-red-700 rounded-lg  mr-3 text-md py-21 w-32 ">
              Save
            </button>
          </div>
        </div>

        <div className="rounded-xl border-2 border-red-700 md:mx-5 mx-3 p-5">
          <div className="grid md:grid-cols-2 grid-cols-1">
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold mt-2">
                Organization Name
              </p>
              <input
                value={organization.organizationName}
                onChange={(text) => {
                  setorganization({
                    ...organization,
                    organizationName: text.target.value,
                  });
                }}
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
              />
              {submitted && organization.organizationName === "" && (
                <p className="text-red-700 mt-1">
                  Organization Name is required
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold mt-2">User Name</p>
              <input
                value={organization.username}
                onChange={(text) => {
                  setorganization({
                    ...organization,
                    username: text.target.value,
                  });
                }}
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
              />
              {submitted && organization.username === "" && (
                <p className="text-red-700 mt-1">UserName is required</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold mt-2">Password</p>
              <input
                value={organization.password}
                onChange={(text) => {
                  setorganization({
                    ...organization,
                    password: text.target.value,
                  });
                }}
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
              />
              {submitted && organization.password === "" && (
                <p className="text-red-700 mt-1">Password is required</p>
              )}
            </div>
            <div className="grid grid-cols-1">
              <p className="text-white text-lg font-semibold mt-2">
                Organization Short Code
              </p>
              <input
                value={organization.code}
                onChange={(text) => {
                  setorganization({
                    ...organization,
                    code: text.target.value,
                  });
                }}
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
              />
              {submitted && organization.code === "" && (
                <p className="text-red-700 mt-1">
                  Organization Short Code is required
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold mt-2">Email</p>
              <input
                value={organization.email}
                onChange={(text) => {
                  setorganization({
                    ...organization,
                    email: text.target.value,
                  });
                }}
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
              />
              {submitted && organization.email === "" && (
                <p className="text-red-700 mt-1">Email is required</p>
              )}
            </div>

            {/* <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold mt-2">Address</p>
              <input
                value={organization.location}
                onChange={(text) => {
                  setorganization({
                    ...organization,
                    location: text.target.value,
                  });
                }}
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
              />
              {submitted && organization.location === "" && (
                <p className="text-red-700 mt-1">Address is required</p>
              )}
            </div> */}
            <div className="grid grid-cols-1 mt-2">
              <LocationDropdown
                value={organization.location}
                getLocationVaue={getLocationVaue}
                setorganization={setorganization}
                title="Address"
              />
              {submitted && organization.location === "" && (
                <p className="text-red-700 mt-1">Address is required</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 grid-cols-1">
            <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold mt-2">
                Phone Number
              </p>
              <input
                value={organization.phone}
                onChange={(text) => {
                  setorganization({
                    ...organization,
                    phone: text.target.value,
                  });
                }}
                type="number"
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
              />
              {submitted && organization.phone === "" && (
                <p className="text-red-700 mt-1">Phone Number is required</p>
              )}
            </div>
            {/* <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold mt-2">
                Requires Billing Modules
              </p>
              <div className="grid grid-cols-2 border-2 rounded-md  border-red-900">
                <input
                  value={organization.startTime}
                  onChange={(text) => {
                    setorganization({
                      ...organization,
                      startTime: text.target.value,
                    });
                  }}
                  type="time"
                  className="outline-none rounded-md text-white bg-black  p-1.5 border-r-2   border-red-900"
                />
                <input
                  value={organization.endTime}
                  onChange={(text) => {
                    setorganization({
                      ...organization,
                      endTime: text.target.value,
                    });
                  }}
                  type="time"
                  className=" outline-none rounded-md text-white bg-black  p-1.5 "
                />
              </div>

              {submitted &&
                (organization.endTime === "" ||
                  organization.startTime === "") && (
                  <p className="text-red-700 mt-1">
                    Requires Billing Modules is required
                  </p>
                )}
            </div> */}
            {/* <div className="grid grid-cols-1 md:mr-2">
              <p className="text-white text-lg font-semibold mt-2">
                Upload Organization Logo
              </p>
              <input
                value={organization.email}
                onChange={(text) => {
                  setorganization({
                    ...organization,
                    email: text.target.value,
                  });
                }}
                type="file"
                className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
              />
              {submitted && organization.logo === "" && (
                <p className="text-red-700 mt-1">
                  Organization Logo is required
                </p>
              )}
            </div> */}
          </div>

          {/* <div className="grid grid-cols-1 ">
            <p className="text-white text-lg font-semibold mt-2">
              Task Extra Comment Template
            </p>
            <textarea
              rows={5}
              value={organization.comment}
              onChange={(text) => {
                setorganization({
                  ...organization,
                  comment: text.target.value,
                });
              }}
              className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
            ></textarea>
            {submitted && organization.comment === "" && (
              <p className="text-red-700 mt-1">
                Task Extra Comment Template is required
              </p>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CUorganization;
