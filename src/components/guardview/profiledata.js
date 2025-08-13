/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import LocationDropdown from "../LocationDropdown";
import { Api, ApiFormData } from "../../services/service";
import { checkForEmptyKeys } from "../../services/InputsNullChecker";
import moment from "moment";

const Profiledata = (props) => {
  const dList = [
    { name: "Driving Liecense", type: "DL" },
    { name: "Passport", type: "PASSPORT" },
    { name: "SIA Batch", type: "SI_BATCH" },
    // {name: 'Bank Account Detail', type: 'bank_account'},
  ];
  const [userInfo, setUserInfo] = useState({
    firstname: props?.guardHistory?.gaurdDetails?.fullName.split(" ")[0],
    lastname: props?.guardHistory?.gaurdDetails?.fullName.split(" ")[1],
    email: props?.guardHistory?.gaurdDetails?.email,
    phone: props?.guardHistory?.gaurdDetails?.phone || "",
    gender: props?.guardHistory?.gaurdDetails?.gender || "",
    address: props?.guardHistory?.gaurdDetails?.address,
  });
  const [submitted, setSubmitted] = useState(false);
  const [uploadDoc, setUploadDoc] = useState({});

  useEffect(() => {
    setUserInfo({
      firstname: props?.guardHistory?.gaurdDetails?.fullName.split(" ")[0],
      lastname: props?.guardHistory?.gaurdDetails?.fullName.split(" ")[1],
      email: props?.guardHistory?.gaurdDetails?.email,
      phone: props?.guardHistory?.gaurdDetails?.phone || "",
      gender: props?.guardHistory?.gaurdDetails?.gender || "",
      address: props?.guardHistory?.gaurdDetails?.address,
    });
  }, [props]);

  const submit = () => {
    let { anyEmptyInputs } = checkForEmptyKeys(userInfo);
    if (anyEmptyInputs.length > 0) {
      setSubmitted(true);
      return;
    }
    userInfo.fullName = userInfo?.firstname + " " + userInfo?.lastname;
    userInfo.fullName.trim();
    props.loader(true);
    userInfo.gaurd_id = props?.guardHistory?.gaurdDetails?._id;
    setSubmitted(false);
    Api("post", "profile/update", userInfo, props.router).then(
      (res) => {
        props.loader(false);

        if (res?.status) {
          props?.getGuardHistory();
          setSubmitted(false);
        } else {
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.data?.message });
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const docUplods = (file) => {
    if (uploadDoc?.type === "" || uploadDoc?.type === undefined) {
      props.toaster({
        type: "error",
        message: "Please select document type from list",
      });
      return;
    }

    if (file === undefined) {
      props.toaster({
        type: "error",
        message: "Please choose image",
      });
      return;
    }
    if (uploadDoc?.type === "SI_BATCH" && uploadDoc?.edate === undefined) {
      props.toaster({
        type: "error",
        message: "Please provide your SIA batch expiry date",
      });
      return;
    }
    props.loader(true);
    const data = new FormData();
    data.append("type", uploadDoc?.type);
    data.append("file", file[0]);
    data.append("gaurd_id", props?.guardHistory?.gaurdDetails?._id);
    if (uploadDoc?.type === "SI_BATCH") {
      data.append("expire", uploadDoc?.edate);
    }
    ApiFormData("post", "profile/file", data, props.router).then(
      (res) => {
        props.loader(false);

        if (res?.status) {
          props?.getGuardHistory();
          setSubmitted(false);
          file = null;
          setUploadDoc({
            type: "",
            doc: null,
          });
        } else {
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.data?.message });
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const getLocationVaue = (lat, add) => {
    setUserInfo({
      ...userInfo,
      latitude: lat.lat.toString(),
      longitude: lat.lng.toString(),
      address: add || "",
    });
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 grid-cols-1 items-start">
        <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start mr-2">
          <p className="text-white text-lg font-semibold">First Name</p>
          <input
            value={userInfo?.firstname}
            onChange={(text) => {
              setUserInfo({
                ...userInfo,
                firstname: text.target.value,
              });
            }}
            type="text"
            placeholder="First Name"
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 icncolor"
          />
          {submitted && userInfo.firstname === "" && (
            <p className="text-red-700 mt-1">First name is required</p>
          )}
        </div>

        <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start">
          <p className="text-white text-lg font-semibold">Last Name</p>
          <input
            value={userInfo?.lastname}
            onChange={(text) => {
              setUserInfo({
                ...userInfo,
                lastname: text.target.value,
              });
            }}
            type="text"
            placeholder="Last Name"
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 icncolor"
          />
          {submitted && userInfo?.lastname === "" && (
            <p className="text-red-700 mt-1">Last name is required</p>
          )}
        </div>

        <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start mr-2">
          <p className="text-white text-lg font-semibold">Email</p>
          <input
            value={userInfo?.email}
            onChange={(text) => {
              setUserInfo({ ...userInfo, email: text.target.value });
            }}
            type="text"
            placeholder="Email"
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 icncolor"
          />
          {submitted && userInfo?.email === "" && (
            <p className="text-red-700 mt-1">Email is required</p>
          )}
        </div>
        <div className="mt-2">
          <LocationDropdown
            value={userInfo?.address}
            getLocationVaue={getLocationVaue}
            setJobInfo={setUserInfo}
            title="Address"
          />
          {submitted &&
            (userInfo?.address === "" || userInfo?.address === undefined) && (
              <p className="text-red-700 mt-1">Address is required</p>
            )}
        </div>

        <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start mr-2">
          <p className="text-white text-lg font-semibold">Phone Number</p>
          <input
            value={userInfo?.phone}
            onChange={(text) => {
              setUserInfo({ ...userInfo, phone: text.target.value });
            }}
            type="text"
            placeholder="Phone Number"
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 icncolor"
          />
          {submitted && userInfo?.phone === "" && (
            <p className="text-red-700 mt-1">Phone number is required</p>
          )}
        </div>

        <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start ">
          <p className="text-white text-lg font-semibold">Gender</p>
          <select
            value={userInfo?.gender}
            onChange={(text) => {
              setUserInfo({ ...userInfo, gender: text.target.value });
            }}
            type="text"
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-2 icncolor"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {submitted && userInfo.gender === "" && (
            <p className="text-red-700 mt-1">Gender is required</p>
          )}
        </div>
        {/* <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start mr-2">
          <p className="text-white text-lg font-semibold">SIA Batch</p>
          <input
            readOnly
            value={userInfo?.sia}
            onChange={(text) => {
              setUserInfo({ ...userInfo, sia: text.target.value });
            }}
            type="text"
            placeholder="SIA Batch"
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 icncolor"
          />
        </div>
        <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start ">
          <p className="text-white text-lg font-semibold">Expiry Date</p>
          <input
            readOnly
            value={userInfo?.edate}
            onChange={(text) => {
              setUserInfo({ ...userInfo, edate: text.target.value });
            }}
            type="date"
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 icncolor"
          />
        </div> */}
      </div>
      <div className="flex justify-start items-center mt-5">
        <button
          className="bg-red-700 text-white p-2 rounded-sm w-40 "
          onClick={submit}
        >
          Update Details
        </button>
        <button
          className="bg-red-700 text-white p-2 rounded-sm w-40 ml-5"
          onClick={() => {
            setUserInfo({
              firstname:
                props?.guardHistory?.gaurdDetails?.fullName.split(" ")[0],
              lastname:
                props?.guardHistory?.gaurdDetails?.fullName.split(" ")[1],
              email: props?.guardHistory?.gaurdDetails?.email,
              phone: props?.guardHistory?.gaurdDetails?.phone || "",
              gender: props?.guardHistory?.gaurdDetails?.gender || "",
              address: props?.guardHistory?.gaurdDetails?.address,
            });
          }}
        >
          Reset
        </button>
      </div>
      <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start mr-2">
        <p className="text-white text-lg font-semibold">Upload Document</p>
        <select
          value={uploadDoc?.type}
          onChange={(text) => {
            setUploadDoc({
              ...uploadDoc,
              type: text.target.value,
            });
          }}
          className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 icncolor"
        >
          <option value=""> Select Type</option>
          {dList?.map((item) => (
            <option key={item?.type} value={item?.type}>
              {item?.name}
            </option>
          ))}
        </select>
        {uploadDoc?.type === "SI_BATCH" && (
          <input
            value={uploadDoc?.edate}
            onChange={(text) => {
              setUploadDoc({ ...uploadDoc, edate: text.target.value });
            }}
            type="date"
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 icncolor"
          />
        )}
        <input
          value={uploadDoc?.doc}
          onChange={(e) => {
            // setUploadDoc({
            //   ...uploadDoc,
            //   doc: e.target.files,
            // });
            docUplods(e.target.files);
            e.target.files = null;
          }}
          type="file"
          placeholder="Email"
          className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 icncolor"
        />
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 mt-3 items-start ">
        {props?.guardHistory?.gaurdDetails?.identity?.map((item) => (
          <div
            className="grid md:grid-cols- grid-cols-1 mt-3 items-start mr-2"
            key={item?._id}
          >
            {item?.type === "DL" && (
              <p className="text-white text-lg font-semibold">
                Driving Liecense
              </p>
            )}
            {item?.type === "PASSPORT" && (
              <p className="text-white text-lg font-semibold">Passport</p>
            )}
            {item?.type === "SI_BATCH" && (
              <div>
                <p className="text-white text-lg font-semibold">
                  SIA Batch -{" "}
                  <span className="text-red-700 text-md font-semibold">
                    Exp Date: {moment(item?.expire).format("DD-MM-YYYY")}
                  </span>
                </p>
              </div>
            )}
            <img className="w-64" src={item?.image} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profiledata;
