/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Image from "next/image";
import LocationDropdown from "../src/components/LocationDropdown";
import Profiledata from "../src/components/guardview/profiledata";
import BankDetail from "../src/components/guardview/BankDetail";
import AssignMentHistory from "../src/components/guardview/AssignMentHistory";
import { useRouter } from "next/router";
import { Context, userContext } from "./_app";
import { Api } from "../src/services/service";
import moment from "moment";

const Guardview = (props) => {
  const { organization } = props;
  const router = useRouter();
  const [menu, setMenu] = useState([
    { title: "Profile Data", active: false },
    { title: "Bank Info", active: false },
    { title: "Assignment History", active: true },
  ]);
  const [guardHistory, setGuardHistoey] = useState({});
  const [printData, setPrintData] = useState([]);

  useEffect(() => {
    if (router?.query?.guardview) {
      getGuardHistory();
    }
  }, [organization]);

  const getGuardHistory = () => {
    // 6400aa4cf26028895f0b166e
    // organization?.selectedGuard?.id

    const start = encodeURIComponent(
      moment(router?.query?.start, "YYYY-MM-DD").format()
    );
    const end = encodeURIComponent(
      moment(router?.query?.end, "YYYY-MM-DD").format()
    );
    console.log(start, end);
    props.loader(true);
    Api(
      "get",
      `admin/gaurdJobHistory/${router?.query?.guardview}?startDate=${start}&endDate=${end}`,
      "",
      router
    ).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          let totalhr = res?.data?.jobs.reduce((t, item) => t + item.job_hrs, 0)
          let totalwage = res?.data?.jobs.reduce((t, item) => t + item.wages, 0)

          res.data.footer = { totalhr, totalwage }
          setGuardHistoey(res.data);
          // setMainList(res.data.guards);
          let d = [];



          res?.data?.jobs.forEach((ele, i) => {

            d.push({
              ["#"]: i + 1,
              Name: ele?.client?.fullName,
              // Date: moment(ele?.startDate).format("YYYY-MM-DD"),
              "Start Date": moment(ele?.startDate).format(
                "YYYY-MM-DD, hh:mm A"
              ),
              "End Date": moment(ele?.endDate).format("YYYY-MM-DD, hh:mm A"),
              // Rate: ele?.client?.rate?.toFixed(2),
              Hours: ele.job_hrs?.toFixed(2),
              "Pay Rate": ele.pay?.toFixed(2),
              Commission: ele?.commission.toFixed(2),
              Wage: ele?.wages.toFixed(2),
              // Status: "ACCEPTED",
              // "Assignment Post": ele?.address,
            });
          });
          d.push({
            ["#"]: 'Total',
            Name: '',
            // Date: moment(ele?.startDate).format("YYYY-MM-DD"),
            "Start Date": '',
            "End Date": '',
            // Rate: ele?.client?.rate?.toFixed(2),
            Hours: totalhr?.toFixed(2),
            "Pay Rate": '',
            Commission: '',
            Wage: totalwage?.toFixed(2),
            // Status: "ACCEPTED",
            // "Assignment Post": ele?.address,
          });
          setPrintData(d);
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

  const verifyDoc = () => {
    const data = {
      email: guardHistory?.gaurdDetails?.email,
      verified: false,
    };
    props.loader(true);
    Api("post", "user/verifyGuard", data, router).then(
      async (res) => {
        props.loader(false);

        if (res?.status) {
          props.toaster({ type: "success", message: res?.data.message });
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
    <div className="min-h-screen bg-black md:-mt-16">
      <div className="md:p-5 p-3 pt-20 ">
        <div className="grid md:grid-cols-2 grid-cols-1">
          <div className="flex">
            <div className="md:h-40 md:w-40 h-20 w-20 relative ml-0 md:ml-10  ">
              <Image
                src={"/images.png"}
                alt="icon"
                layout="fill" // required
                objectFit="cover"
                className="rounded-full"
              ></Image>
            </div>
            <div className="p-5">
              <p className="text-white">
                {guardHistory?.gaurdDetails?.fullName}
              </p>
              <p className="text-gray-500 text-sm">Field Staff</p>
            </div>
          </div>
          <div className="flex justify-end items-center">
            <button
              className="bg-red-700 text-white p-2 rounded-sm w-40 "
              onClick={() => {
                verifyDoc();
              }}
            >
              Suspend Staff
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-3 rounded-sm  border-t-4 border-red-700 ">
          {/* <div>
            <p className="text-white font-semibold text-sm ">
              <span className="text-gray-400">Recent post:</span> LSC -
              Reception
            </p>
            <p className="text-white font-semibold text-sm ">
              <span className="text-gray-400">Recent client:</span> London
              School of Commerce (LSC)
            </p>
            <p className="text-white font-semibold text-sm ">
              <span className="text-gray-400">SIA Batch No:</span> ade000001
            </p>
          </div> */}
        </div>
        <div className="  rounded-sm md:p-5">
          <div className="grid md:grid-cols-4 grid-cols-1 ">
            <div className="md:border-r-2 md:border-stone-800 flex md:flex-col flex-row md:justify-start justify-between">
              {menu?.map((item, i) => (
                <li
                  key={i}
                  className="py-2  flex  md:px-5 px-1  align-middle "
                  onClick={() => {
                    item.active = true;
                    menu.forEach((ele) => {
                      ele.active = item?.title === ele.title;
                    });
                    setMenu([...menu]);
                  }}
                >
                  <a
                    className={`flex md:ml-2 font-bold hover:text-white cursor-pointer md:text-md text-sm ${item?.active ? "text-white" : "text-red-900"
                      }`}
                  >
                    {item?.title}
                  </a>
                  <div className="text-right flex-1 md:block hidden ">
                    <Image
                      src={item?.active ? "/fwd-white.png" : "/fwd-red.png"}
                      width="8"
                      height="15"
                      alt="icon"
                      layout="fixed"
                    ></Image>
                  </div>
                </li>
              ))}
            </div>

            <div className="md:col-span-3 md:pl-10">
              {menu[0].active && (
                <div>
                  <Profiledata
                    guardHistory={guardHistory}
                    {...props}
                    router={router}
                    getGuardHistory={getGuardHistory}
                  />
                </div>
              )}
              {menu[1].active && (
                <div>
                  <BankDetail
                    guardHistory={guardHistory}
                    {...props}
                    router={router}
                    getGuardHistory={getGuardHistory}
                  />
                </div>
              )}
              {menu[2].active && (
                <div>
                  <AssignMentHistory
                    guardHistory={guardHistory}
                    data={printData}
                    {...props}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guardview;
