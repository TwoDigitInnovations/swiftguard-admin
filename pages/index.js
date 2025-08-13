import FullCalendar from "@fullcalendar/react";
// The import order DOES MATTER here. If you change it, you'll get an error!
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { Api } from "../src/services/service";
import {
  checkForEmptyKeys,
  checkEmail,
} from "../src/services/InputsNullChecker";
import { userContext } from "./_app";

export default function Home(props) {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });
  const [user, setUser] = useContext(userContext);

  useEffect(() => {
    const user = localStorage.getItem("userDetail");
    if (!!user) {
      router.push("home");
    }
  }, [router]);

  const submit = () => {
    let { anyEmptyInputs } = checkForEmptyKeys(userDetail);
    if (anyEmptyInputs.length > 0) {
      setSubmitted(true);
      return;
    }
    props.loader(true);
    const data = {
      username: userDetail.email.toLowerCase(),
      password: userDetail.password,
    };
    Api("post", "login", data, router).then(
      (res) => {
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
          localStorage.setItem("token", res.data.token);

          setUser(res.data);
          if (res.data?.id === "6450e9bef4d2cc08c2ec0431") {
            router.push("festaevent");
          } else {
            router.push("home");
          }
          setUserDetail({
            email: "",
            password: "",
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

  return (
    <div className="flex min-h-screen bg-black justify-center items-center ">
      <div className="border-2 rounded-3xl border-red-700 md:p-10 p-5 sm:w-1.5 md:w-1/3  ">
        <p className="text-white text-center md:text-4xl text-2xl font-semibold mb-10">
          Welcome
        </p>
        <div className="flex bg-stone-800 py-2 mt-4 rounded-md  md:h-14 sm:h-10 w-64 md:min-w-full ">
          <div className="flex md:mx-4 mx-2.5 justify-center md:h-10 sm:h-8 items-center ">
            <div className="md:w-5 md:h-5 w-4 h-4 relative">
              <Image
                src="/Email.png"
                width="20"
                height="20"
                alt="icon"
                layout="responsive"
              ></Image>
            </div>
          </div>
          <input
            placeholder="User Name"
            className="bg-stone-800 outline-none pl-2 text-white text-xs md:text-base border-l-2 border-black md:h-10 h-5"
            value={userDetail.email}
            onChange={(text) => {
              setUserDetail({ ...userDetail, email: text.target.value });
            }}
          />
        </div>
        {submitted && userDetail.email === "" && (
          <p className="text-red-700 mt-1">Email is required</p>
        )}
        {/* {submitted &&
          !checkEmail(userDetail.email) &&
          userDetail.email !== "" && (
            <p className="text-red-700 mt-1">Email is invalid</p>
          )} */}
        <div className="flex bg-stone-800 py-2 mt-4 rounded-md  md:h-14 sm:h-10 min-w-full relative items-center w-64 md:min-w-full ">
          <div className="flex md:mx-4 mx-2.5  justify-center md:h-10 sm:h-8 items-center ">
            <div className="md:w-5 md:h-5 w-4 h-4 relative">
              <Image
                src="/lock.png"
                width="20"
                height="20"
                alt="icon"
                layout="responsive"
              ></Image>
            </div>
          </div>
          <input
            placeholder="Password"
            type={showPass ? "text" : "password"}
            className="bg-stone-800 outline-none pl-2 text-white text-xs md:text-base border-l-2 border-black md:h-10 h-5"
            value={userDetail.password}
            onChange={(text) => {
              setUserDetail({ ...userDetail, password: text.target.value });
            }}
          />
          <div
            className="absolute right-3 "
            onClick={() => setShowPass(!showPass)}
          >
            <div className="md:w-5 md:h-3.5 w-3.5 h-2.5 relative">
              <Image
                src={showPass ? "/eye.png" : "/eye-1.png"}
                width="20"
                height="15"
                alt="icon"
                layout="responsive"
              ></Image>
            </div>
          </div>
        </div>
        {submitted && userDetail.password === "" && (
          <p className="text-red-700 mt-1">Password is required</p>
        )}

        <div className=" mt-10 grid grid-cols-2 gap-8">
          <div className="items-start">
            <p className="text-white text-left md:text-4xl text-2xl font-semibold ">
              Sign in
            </p>
          </div>
          <div className="flex justify-end" onClick={submit}>
            <div className="md:w-10 md:h-10 w-8 h-8 relative">
              <Image
                src="/next.png"
                width="40"
                height="40"
                alt="icon"
                layout="responsive"
              ></Image>
            </div>
          </div>
        </div>
        <p className="text-white mt-5 text-center md:text-xl text-sm font-medium ">
          {"Don't have an Account ?"}{" "}
          <span
            className="text-red-700 cursor-pointer"
            onClick={() => router.push("signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
