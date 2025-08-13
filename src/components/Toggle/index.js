/* eslint-disable react-hooks/exhaustive-deps */
import Switch from "@mui/material/Switch";
import { FaBell } from "react-icons/fa";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Api } from "../../services/service";
import { userContext } from "../../../pages/_app";

const Index = ({ props }) => {
  const router = useRouter();
  const [allnoti, setAllNoti] = useState(true);
  const [user, setUser] = useContext(userContext);

  useEffect(() => {
    getProfile();
    // console.log('notify-------->', props.user?.notify)
    // setAllNoti(props.user?.notify);
  }, []);

  const allNotication = (type) => {
    setAllNoti(type.target.checked);
    props.loader(true);
    const data = {
      notify: type.target.checked,
    };
    Api("post", "settings", data, router).then(
      async (res) => {
        props.loader(false);
        console.log(res);
        if (res?.status) {
          getProfile()
          props.toaster({ type: "success", message: res?.data.message });
        } else {
          props.toaster({ type: "success", message: res?.data.message });
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
    // props.loader(true);
    Api("get", "me", "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          // setUser({ ...user, ...res?.data })
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
    <div className=" flex justify-between items-center w-full ">
      {/* <p className="text-red-700"> Off</p> */}
      <FaBell className="text-red-700 md:hidden block" />
      <Switch sx={{ m: 1 }} color="error" size="20" checked={allnoti} onChange={allNotication} />
      <p className="text-sm text-white font-semibold  capitalize hidden md:block">
        {" "}
        Push Notification
      </p>
    </div>
    // <div className="min-h-screen bg-black md:-mt-16 overflow-x-auto">
    //   <div className="pt-20 ">
    //     <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-3 rounded-xl border-t-4 border-red-700 md:mx-5 m mx-3">
    //       <div>
    //         <p className="text-white font-bold md:text-3xl text-lg">Settings</p>
    //       </div>
    //     </div>
    //     <div className="md:p-10 p-3 rounded-xl border-2 border-red-700 md:mx-5 m mx-3">
    //       <div className=" grid grid-cols-2 rounded-xl md:px-5 p-3 border-2 border-red-900 relative items-center">
    //         <p className="text-red-900">Push Notification</p>
    //         <div className="flex justify-end ">
    //           <div className="w-28 flex justify-between items-center">
    //             <p className="text-red-700"> Off</p>
    //             <Switch checked={allnoti} onChange={allNotication} />
    //             <p className="text-red-700"> On</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Index;
