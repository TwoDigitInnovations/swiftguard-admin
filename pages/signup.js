import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {
  checkForEmptyKeys,
  checkEmail,
} from "../src/services/InputsNullChecker";
import { Api } from "../src/services/service";

const SignUp = (props) => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userDetail, setUserDetail] = useState({
    userName: "",
    email: "",
    password: "",
    isOrganization: "false",
    phone: "",
    // organization:''
  });

  const [organization, setOrganization] = useState("");

  const submit = () => {
    let { anyEmptyInputs } = checkForEmptyKeys(userDetail);
    if (anyEmptyInputs.length > 0) {
      setSubmitted(true);
      return;
    }

    if (userDetail.phone.length !== 10) {
      props.toaster({ type: "error", message: "Your Phone number is invalid" });
      return;
    }

    if (userDetail.isOrganization === "true" && organization === "") {
      setSubmitted(true);
      return;
    }

    if (userDetail) props.loader(true);
    const data = {
      username: userDetail.userName.toLowerCase(),
      email: userDetail.email.toLowerCase(),
      password: userDetail.password,
      isOrganization: userDetail.isOrganization,
      phone: userDetail.phone,
    };

    if (userDetail.isOrganization === "true" && organization !== "") {
      data.organization = organization;
    } else {
      data.fullName = organization;
    }

    Api("post", "signUp", data, router).then(
      (res) => {
        props.loader(false);
        if (res.status) {
          router.push("/");
          setUserDetail({
            email: "",
            password: "",
            userName: "",
            phone: "",
          });
        } else {
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.data?.message });
      }
    );
  };

  return (
    <div className="flex min-h-screen bg-black justify-center items-center ">
      <div className="border-2 rounded-3xl border-red-700 md:p-7 p-5 sm:w-1.5 md:w-1/3  ">
        <p className="text-white text-center md:text-3xl text-2xl font-semibold mb-7">
          Welcome
        </p>

        {/* <div className="flex bg-stone-800 py-2 my-4 rounded-md  md:h-14 sm:h-10 min-w-full relative items-center w-64 md:min-w-full ">
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
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            value={"true"}
            className="flex bg-stone-800 outline-none pl-2 text-white text-xs md:text-base border-l-2 border-black md:h-10 h-5"
          >
            <div className="text-red-700">
              <FormControlLabel
                className="text-red-700"
                value={"true"}
                control={<Radio />}
                label="Job Provider"
              />
            </div>
          </RadioGroup>
        </div> */}

        <div className="flex bg-stone-800 py-2 my-4 rounded-md  md:h-14 sm:h-10 min-w-full relative items-center w-64 md:min-w-full ">
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
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            value={userDetail.isOrganization}
            onChange={(text) => {
              setUserDetail({
                ...userDetail,
                isOrganization: text.target.value,
              });
            }}
            className="flex bg-stone-800 outline-none pl-2 text-white text-xs md:text-base border-l-2 border-black md:h-10 h-5"
          >
            <div className="text-red-700">
              <FormControlLabel
                className="text-red-700"
                value={"true"}
                control={<Radio />}
                label="Organization"
              />
              <FormControlLabel
                className="text-red-700"
                value={"false"}
                control={<Radio />}
                label="Individual"
              />
            </div>
          </RadioGroup>
        </div>

        {/* {userDetail.isOrganization === "true" && ( */}
        <div>
          <div className="flex bg-stone-800 py-2 my-4 rounded-md  md:h-14 sm:h-10 w-64 md:min-w-full ">
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
              placeholder={
                userDetail.isOrganization === "true"
                  ? "Organization Name"
                  : "Full Name"
              }
              className="bg-stone-800 outline-none pl-2 text-white text-xs md:text-base border-l-2 border-black md:h-10 h-5"
              value={organization}
              onChange={(text) => {
                setOrganization(text.target.value);
              }}
            />
          </div>
          {submitted && organization === "" && (
            <p className="text-red-700 mt-1">
              {userDetail.isOrganization === "true"
                ? "Organization Name"
                : "Full Name"}{" "}
              is required
            </p>
          )}
        </div>
        {/* )} */}

        <div className="flex bg-stone-800 py-2 my-4 rounded-md  md:h-14 sm:h-10 w-64 md:min-w-full ">
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
            value={userDetail.userName}
            onChange={(text) => {
              setUserDetail({ ...userDetail, userName: text.target.value });
            }}
          />
        </div>
        {submitted && userDetail.userName === "" && (
          <p className="text-red-700 mt-1">User name is required</p>
        )}
        <div className="flex bg-stone-800 py-2 my-4 rounded-md  md:h-14 sm:h-10 w-64 md:min-w-full ">
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
            placeholder={
              userDetail.isOrganization === "true"
                ? "Organization Email"
                : "Email"
            }
            className="bg-stone-800 outline-none pl-2 text-white text-xs md:text-base border-l-2 border-black md:h-10 h-5"
            value={userDetail.email}
            onChange={(text) => {
              setUserDetail({ ...userDetail, email: text.target.value });
            }}
          />
        </div>

        <div className="flex bg-stone-800 py-2 my-4 rounded-md  md:h-14 sm:h-10 min-w-full relative items-center w-64 md:min-w-full ">
          <div className="flex md:mx-4 mx-2.5  justify-center md:h-10 sm:h-8 items-center ">
            <div className="md:w-5 md:h-5 w-4 h-4 relative">
              <Image
                src="/phoneNumber.png"
                width="20"
                height="20"
                alt="icon"
                layout="responsive"
              ></Image>
            </div>
          </div>
          <input
            type="number"
            placeholder="Phone"
            className="bg-stone-800 outline-none pl-2 text-white text-xs md:text-base border-l-2 border-black md:h-10 h-5 w-[81%]"
            value={userDetail.phone}
            onChange={(text) => {
              setUserDetail({ ...userDetail, phone: text.target.value });
            }}
          />
        </div>
        {submitted && userDetail.phone === "" && (
          <p className="text-red-700 mt-1">Phone number is required</p>
        )}

        <div className="flex bg-stone-800 py-2 my-4 rounded-md  md:h-14 sm:h-10 min-w-full relative items-center w-64 md:min-w-full ">
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



        {/* {userDetail.isOrganization === "true" && (
          <div>
            <div className="flex bg-stone-800 py-2 my-4 rounded-md  md:h-14 sm:h-10 w-64 md:min-w-full ">
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
                placeholder="Organization Name"
                className="bg-stone-800 outline-none pl-2 text-white text-xs md:text-base border-l-2 border-black md:h-10 h-5"
                value={organization}
                onChange={(text) => {
                  setOrganization(text.target.value);
                }}
              />
            </div>
            {submitted && organization === "" && (
              <p className="text-red-700 mt-1">Organization name is required</p>
            )}
          </div>
        )} */}

        <div className=" mt-7 grid grid-cols-2 gap-8">
          <div className="items-start">
            <p className="text-white text-left md:text-3xl text-2xl font-semibold ">
              Sign Up
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
          {"Already have an Account?"}{" "}
          <span
            className="text-red-700 cursor-pointer"
            onClick={() => router.push("/")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
