/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import { CalendarTable } from "../../src/components/calendarTable";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Api } from "../../src/services/service";
import Table, { indexID } from "../../src/components/table";
import Register from "./register";
import Dialog from "@mui/material/Dialog";
import { IoList, IoChevronBack, IoCloseCircleOutline } from "react-icons/io5";
import { MultiSelect } from "react-multi-select-component";
import ClientTable from "../../src/components/clients/clienttable";
import { IoSearch, IoCalendar } from "react-icons/io5";
import CountUp from "react-countup";

const ClientsList = (props) => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [jobID, setJobID] = useState("");
  const [repeat, setRepeat] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [opt, setOpt] = useState([]);
  const [selected, setSelected] = useState([]);
  // const [asignId, setAssignId] = useState([]);
  const [clientlist, setClientList] = React.useState([]);
  const [mainList, setMainList] = React.useState([]);
  const [clienID, setClientID] = useState("");
  const [clientData, setClientData] = useState({})

  useEffect(() => {
    getClientList();
  }, []);

  const getClientList = () => {
    props.loader(true);
    let url = "provider/client";
    if (props?.organization?._id) {
      url = `provider/client?org_id=${props?.organization?._id}`;
    }
    Api("get", url, "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          let options = [];
          let suspended = [];
          let verified = [];
          res.data.clients.forEach((ele, index) => {
            if (ele.status === 'Verified') {
              verified.push(ele)
            }
            if (ele.status === 'Suspended') {
              suspended.push(ele)
            }
            options.push({
              label: ele.fullName,
              value: ele._id,
              disabled: false,
            });
            if (res.data.clients.length === index + 1) {
              setOpt(options);
              setClientData({
                verified,
                suspended
              })
            }
            ele.indexID = index + 1;
          });
          setClientList(res.data.clients);
          setMainList(res.data.clients);
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

  const searchList = async (text) => {
    if (text.length > 0) {
      const data = await mainList.filter((f) =>
        f.fullName.toLowerCase().includes(text.toLowerCase())
      );
      data.forEach((ele, index) => {
        ele.indexID = index + 1;
      });
      setClientList(data);
    } else {
      setClientList(mainList);
    }
  };

  const deleteClient = (id) => {
    props.loader(true);
    Api("delete", `provider/client/${id}`, "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          props.toaster({
            type: "success",
            message: "Client deleted successfully",
          });
          getClientList();
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

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  
  return (
    <div className="min-h-screen  md:pt-3 overflow-x-auto bg-black ">
      < div className="px-5 md:mt-0 mt-5">
        <div className="grid md:grid-cols-3 grid-col-1 gap-3">
          <div className="border-2  border-customGray  border-t-red-700 border-t-4 relative flex justify-center    cursor-pointer" onClick={() => setClientList(mainList)} >
            <div className="bg-customGray w-full flex justify-between items-center h-16 rounded-md px-5">
              <p className="font-bold text-lg text-center text-white  px-3">Total Number of Client</p>
              <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                <CountUp end={mainList?.length || 0} />
              </p>
            </div>
          </div>
          <div className="border-2  border-customGray  border-t-red-700 border-t-4    relative flex justify-center cursor-pointer" onClick={() => setClientList(clientData?.verified)}>
            <div className="bg-customGray w-full flex justify-between items-center h-16 rounded-md px-5">
              <p className="font-bold text-lg text-center text-white  px-3">Verified Client</p>
              <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                <CountUp end={clientData?.verified?.length || 0} />
              </p>
            </div>
          </div>

          <div className="border-2  border-customGray  border-t-red-700 border-t-4   relative flex justify-center cursor-pointer" onClick={() => setClientList(clientData?.suspended)}>
            <div className="bg-customGray w-full flex justify-between items-center h-16 rounded-md px-5">
              <p className="font-bold text-lg text-center text-white  px-3">Suspended Client</p>
              <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                <CountUp end={clientData?.suspended?.length || 0} />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="md:px-5 px-3">
        {showForm && (
          <Register
            {...props}
            // router={router}
            setShowForm={setShowForm}
            getClientList={getClientList}
            setClientID={setClientID}
            clienID={clienID}
            router={router}
          />
        )}
        {!showForm && (
          <button
            // disabled={props?.organization?._id === undefined ? true : false}
            className="bg-red-700 text-white p-2 md:ml-0 ml-2 rounded-sm mt-3"
            onClick={() => {
              if (
                props?.organization?._id === undefined &&
                props?.user?.type === "ADMIN"
              ) {
                props.toaster({
                  type: "warning",
                  message: "Please select any organization",
                });
                return;
              }
              if (!showForm) {
                setClientID("");
              }
              setRepeat("Create New Task");
              setShowForm(!showForm);
            }}
          >
            {/* {showForm ? "Close" : "Create New Task"} */}
            Register New Client
          </button>
        )}
      </div>
      <div className="px-5 overflow-visible mt-3">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-stone-900 p-3  border-t-4 border-red-700 ">
          <div>
            <p className="text-white font-bold md:text-3xl text-lg">
              Clients List
            </p>
          </div>
          <div className="flex items-center justify-end md:mt-0 mt-2 ">

            <input
              className="  rounded-md border-2 border-red-900 outline-none ml-2 text-white bg-black w-72 p-1.5 "
              onChange={(text) => {
                searchList(text.target.value);
              }}
            />
            <div className="h-10 w-10 bg-red-700 rounded-md ml-3 flex justify-center items-center">
              <IoSearch className="text-white text-xl" />
            </div>
          </div>
        </div>

        <ClientTable
          data={clientlist}
          setClientID={setClientID}
          setShowForm={setShowForm}
          deleteClient={deleteClient}
          goToTop={goToTop}
          {...props}
          getClientList={getClientList}
        />
      </div>

      {openDialog ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-md shadow-lg relative flex flex-col w-full bg-black outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5   rounded-t">
                  <h3 className="text-2xl font-semibold text-white">
                    Assign Job
                  </h3>
                </div>
                {/*body*/}
                <div className="px-5 pt-5 pb-5 border-2  border-red-900 bg-black relative  md:h-auto w-80">
                  <MultiSelect
                    options={opt}
                    value={selected}
                    onChange={(text) => {
                      setSelected(text);
                    }}
                    labelledBy="Select Staff"
                    ClearSelectedIcon
                  />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-3  bg-black rounded-b">
                  <button
                    className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setOpenDialog(false);
                      assignJob();
                    }}
                  >
                    Assign
                  </button>
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setOpenDialog(false);
                      setSelected([]);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};

export default ClientsList;
