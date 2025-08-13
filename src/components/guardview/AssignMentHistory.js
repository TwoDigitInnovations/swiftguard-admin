/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect } from "react";
import Table, { indexID } from "../../../src/components/table"; // new
import { IoSearch, IoCalendar } from "react-icons/io5";
import moment from "moment";
import { useExcelDownloder, } from "react-xls";
import * as htmlToImage from "html-to-image";
import { Api, pdfDownload } from "../../services/service";
import { useRouter } from "next/router";

const AssignMentHistory = (props) => {
  const [userInfo, setUserInfo] = useState([]);
  const [mainData, setMainData] = useState([]);
  // const [pdfData, setMainData] = useState([]);
  const { ExcelDownloder, Type, setData } = useExcelDownloder();
  const router = useRouter();
  console.log(router.query)

  useEffect(() => {
    let guardHistory = [];
    console.log(props?.guardHistory)
    props?.guardHistory?.jobs?.forEach((element) => {
      // const commission = ''
      // const wage = ''
      // if (props?.guardHistory?.gaurdDetails?.commission) {
      //   const w = (element?.wages / 100) * 3
      //   console.log(w)
      //   if (w >= 1) {
      //     wage = (element?.wages + 0.99).toFixed(2)
      //     commission = 0.99
      //   } else {
      //     wage = (element?.wages + w).toFixed(2)
      //     commission = w
      //   }
      // } else {
      //   wage = element?.wages.toFixed(2)
      // };
      guardHistory.push({
        name: element?.client?.fullName,
        rate: element?.client?.rate?.toFixed(2),
        hrs: element?.job_hrs?.toFixed(2),
        pay: element.pay?.toFixed(2),
        wage: element?.wages.toFixed(2),
        status: "ACCEPTED",
        commission: element?.commission.toFixed(2),
        date: moment(element?.startDate).format("YYYY-MM-DD"),
        assignPost: element?.address,
        startDate: moment(element?.startDate).format("YYYY-MM-DD, hh:mm A"),
        endDate: moment(element?.endDate).format("YYYY-MM-DD, hh:mm A"),
        totalhr: props.guardHistory.footer.totalhr.toFixed(2),
        totalwage: props.guardHistory.footer.totalwage.toFixed(2)
      });
    });
    setMainData(guardHistory);
    setUserInfo(guardHistory);
    setData({ userdata: props?.data });
  }, [props]);

  let data = {
    userdata: props?.data,
  };

  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: indexID,
        Footer: 'Total'
      },
      {
        Header: "Name",
        accessor: "name",
      },
      // {
      //   Header: "Date",
      //   accessor: "date",
      // },
      {
        Header: "Start Date",
        accessor: "startDate",
      },
      {
        Header: "End Date",
        accessor: "endDate",
      },
      // {
      //   Header: "Rate",
      //   accessor: "rate",
      // },
      {
        Header: "Hours",
        accessor: "hrs",
        Footer: TotalHours
      },
      {
        Header: "Pay Rate",
        accessor: "pay",
      },
      {
        Header: "Commission",
        accessor: "commission",
      },
      {
        Header: "Wage",
        accessor: "wage",
        Footer: TotalWages
      },
      // {
      //   Header: "Status",
      //   accessor: "status",
      // },
      // {
      //   Header: "Assignment Post",
      //   accessor: "assignPost",
      // },
    ],
    [props]
  );

  function TotalWages() {
    return (
      <p>{props?.guardHistory?.footer?.totalwage?.toFixed(2)}</p>
    );
  }

  function TotalHours() {
    return (
      <p>{props?.guardHistory?.footer?.totalhr?.toFixed(2)}</p>
    );
  }

  const searchList = (value) => {
    if (value?.length > 0) {
      let filterData = mainData?.filter((f) =>
        f?.name?.toLowerCase()?.includes(value?.toLowerCase())
      );
      setUserInfo(filterData);
    } else {
      setUserInfo(mainData);
    }
  };
  const saveAndSave = async () => {
    props.loader(true);
    pdfDownload('abcd', props?.data).then((res) => {
      console.log(res)
      const data = {
        title: `${router.query.start} to ${router.query.end}`,
        email: props?.guardHistory.gaurdDetails.email,
        // email: 'surya@yopmail.com',
        name: props?.guardHistory.gaurdDetails.fullName,
        attachment: res,
      };
      Api("post", "sendPdfforuserjob", data, router).then(
        (res) => {
          props.loader(false);
          if (res.status) {
            props.toaster({ type: "success", message: "Sent Successfully" });
          } else {
            props.toaster({ type: "error", message: res.message });
          }
        },
        (err) => {
          props.loader(false);
        }
      );
    })


    // props.loader(true);
    // var node = document.getElementById("mynode");

    // htmlToImage
    //   .toPng(node)
    //   .then(function (dataUrl) {
    //     const data = {
    //       title: `${router.query.start} to ${router.query.end}`,
    //       email: props?.guardHistory.gaurdDetails.email,
    //       name: props?.guardHistory.gaurdDetails.fullName,
    //       attachment: dataUrl,
    //     };
    //     console.log(data)
    //     Api("post", "sendPdfforuserjob", data, router).then(
    //       (res) => {
    //         props.loader(false);
    //         if (res.status) {
    //           props.toaster({ type: "success", message: "Sent Successfully" });
    //         } else {
    //           props.toaster({ type: "error", message: res.message });
    //         }
    //       },
    //       (err) => {
    //         props.loader(false);
    //       }
    //     );
    //   })
    //   .catch(function (error) {
    //     props.loader(false);
    //     console.error("oops, something went wrong!", error);
    //   });
  };

  return (
    <div>
      <div className="grid w-full items-center md:grid-cols-2 grid-cols-1 bg-stone-900 md:px-5 p-3 rounded-xl border-t-4 border-red-700 md:mx-0  ">
        <div className="flex">
          <ExcelDownloder
            // data={data}
            filename={"book"}
            type={Type.Button} // or type={'button'}
          >
            <button className="bg-red-700 text-white py-1 px-3 rounded-md ml-2">
              Excel
            </button>
          </ExcelDownloder>
          {/* <p className="text-white font-bold md:text-3xl text-lg">Guard List</p> */}
          <div>
            <button className="bg-red-700 text-white py-1 px-3 rounded-md ml-2"
              onClick={() => {
                saveAndSave()
              }}
            >
              Save and Send
            </button>
          </div>
          <div>
            <button className="bg-red-700 text-white py-1 px-3 rounded-md ml-2"
              onClick={() => {
                router.back()
              }}
            >
              Back
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end md:mt-0 mt-3 ">

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
      <div id="mynode" style={{ width: '100%' }}>
        <Table columns={columns} data={userInfo} from='guardhistory' />
      </div>

    </div>
  );
};

export default AssignMentHistory;
