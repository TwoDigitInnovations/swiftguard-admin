/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { DownArrow } from "../src/components/icons";
import ProfileData from "../src/components/profile/profiledata";
import ChangePassword from "../src/components/profile/changePassword";
import MyOrganization from "../src/components/profile/myOrganization";
import { Api } from "../src/services/service";
import { useRouter } from "next/router";
import { Context, userContext } from "../pages/_app";

const EditProfie = (props) => {
  const router = useRouter();
  const [showProfileData, setShowProfileData] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showMyOrganization, setShowMyOrganization] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [user, setUser] = useContext(userContext);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = () => {
    props.loader(true);
    Api("get", "me", "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          if (res.data.type === "USER") {
            res.data.usertype = res?.data?.isOrganization
              ? "ORG"
              : res.data.type;
          } else {
            res.data.usertype = res.data.type;
          }
          localStorage.setItem("userDetail", JSON.stringify(res.data));
          setUserDetail(res.data);
          setUser(res.data);
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
        <div className="grid grid-cols-2 items-center bg-stone-900 md:px-5 p-3 rounded-xl border-t-4 border-red-700 md:mx-5  mx-3 relative">
          <div>
            <p className="text-white font-bold md:text-3xl text-lg">
              Profile Data
            </p>
          </div>
          <div
            className="absolute right-5 cursor-pointer"
            onClick={() => {
              setShowProfileData(!showProfileData);
            }}
          >
            <DownArrow className="text-red-700 " />
          </div>
        </div>
        {showProfileData && (
          <div className="md:mx-5  mx-3 rounded-md border-2 border-red-700 p-5">
            <ProfileData
              data={userDetail}
              {...props}
              router={router}
              getProfile={getProfile}
            />
          </div>
        )}
      </div>
      <div className="pt-5 ">
        <div className="grid grid-cols-2 items-center bg-stone-900 md:px-5 p-3 rounded-xl border-t-4 border-red-700 md:mx-5 m mx-3 relative">
          <div>
            <p className="text-white font-bold md:text-3xl text-lg">
              Change Password
            </p>
          </div>
          <div
            className="absolute right-5 cursor-pointer"
            onClick={() => {
              setShowChangePassword(!showChangePassword);
            }}
          >
            <DownArrow className="text-red-700 " />
          </div>
        </div>
        {showChangePassword && (
          <div className="md:mx-5  mx-3 rounded-md border-2 border-red-700 p-5">
            <ChangePassword {...props} router={router} />
          </div>
        )}
      </div>
      {/* <div className="pt-5 ">
        <div className="grid grid-cols-2 items-center bg-stone-900 md:px-5 p-3 rounded-xl border-t-4 border-red-700 md:mx-5 m mx-3 relative">
          <div>
            <p className="text-white font-bold md:text-3xl text-lg">
              My Organization
            </p>
          </div>
          <div
            className="absolute right-5 cursor-pointer"
            onClick={() => {
              setShowMyOrganization(!showMyOrganization);
            }}
          >
            <DownArrow className="text-red-700 " />
          </div>
        </div>
        {showMyOrganization && (
          <div className="md:mx-5  mx-3 rounded-md border-2 border-red-700 p-5">
            <MyOrganization />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default EditProfie;
