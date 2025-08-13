import React, { useState } from "react";
import { Api } from "../../services/service";
import { checkForEmptyKeys } from "../../services/InputsNullChecker";

const BankDetail = (props) => {
  const [userInfo, setUserInfo] = useState({
    ...props?.guardHistory?.gaurdDetails?.bankDetails,
  });
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    let { anyEmptyInputs } = checkForEmptyKeys(userInfo);
    if (anyEmptyInputs.length > 0) {
      setSubmitted(true);
      return;
    }
    props.loader(true);
    const data = {
      bankDetails: userInfo,
      gaurd_id: props?.guardHistory?.gaurdDetails?._id,
    };
    setSubmitted(false);
    Api("post", "profile/update", data, props.router).then(
      (res) => {
        props.loader(false);

        if (res?.status) {
          props?.getGuardHistory();
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
    <div>
      <div className="grid md:grid-cols-2 grid-cols-1 items-start">
        <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start mr-2">
          <p className="text-white text-lg font-semibold">Bank Name</p>
          <input
            value={userInfo?.name}
            onChange={(text) => {
              setUserInfo({
                ...userInfo,
                name: text.target.value,
              });
            }}
            type="text"
            placeholder="Bank Name"
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 icncolor"
          />
          {submitted && userInfo.name === "" && (
            <p className="text-red-700 mt-1">Bank name is required</p>
          )}
        </div>

        <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start">
          <p className="text-white text-lg font-semibold">Account Number</p>
          <input
            value={userInfo?.account}
            onChange={(text) => {
              setUserInfo({
                ...userInfo,
                account: text.target.value,
              });
            }}
            type="text"
            placeholder="Account Number"
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 icncolor"
          />
          {submitted && userInfo.account === "" && (
            <p className="text-red-700 mt-1">Account Number is required</p>
          )}
        </div>

        <div className="grid md:grid-cols-1 grid-cols-1 mt-3 items-start mr-2">
          <p className="text-white text-lg font-semibold">Sort Code</p>
          <input
            value={userInfo?.code}
            onChange={(text) => {
              setUserInfo({ ...userInfo, code: text.target.value });
            }}
            type="text"
            placeholder="Sort Code"
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5 icncolor"
          />
          {submitted && userInfo.code === "" && (
            <p className="text-red-700 mt-1">Sort Code is required</p>
          )}
        </div>
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
              ...props?.guardHistory?.gaurdDetails?.bankDetails,
            });
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default BankDetail;
