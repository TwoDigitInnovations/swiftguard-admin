/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo, useContext } from "react";
import Table, { indexID } from "../src/components/table"; // new
import { useRouter } from "next/router";
import "../styles/Home.module.css";
import Dialog from "@mui/material/Dialog";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import { IoCloseCircleOutline, IoEyeSharp } from "react-icons/io5";
import { Api } from "../src/services/service";
import { IoSearch, IoCalendar } from "react-icons/io5";
import moment from "moment";
import { ViewBoardsIcon } from "@heroicons/react/solid";
import { userContext } from "./_app";
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Navigation } from 'swiper/modules';
import { EffectFade } from 'swiper/modules';
import CountUp from "react-countup";

const GuardList = (props) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [showPayrollPopup, setShowPayrollPopup] = React.useState(false);
  const [singleData, setSingalData] = React.useState({});
  const [guardList, setGuardList] = React.useState([{}]);
  const [mainList, setMainList] = React.useState([{}]);
  const [statusData, setStatusData] = React.useState({});
  const [selectedData, setSelectedData] = useState([])
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false);
  const [user, setUser] = useContext(userContext);
  const [currentIndex, setCuurentIndex] = useState(0)
  const swiper = useSwiper()

  console.log(swiper)

  useEffect(() => {
    getGuardList();
  }, []);

  const getGuardList = () => {
    props.loader(true);
    Api("post", "user/guardList", "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {

          const sia = res.data.guards.filter(f => f?.identity?.find(i => i.type === 'SI_BATCH'))
          const siaExp = res.data.guards.filter(f => f?.identity?.find(i => i.type === 'SI_BATCH' && new Date(i.expire) < new Date()))
          const suspended = res.data.guards.filter(f => f.verified === 'false')
          res.data.guards.forEach(el => {
            if (el?.identity?.length > 0) {
              const f = el?.identity?.find(i => i.type === 'SI_BATCH')
              if (f) {
                el.expire = new Date(f.expire).getTime()
              }
            }
          })
          setGuardList(res.data.guards);
          setMainList(res.data.guards);
          console.log(res.data.guard)
          setStatusData({
            sia: sia.length,
            siaExp,
            guards: res.data.guards.length,
            suspended
          })
          const data = []
          res.data.guards.map(f => { if (f.commission) { data.push(f._id) } })
          console.log(data)
          setSelectedData(data)
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

  const updateGuardComission = (id, type, index) => {
    props.loader(true);
    Api("get", `user/guard/${id}/${type}`, "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          console.log(res)
          props.toaster({ type: "success", message: res?.data?.message });
          if (selectedData.includes(id)) {
            const d = selectedData.filter(f => f !== id);
            setSelectedData(d)
          } else {
            selectedData.push(id)
            setSelectedData([...selectedData])
          }
          // getGuardList()
          // guardList[index].commission = type,
          //   setGuardList([...guardList])
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
      setGuardList(data);
    } else {
      setGuardList(mainList);
    }
    // if (search.length > 2 || search.length == 0) {
    // props.loader(true);
    // Api("post", "user/guardListSearch", { search }, router).then(
    //   async (res) => {
    //     props.loader(false);
    //     if (res?.status) {
    //       setGuardList(res.data.guards);
    //     } else {
    //       props.toaster({ type: "success", message: res?.message });
    //     }
    //   },
    //   (err) => {
    //     props.loader(false);
    //     props.toaster({ type: "error", message: err.message });
    //     console.log(err);
    //   }
    // );
    // }
  };

  const verifyDoc = (email, type) => {
    const data = {
      email,
      verified: type,
    };
    props.loader(true);
    Api("post", "user/verifyGuard", data, router).then(
      async (res) => {
        props.loader(false);

        if (res?.status) {
          props.toaster({ type: "success", message: res?.data.message });
          handleClose();
          getGuardList();
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

  const verifypayroll = (type, msg) => {
    if (password === '') {
      props.toaster({ type: "warning", message: 'Password is required' });
      return
    }
    const newSelected = singleData.payroll.selected === 'weekly'
      ? 'monthly'
      : singleData.payroll.selected === 'monthly'
        ? 'weekly'
        : 'monthly';

    const data = {
      email: user.email,
      password,
      userid: singleData._id,
      payroll: {
        type: type === 'verify' ? newSelected : singleData.payroll.type,
        selected: newSelected,
        verified: true,
      },
      type,
      msg
    };

    props.loader(true);
    Api("post", "payrollverify", data, router).then(
      async (res) => {
        props.loader(false);

        if (res?.status) {
          props.toaster({ type: "success", message: res?.data.message });
          setShowPayrollPopup(false);
          getGuardList();
          setPassword('')
        } else {
          props.toaster({ type: "success", message: res?.message });
        }
      },
      (err) => {
        console.log(err);
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });

      }
    );
  };

  function verifyPassport({ value, row }) {
    return (
      <div className="flex justify-start items-center ">
        {row?.original?.identity?.map((item) => (
          <div key={item._id}>
            {item?.type === "PASSPORT" && (
              <input type="checkbox" checked readOnly />
            )}
          </div>
        ))}
      </div>
    );
  }

  function verifyLicence({ value, row }) {
    return (
      <div className="flex justify-start items-center ">
        {row?.original?.identity?.map((item) => (
          <div key={item._id}>
            {item?.type === "DL" && <input type="checkbox" checked readOnly />}
          </div>
        ))}
      </div>
    );
  }

  function comition({ value, row }) {
    console.log(row)
    return (
      <div className="flex justify-start items-center ">
        <input type="checkbox" checked={selectedData.includes(row.original._id)} onChange={(e) => {
          console.log(e)
          // row.original.commisson = e.target.value

          updateGuardComission(row?.original._id, e.target.checked, row.index)
        }} />
        {/* {row?.original?.identity?.map((item) => (
          <div key={item._id}>
            {item?.type === "DL" && <input type="checkbox" checked readOnly />}
          </div>
        ))} */}
      </div>
    );
  }

  function siaBatch({ value, row }) {
    return (
      <div className="flex justify-start items-center ">
        {row?.original?.identity?.map((item) => (
          <div key={item._id}>
            {item?.type === "SI_BATCH" && (
              <p className="text-white">
                {moment(item.expire).format("DD MMM, YYYY")}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  const verifyCol = ({ row }) => {
    return (
      <div className="flex justify-start items-center ">
        {/* {row?.original?.identity?.map((item) => ( */}
        <div>
          {row?.original?.verified === "Pending" ? (
            <p className="text-white">Pending</p>
          ) : row?.original?.verified === "true" ? (
            <p className="text-green-700">Verified</p>
          ) : (
            <p className="text-red-700">Suspended</p>
          )}
        </div>
        {/* ))} */}
      </div>
    );
  };

  function ActiveStatus({ row }) {
    return (
      <div
        className="flex justify-start items-center"
        onClick={() => {
          console.log('selected guard----------->', row.original.identity)
          if (row.original.identity) {
            setSingalData(row.original);
          } else {
            setSingalData({ ...row.original, identity: [] });
          }

          handleClickOpen();
        }}
      >
        <div className="h-7 w-9 bg-white rounded-sm ml-2 flex justify-center items-center">
          <IoEyeSharp className="text-red-700 h-4 w-4 " />
        </div>
      </div>
    );
  }

  const payroll = ({ value, row }) => {
    console.log()
    return (
      <div className="flex justify-start items-center ">

        {row?.original?.payroll && <div onClick={() => {
          if (!row?.original?.payroll?.verified) {
            setSingalData(row.original);
            setShowPayrollPopup(true);
          }
        }}>
          {row?.original?.payroll?.verified ? (
            <p className="text-white cursor-pointer">{value}</p>
          ) : (
            <p className="text-red-700 cursor-pointer">{value}</p>
          )}
        </div>}
        {/* {!row?.original?.payroll && <div >
          <p className="text-white cursor-pointer">Weekly</p>
        </div>} */}

      </div>
    );
  };

  const elipsis = ({ value }) => {
    return (
      <p className="text-white truncate w-32">{value}</p>
    )
  }
  const columns = useMemo(
    () => [
      {
        Header: "Guard ID",
        Cell: indexID,
      },
      {
        Header: "Guard Name",
        accessor: "fullName",
        Cell: elipsis,
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: elipsis,
      },
      {
        Header: "Phone Number",
        accessor: "phone",
        // Cell: viewDetail,
      },
      {
        Header: "SIA Badge",
        accessor: 'expire',
        Cell: siaBatch,
      },
      // {
      //   Header: "Passport",
      //   Cell: verifyPassport,
      // },
      // {
      //   Header: "Driving Licence",
      //   Cell: verifyLicence,
      // },


      {
        Header: "Commission",
        Cell: comition,
      },
      {
        Header: "Status",
        accessor: 'verified',
        Cell: verifyCol,
      },
      {
        Header: "PayRoll",
        accessor: "payroll.type",
        Cell: payroll,
      },
      {
        Header: "Action",
        Cell: ActiveStatus,
      },
    ],
    [selectedData]
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const imageFullPath = (key) => {
    return `https://service-app-docs.s3.us-east-1.amazonaws.com/${key}`
  }

  return (
    <div className="min-h-screen bg-black  overflow-x-auto">
      < div className="px-5 pt-7">
        <div className="grid md:grid-cols-3 grid-col-1 gap-3">
          <div className="border-2  border-customGray  border-t-red-700 border-t-4 relative flex justify-center    cursor-pointer" onClick={() => setGuardList(statusData?.siaExp)}>
            <div className="bg-customGray w-full flex justify-between items-center h-24 rounded-md px-5">
              <p className="font-bold text-lg text-center text-white  px-3">SIA Badge Sataus / Expired</p>
              <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                <CountUp end={statusData?.sia || 0} /> / <CountUp end={statusData?.siaExp?.length || 0} />
              </p>
            </div>
          </div>
          <div className="border-2  border-customGray  border-t-red-700 border-t-4    relative flex justify-center   cursor-pointer" onClick={() => setGuardList(mainList)} >
            <div className="bg-customGray w-full flex justify-between items-center h-24 rounded-md px-5">
              <p className="font-bold text-lg text-center text-white  px-3">Total number of guards</p>
              <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                <CountUp end={statusData?.guards || 0} />
              </p>
            </div>
          </div>

          <div className="border-2  border-customGray  border-t-red-700 border-t-4   relative flex justify-center    cursor-pointer" onClick={() => setGuardList(statusData?.suspended)}>
            <div className="bg-customGray w-full flex justify-between items-center h-24 rounded-md px-5">
              <p className="font-bold text-lg text-center text-white  px-3">Suspended</p>
              <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                <CountUp end={statusData?.suspended?.length || 0} />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-3  border-t-4 border-red-700 md:mx-5 m mx-3">
          <div>
            <p className="text-white font-bold md:text-3xl text-lg">
              Guard List
            </p>
          </div>
          <div className="flex items-center justify-end ">

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
        <div className="px-5">
          <Table columns={columns} data={guardList} />
        </div>
        <Dialog open={open} onClose={handleClose} maxWidth='md'>
          <div className="p-5 border-t-4  border-t-red-900 bg-customGray relative overflow-hidden">
            <IoCloseCircleOutline
              className="text-red-700 h-8 w-8 absolute right-2 top-2"
              onClick={handleClose}
            />
            <div className="md:flex justify-between border-b-2 border-b-gray-300 py-2">
              <div>

                <div className="flex justify-start items-start">
                  <Avatar
                    alt={singleData.username}
                    src={singleData.profile}
                    sx={{ width: 60, height: 60 }}
                  />
                  <div className="ml-3">
                    <p className="text-red-700 md:text-xl font-bold text-xs md:mt-0 mt-2">
                      Guard Details
                    </p>
                    <p className="text-white md:text-lg text-xs">
                      {singleData?.fullName}
                    </p>
                    <p className="text-white md:text-lg text-xs">
                      Username: {singleData?.username}
                    </p>
                    <p className="text-white md:text-lg text-xs">
                      Email: {singleData.email}
                    </p>
                    {/* {<div className="md:hidden flex justify-start items-center min-w-[400px] md:border-l-2 md:border-l-gray-300 ">
                      <div className="">
                        <p className="text-red-700 md:text-xl font-bold text-xs md:mt-0 mt-2">
                          Bank Details
                        </p>
                        <p className="text-white md:text-lg text-xs">
                          Name: {singleData?.bankDetails?.name || 'NA'}
                        </p>
                        <p className="text-white md:text-base text-xs">
                          Account No: {singleData?.bankDetails?.account || 'NA'}
                        </p>
                        <p className="text-white md:text-base text-xs">
                          Bank Name: {singleData?.bankDetails?.bank_name || "NA"}
                        </p>
                        <p className="text-white md:text-base text-xs">
                          Sort Code: {singleData?.bankDetails?.code || "NA"}
                        </p>
                      </div>
                    </div>} */}
                  </div>
                </div>

              </div>

              {<div className="flex  justify-start items-center min-w-[400px] md:border-l-2 md:border-l-gray-300 ">
                <div className="md:ml-3">
                  <p className="text-red-700 md:text-xl font-bold text-xs md:mt-0 mt-2">
                    Bank Details
                  </p>
                  <p className="text-white md:text-lg text-xs">
                    Name: {singleData?.bankDetails?.name || 'NA'}
                  </p>
                  <p className="text-white md:text-base text-xs">
                    Account No: {singleData?.bankDetails?.account || 'NA'}
                  </p>
                  <p className="text-white md:text-base text-xs">
                    Bank Name: {singleData?.bankDetails?.bank_name || 'NA'}
                  </p>
                  <p className="text-white md:text-base text-xs">
                    Sort Code: {singleData?.bankDetails?.code || 'NA'}
                  </p>
                </div>
              </div>}
            </div>
            <p className="text-red-700 md:text-xl font-bold text-xs pt-2">
              Identity
            </p>
            {!singleData.identity || singleData?.identity?.length === 0 && <div className="md:w-[880px] md:h-80 w-68  h-60  flex justify-center items-center ">
              <p className="text-white md:text-lg text-xs">
                Identity not found.
              </p>
            </div>}
            {singleData?.identity && singleData?.identity?.length > 0 && <Swiper navigation={true} modules={[Navigation]} className="mySwiper mt-5 md:w-[880px] w-68" onRealIndexChange={(newindex) => setCuurentIndex(newindex.activeIndex)} onSlideChange={() => console.log('slide change')}

              onSwiper={(swiper) => console.log(swiper)}>
              {singleData?.identity?.map((item) => (<SwiperSlide key={item.title}>
                <div className="w-full flex justify-center">
                  <div className="md:w-80 md:h-64 w-60 h-48 relative rounded-lg ">
                    <img
                      src={item?.key && imageFullPath(item?.key) || "/idproofs.jpg"}
                      alt="icon"
                      layout="responsive"
                      className="rounded-sm md:w-80 md:h-64 w-60 h-48 "
                    />
                    {/* </Image> */}
                  </div>
                </div>
              </SwiperSlide>
              ))}

            </Swiper>}
            {singleData?.identity && singleData?.identity?.length > 0 && <div className="flex flex-col  justify-center mt-5">
              <div className="grid md:grid-cols-3 grid-cols-1">
                {singleData?.identity?.map((item, i) => (
                  <div key={item._id} className="w-full justify-center">
                    {item?.type === "SI_BATCH" && (
                      <div >
                        <div className="flex  mt-3 md:justify-center">
                          <input
                            type="checkbox"
                            checked={item?.type === "SI_BATCH"}
                            readOnly
                            title="Passport"
                          />
                          <p className={`font-bold ml-3 md:text-base text-xs ${currentIndex === i ? 'text-white' : 'text-red-700'}`}>SIA Batch </p>
                        </div>
                        {/* <p className="mt-3 text-red-700 font-bold">
                          Ex. Date :-{" "}
                          <span className="text-white">
                            {moment(item.expire).format("DD MMM, YYYY")}
                          </span>
                        </p> */}
                      </div>
                    )}
                    {item?.type === "PASSPORT" && (
                      <div className="flex  mt-3 md:justify-center">
                        <input
                          type="checkbox"
                          checked={item?.type === "PASSPORT"}
                          readOnly
                          title="Passport"
                        />
                        <p className={`font-bold ml-3 md:text-base text-xs ${currentIndex === i ? 'text-white' : 'text-red-700'}`}>Passport</p>
                      </div>
                    )}

                    {item?.type === "DL" && (
                      <div className="flex  mt-3 md:justify-center">
                        <input
                          type="checkbox"
                          checked={item?.type === "DL"}
                          readOnly
                          title="Passport"
                        />
                        <p className={`font-bold ml-3 md:text-base text-xs ${currentIndex === i ? 'text-white' : 'text-red-700'}`}>
                          Driving Licence
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>}
            <div className="h-12">
              <div className="flex  mt-5  justify-center  ">
                <button
                  className="bg-green-700 text-white rounded-md w-28 p-2 mr-2"
                  onClick={() => {
                    verifyDoc(singleData.email, true);
                  }}
                >
                  Verify
                </button>
                <button
                  className="bg-red-700 text-white rounded-md w-28 p-2"
                  onClick={() => {
                    verifyDoc(singleData.email, false);
                  }}
                >
                  Suspend
                </button>
              </div>
            </div>

          </div>
        </Dialog>

        <Dialog open={showPayrollPopup} onClose={() => setShowPayrollPopup(false)}>
          <div className="p-5 border-2  border-red-900 bg-black relative overflow-hidden">
            <IoCloseCircleOutline
              className="text-red-700 h-8 w-8 absolute right-2 top-2"
              onClick={() => setShowPayrollPopup(false)}
            />
            <div className="flex justify-start items-center">
              <Avatar
                alt={singleData.username}
                src={singleData.profile}
                sx={{ width: 60, height: 60 }}
              />
              <div className="ml-3">
                <p className="text-white md:text-lg text-xs">
                  {singleData?.username}
                </p>
                <p className="text-white md:text-lg text-xs">
                  {singleData.email}
                </p>
              </div>
            </div>
            <div className="py-5">
              <p className="text-white">Current Payroll Type : {singleData?.payroll?.type}</p>
              <p className="text-white">Updated Payroll Type : {singleData?.payroll?.selected}</p>
            </div>

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
                value={password}
                onChange={(text) => { setPassword(text.target.value) }}
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

            <div className="flex  mt-5  justify-center ">
              <button
                className="bg-green-700 text-white rounded-md w-28 p-2 mr-2"
                onClick={() => {
                  verifypayroll('verify', 'Verified successfully');
                }}
              >
                Verify
              </button>
              <button
                className="bg-red-700 text-white rounded-md w-28 p-2"
                onClick={() => {
                  verifypayroll('suspend', 'Suspended successfully');
                }}
              >
                Suspend
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default GuardList;
