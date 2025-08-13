/* eslint-disable react-hooks/exhaustive-deps */
import Switch from "@mui/material/Switch";
import { Api } from "../src/services/service";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Setting = (props) => {
  const [allnoti, setAllNoti] = useState(true);

  useEffect(() => {
    getProfile();
  }, []);

  const router = useRouter();
  const allNotication = (type) => {
    setAllNoti(type.target.checked);
    props.loader(true);
    const data = {
      notify: type.target.checked,
    };
    Api("post", "settings", data, router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
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

  const getProfile = () => {
    props.loader(true);
    Api("get", "me", "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          setAllNoti(res?.data?.notify);
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

  return (
    <div className="min-h-screen bg-black md:-mt-16 overflow-x-auto">
      <div className="pt-20 ">
        <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-3 rounded-xl border-t-4 border-red-700 md:mx-5 m mx-3">
          <div>
            <p className="text-white font-bold md:text-3xl text-lg">Settings</p>
          </div>
        </div>
        <div className="md:p-10 p-3 rounded-xl border-2 border-red-700 md:mx-5 m mx-3">
          <div className=" grid grid-cols-2 rounded-xl md:px-5 p-3 border-2 border-red-900 relative items-center">
            <p className="text-red-900">Push Notification</p>
            <div className="flex justify-end ">
              <div className="w-28 flex justify-between items-center">
                <p className="text-red-700"> Off</p>
                <Switch checked={allnoti} onChange={allNotication} />
                <p className="text-red-700"> On</p>
              </div>
            </div>
          </div>

          {/* <div className=" grid grid-cols-2 rounded-xl md:px-5 p-3 border-2 border-red-900 relative items-center mt-5">
            <p className="text-red-900">SMS Notification to Staff</p>
            <div className="flex justify-end ">
              <Switch />
            </div>
          </div>

          <div className=" grid grid-cols-2 rounded-xl md:px-5 p-3 border-2 border-red-900 relative items-center mt-5">
            <p className="text-red-900">Email Notification to Staff</p>
            <div className="flex justify-end ">
              <Switch />
            </div>
          </div>

          <div className=" grid grid-cols-2 rounded-xl md:px-5 p-3 border-2 border-red-900 relative items-center mt-5">
            <p className="text-red-900">Email Notification to Admin</p>
            <div className="flex justify-end ">
              <Switch />
            </div>
          </div>

          <div className=" grid grid-cols-2 rounded-xl md:px-5 p-3 border-2 border-red-900 relative items-center mt-5">
            <p className="text-red-900">
              App Notification to all current workers
            </p>
            <div className="flex justify-end ">
              <Switch />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Setting;
