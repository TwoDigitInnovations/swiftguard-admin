import { useState } from "react";
import LocationDropdown from "../LocationDropdown";
import Image from "next/image";

const MyOrganization = () => {
  const [profileData, setProfileData] = useState({
    location: "",
  });

  const getLocationVaue = (lat, add) => {
    setProfileData({
      ...profileData,
      latitude: lat.lat.toString(),
      longitude: lat.lng.toString(),
      location: add,
      image: "",
    });
  };

  function handleChange(event) {
    var reader = new FileReader();
    var file = event.target.files[0];
    reader.onload = function (upload) {
      setProfileData({
        ...profileData,
        image: upload.target.result,
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="grid md:grid-cols-2 grid-cols-1">
        <div className="grid grid-cols-1 md:mr-2">
          <p className="text-white text-lg font-semibold mt-2">
            Organization Name
          </p>
          <input
            value={profileData.fullname}
            onChange={(text) => {
              setProfileData({ ...profileData, fullname: text.target.value });
            }}
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
          />
          {/* {submitted && profileData.startTime === "" && (
          <p className="text-red-700 mt-1">Start Time is required</p>
        )} */}
        </div>
        <div className="grid grid-cols-1">
          <p className="text-white text-lg font-semibold mt-2">
            Organization Shaort Code
          </p>
          <input
            value={profileData.email}
            onChange={(text) => {
              setProfileData({ ...profileData, email: text.target.value });
            }}
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
          />
          {/* {submitted && profileData.endTime === "" && (
          <p className="text-red-700 mt-1">End Time is required</p>
        )} */}
        </div>
        <div className="grid grid-cols-1 md:mr-2">
          <p className="text-white text-lg font-semibold mt-2">Email</p>
          <input
            value={profileData.phone}
            onChange={(text) => {
              setProfileData({ ...profileData, phone: text.target.value });
            }}
            type="number"
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
          />
          {/* {submitted && profileData.startTime === "" && (
          <p className="text-red-700 mt-1">Start Time is required</p>
        )} */}
        </div>
        <div className="grid grid-cols-1 mt-2">
          <LocationDropdown
            value={profileData.location}
            getLocationVaue={getLocationVaue}
            setJobInfo={setProfileData}
            title="Address"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1">
        {/* <div className="grid grid-cols-1 md:mr-2">
          <p className="text-white text-lg font-semibold mt-2">Phone Number</p>
          <input
            value={profileData.fullname}
            onChange={(text) => {
              setProfileData({ ...profileData, fullname: text.target.value });
            }}
            type="number"
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
          />
     
        </div> */}
        <div className="grid grid-cols-1 md:mr-2">
          <p className="text-white text-lg font-semibold mt-2">
            Upload Organization Logo
          </p>
          <input
            value={profileData.email}
            onChange={(text) => {
              setProfileData({ ...profileData, email: text.target.value });
            }}
            type="file"
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
          />
          {/* {submitted && profileData.endTime === "" && (
          <p className="text-red-700 mt-1">End Time is required</p>
        )} */}
        </div>
        <div className="grid grid-cols-1 ">
          <p className="text-white text-lg font-semibold mt-2">Account Name</p>
          <input
            value={profileData.email}
            onChange={(text) => {
              setProfileData({ ...profileData, email: text.target.value });
            }}
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
          />
          {/* {submitted && profileData.endTime === "" && (
          <p className="text-red-700 mt-1">End Time is required</p>
        )} */}
        </div>
      </div>

      <div className="grid md:grid-cols-4 grid-cols-1">
        <div className="grid grid-cols-1 md:mr-2">
          <p className="text-white text-lg font-semibold mt-2">
            Account Number
          </p>
          <input
            value={profileData.fullname}
            onChange={(text) => {
              setProfileData({ ...profileData, fullname: text.target.value });
            }}
            type="number"
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
          />
          {/* {submitted && profileData.startTime === "" && (
          <p className="text-red-700 mt-1">Start Time is required</p>
        )} */}
        </div>
        <div className="grid grid-cols-1 md:mr-2">
          <p className="text-white text-lg font-semibold mt-2">Bank Name</p>
          <input
            value={profileData.email}
            onChange={(text) => {
              setProfileData({ ...profileData, email: text.target.value });
            }}
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
          />
          {/* {submitted && profileData.endTime === "" && (
          <p className="text-red-700 mt-1">End Time is required</p>
        )} */}
        </div>
        <div className="grid grid-cols-1 md:mr-2">
          <p className="text-white text-lg font-semibold mt-2">Vet Reg No</p>
          <input
            value={profileData.email}
            onChange={(text) => {
              setProfileData({ ...profileData, email: text.target.value });
            }}
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
          />
          {/* {submitted && profileData.endTime === "" && (
          <p className="text-red-700 mt-1">End Time is required</p>
        )} */}
        </div>
        <div className="grid grid-cols-1 ">
          <p className="text-white text-lg font-semibold mt-2">Sort Code</p>
          <input
            value={profileData.email}
            onChange={(text) => {
              setProfileData({ ...profileData, email: text.target.value });
            }}
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
          />
          {/* {submitted && profileData.endTime === "" && (
          <p className="text-red-700 mt-1">End Time is required</p>
        )} */}
        </div>
      </div>

      <div className="grid grid-cols-1 ">
        <p className="text-white text-lg font-semibold mt-2">
          Task Extara Comment Template
        </p>
        <textarea
          rows={5}
          value={profileData.email}
          onChange={(text) => {
            setProfileData({ ...profileData, email: text.target.value });
          }}
          className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
        ></textarea>
        {/* {submitted && profileData.endTime === "" && (
          <p className="text-red-700 mt-1">End Time is required</p>
        )} */}
      </div>

      <div className="grid grid-cols-1 ">
        <p className="text-white text-lg font-semibold mt-2">
          Additional Note Below invoice
        </p>
        <textarea
          rows={3}
          value={profileData.email}
          onChange={(text) => {
            setProfileData({ ...profileData, email: text.target.value });
          }}
          className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
        ></textarea>
        {/* {submitted && profileData.endTime === "" && (
          <p className="text-red-700 mt-1">End Time is required</p>
        )} */}
      </div>

      <div className="grid-cols-1 flex justify-end mt-2">
        <button className="bg-green-700 py-1 w-28 rounded-md text-white font-bold">
          Update Now
        </button>
      </div>
    </div>
  );
};

export default MyOrganization;
