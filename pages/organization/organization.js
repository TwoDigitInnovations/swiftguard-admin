/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table, {
  AvatarCell,
  SelectColumnFilter,
  StatusPill,
  billStatus,
  indexID,
} from "../../src/components/table"; // new
import { useRouter } from "next/router";
import { IoCloseCircleOutline, IoEyeSharp } from "react-icons/io5";
import { Api } from "../../src/services/service";

const Organization = (props) => {
  const [orgList, setOrgList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getOrg();
  }, []);

  function billStatus({ value }) {
    return (
      <div className="flex justify-center items-center">
        <button
          className={` w-20 rounded-sm py-1 text-white text-sm ${
            value === "Active" ? "bg-green-700" : "bg-red-700"
          }`}
        >
          Active
        </button>
      </div>
    );
  }

  function ActiveStatus({ value }) {
    return (
      <div className="flex justify-center items-center">
        <button className="bg-green-700 w-20 rounded-sm py-1 text-white text-sm">
          Active
        </button>
        <div className="h-7 w-9 bg-white rounded-sm ml-2 flex justify-center items-center">
          <IoEyeSharp className="text-red-700 h-4 w-4 " />
        </div>
      </div>
    );
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        Cell: indexID,
      },
      {
        Header: "Organization",
        accessor: "organization",
      },
      {
        Header: "Organization Email",
        accessor: "email",
      },
      {
        Header: "Mobile",
        accessor: "mobile",
      },
      {
        Header: "Billing Status",
        accessor: "status",
        Cell: billStatus,
      },

      {
        Header: "Active Status",
        accessor: "aStatus",
        Cell: ActiveStatus,
      },
    ],
    []
  );

  const getOrg = () => {
    props.loader(true);
    Api("get", "organizations", "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          setOrgList(res.data.users);
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
            <p className="text-white font-bold md:text-3xl text-lg">
              Organization
            </p>
          </div>
          <div className="flex justify-end">
            {/* <button className="text-white bg-red-700 rounded-lg  mr-3 text-xs py-21 w-32 ">
              Manage
            </button> */}
            <button
              className="text-white border-2 border-white rounded-lg text-xs py-0.5 w-32"
              onClick={() => {
                router.push("/organization/CUorganization");
              }}
            >
              Create new
            </button>
          </div>
        </div>
        <div className="px-5">
          <Table columns={columns} data={orgList} />
        </div>
      </div>
    </div>
  );
};

export default Organization;
