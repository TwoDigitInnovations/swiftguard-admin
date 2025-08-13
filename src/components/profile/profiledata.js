/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import LocationDropdown from "../LocationDropdown";
import Image from "next/image";
import { Api } from "../../../src/services/service";
import {
  checkForEmptyKeys,
  checkEmail,
} from "../../services/InputsNullChecker";

const ProfileData = (props) => {
  const [profileData, setProfileData] = useState({
    location: "",
  });
  const [size, setSize] = useState(0);
  const [anyEmptyInput, setanyEmptyInputs] = useState([]);

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setProfileData({
      ...profileData,
      email: props?.data?.email || "",
      fullname: props?.data?.organization || "",
      image: props?.data?.profile || "",
      location: props?.data?.address || "",
      phone: props?.data?.isOrganization ? props?.data?.orgPhone : props?.data?.phone
    });
  }, []);

  const getLocationVaue = (lat, add) => {
    setProfileData({
      ...profileData,
      latitude: lat.lat.toString(),
      longitude: lat.lng.toString(),
      location: add,
    });
  };

  function handleChange(event) {
    setSize(event.target.files[0].size);
    if (event.target.files[0].size / 1024 / 1024 > 2) {
      props.toaster({
        type: "error",
        message: "Please uploaded image size should be less than 2MB ",
      });
    } else {
      var reader = new FileReader();
      var file = event.target.files[0];

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        setProfileData({
          ...profileData,
          image: reader.result,
        });
      };
    }
  }

  const submit = () => {
    let { anyEmptyInputs } = checkForEmptyKeys(profileData);
    setanyEmptyInputs(anyEmptyInputs);
    if (anyEmptyInputs.length > 0) {
      // Toaster(errorString);
    } else {
      const emailcheck = checkEmail(profileData.email);
      if (!emailcheck) {
        props.toaster({ type: "error", message: "Your email id is invalid" });
        return;
      }
      if (profileData.phone.length !== 10) {
        props.toaster({ type: "error", message: "Your Phone number is invalid" });
        return;
      }

      let data = {
        email: profileData.email.toLowerCase(),
        address: profileData.location,
        profile: profileData.image,
        location: [profileData.longitude, profileData.latitude],
      };

      if (props.data.isOrganization) {
        data.organization = profileData.fullname;
        data.orgPhone = profileData.phone
      } else {
        data.fullName = profileData.fullname;
        data.phone = profileData.phone
      }

      props.loader(true);
      Api("post", "profile/update", data, props.router).then(
        async (res) => {
          props.loader(false);
          if (res?.status) {
            props.toaster({ type: "success", message: res.data.message });
            props.getProfile();
          } else {
            props.toaster({ type: "success", message: res?.message });
          }
        },
        (err) => {
          props.loader(false);
          console.log(err);
          props.toaster({ type: "error", message: err?.message });
        }
      );
    }
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 grid-cols-1">
        <div className="grid grid-cols-1 md:mr-2">
          <p className="text-white text-lg font-semibold">
            {props?.data?.isOrganization ? "Organization" : "Full Name"}
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
          <p className="text-white text-lg font-semibold">Email</p>
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
        {/* <div className="grid grid-cols-1 md:mr-2">
          <p className="text-white text-lg font-semibold">Phone Number</p>
          <input
            value={profileData.phone}
            onChange={(text) => {
              setProfileData({ ...profileData, phone: text.target.value });
            }}
            type="number"
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
          />
       
        </div> */}
        <div className="grid grid-cols-1 md:mr-2">
          <LocationDropdown
            value={profileData.location}
            getLocationVaue={getLocationVaue}
            setJobInfo={setProfileData}
            title="Address"
          />
          {anyEmptyInput.includes("LOCATION") && (
            <p className="text-red-900">Address is required</p>
          )}
        </div>

        <div className="grid grid-cols-1">
          <p className="text-white text-lg font-semibold">Phone</p>
          <input
            type="number"
            value={profileData.phone}
            onChange={(text) => {
              setProfileData({ ...profileData, phone: text.target.value });
            }}
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
          />
          {/* {submitted && profileData.endTime === "" && (
          <p className="text-red-700 mt-1">End Time is required</p>
        )} */}
        </div>

        <div className="grid grid-cols-1 mt-2 relative">
          <p className="text-white text-lg font-semibold">Profile Picture</p>
          <div className="rounded-md border-2 border-red-900 md:w-60 md:h-56 flex flex-col items-center justify-center">
            <div className="w-40 h-40  relative p-2">
              <Image
                src={profileData?.image || "/images.png"}
                width="20"
                height="20"
                alt="icon"
                layout="responsive"
              ></Image>
              {anyEmptyInput.includes("IMAGE") && (
                <p className="text-red-900">Profile Picture is required</p>
              )}
            </div>
            <div className="absulate bottom-0 border-t-2 border-red-900 w-full flex justify-start items-center p-3">
              <input
                type="file"
                className="text-white"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>


      </div>
      <div className="grid-cols-1 flex justify-end mt-2">
        <button
          className="bg-green-700 py-1 w-20 rounded-md text-white font-bold"
          onClick={submit}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default ProfileData;
