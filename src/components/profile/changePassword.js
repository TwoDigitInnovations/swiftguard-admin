import { useState } from "react";
import { Api } from "../../../src/services/service";
import { checkForEmptyKeys } from "../../services/InputsNullChecker";

const ChangePassword = (props) => {
  const [password, setpassword] = useState({
    new: "",
    confirm: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    setSubmitted(true);
    let { anyEmptyInputs } = checkForEmptyKeys(password);
    if (anyEmptyInputs.length > 0) {
      // Toaster(errorString);
    } else {
      if (password.new !== password.confirm) {
        props.toaster({
          type: "error",
          message: "Your password does not match with Confirm password",
        });
        return;
      }

      const data = {
        password: password.new,
      };

      props.loader(true);
      Api("post", "profile/changePassword", data, props.router).then(
        async (res) => {
          props.loader(false);
          if (res?.status) {
            props.toaster({ type: "success", message: res.data.message });
            setpassword({
              new: "",
              confirm: "",
            });
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
    }
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 grid-cols-1">
        <div className="grid grid-cols-1 md:mr-2">
          <p className="text-white text-lg font-semibold">New Password</p>
          <input
            value={password.new}
            type="password"
            onChange={(text) => {
              setpassword({ ...password, new: text.target.value });
            }}
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
          />
          {submitted && password.new === "" && (
            <p className="text-red-700 mt-1">New Password is required</p>
          )}
        </div>
        <div className="grid grid-cols-1">
          <p className="text-white text-lg font-semibold">Confirm Password</p>
          <input
            type="password"
            value={password.confirm}
            onChange={(text) => {
              setpassword({ ...password, confirm: text.target.value });
            }}
            className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black  p-1.5 "
          />
          {submitted && password.confirm === "" && (
            <p className="text-red-700 mt-1">Confirm Password is required</p>
          )}
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

export default ChangePassword;
