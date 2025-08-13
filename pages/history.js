/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import HistoryTable from "../src/components/history/historyTable";
import { IoSearch, IoCalendar } from "react-icons/io5";
import { Api } from "../src/services/service";
import moment from "moment";

const History = (props) => {
  const router = useRouter();
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = () => {
    props.loader(true);
    Api("get", "user/history/1_YEAR", "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          res.data.jobs.forEach((element) => {
            element.time = `${moment(element.startDate).format(
              "hh:mm a"
            )} to ${moment(element.endDate).format("hh:mm a")}`;
            element.date = `${moment(element.startDate).format(
              "DD/MM/yyyy"
            )} to ${moment(element.endDate).format("DD/MM/yyyy")}`;
            element.amount = element.amount.tofixed(2);
          });
          setHistoryList(res.data.jobs);
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

  const searchList = (search) => {
    if (search.length > 2 || search.length == 0) {
      props.loader(true);
      Api("post", "jobs/historyUserSearch", { search }, router).then(
        async (res) => {
          props.loader(false);
          if (res?.status) {
            res.data.guards.forEach((element) => {
              element.time = `${moment(element.startTime, "HH:mm").format(
                "hh:mm a"
              )} to ${moment(element.endTime, "HH:mm").format("hh:mm a")}`;
              element.date = `${moment(element.startDate).format(
                "DD/MM/yyyy"
              )} to ${moment(element.endDate).format("DD/MM/yyyy")}`;
            });

            setHistoryList(res.data.guards);
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
    <div className="min-h-screen bg-black md:-mt-16 overflow-x-auto">
      <div className="pt-20 ">
        <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-4 rounded-xl border-t-8 border-red-700 md:mx-5 m mx-3">
          <div>
            <p className="text-white font-bold md:text-3xl text-lg">History</p>
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
          <HistoryTable data={historyList} />
        </div>
      </div>
    </div>
  );
};

export default History;
