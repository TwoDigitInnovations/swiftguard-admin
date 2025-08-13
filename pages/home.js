/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { Api } from "../src/services/service";
import { useRouter } from "next/router";
import moment from "moment";
import CountUp from "react-countup";
import BillingTable from "../src/components/billing/billingTable";
import { useExcelDownloder } from "react-xls";
import Table, { indexID } from "../src/components/table";
import Tooltip from "@mui/material/Tooltip";

const Index = (props) => {
  const { user, organization } = props;
  // console.log(user)
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [guardList, setGuardList] = useState([]);
  const [userIncome, setUserIncome] = useState({});
  const [billList, setBillList] = useState([]);
  const [billId, setBillId] = useState();
  const [pendingAmount, setPendingAmmount] = useState(0);
  const { ExcelDownloder, Type, setData } = useExcelDownloder();

  useEffect(() => {
    getusername();
  }, [props]);

  useEffect(() => {
    getGuardList();
    userHistory();
    getBillList();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Guard ID",
        Cell: indexID,
      },
      ,
      {
        Header: "Guard Name",
        accessor: "fullName",
      },

      {
        Header: "Email",
        accessor: "email",
      },
    ],
    []
  );

  const getusername = () => {
    if (user.type !== "ADMIN") {
      setUserName(user.username);
    } else if (user.type === "ADMIN") {
      if (!!organization) {
        setUserName(organization.username);
      }
    }
    if (user.type === "ADMIN" && organization.username === undefined) {
      setUserName("ADMIN");
    }
  };

  const getGuardList = () => {
    props.loader(true);
    Api("post", "user/guardList", "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          setGuardList(res.data.guards);
        } else {
          props.toaster({ type: "success", message: res?.message });
        }
      },
      (err) => {
        console.log(err);
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
        console.log(err);
      }
    );
  };

  const userHistory = () => {
    props.loader(true);
    const d = moment(new Date()).format('DD/MM/YYYY');
    const dd = moment(d, 'DD/MM/YYYY').format();
    console.log(dd)
    Api("get", `admin/dashboard/stats?date=${encodeURIComponent(dd)}&org_id:${organization._id}`, "", router).then(
      async (res) => {
        props.loader(false);
        if (res?.status) {
          setUserIncome(res.data[0]);
          // setGuardList(res.data.guards);
        } else {
          props.toaster({ type: "success", message: res?.message });
        }
      },
      (err) => {
        console.log(err);
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
        console.log(err);
      }
    );
  };

  // text-slate-300

  const getBillList = () => {
    props.loader(true);
    Api("get", "admin/invoice", "", router).then(
      async (res) => {
        console.log(res);
        props.loader(false);

        if (res?.status) {
          let options = [];
          let pendingBills = [];
          res.data.invoices.forEach((ele, index) => {
            if (ele.status !== "paid") {
              ele.endDate = moment(ele.endDate).format("DD-MM-YYYY");
              ele.startDate = moment(ele.startDate).format("DD-MM-YYYY");
              ele.name = ele.client.fullName;
              ele.amount = ele.amount.toFixed(2);
              let amount = (
                (Number(ele.amount) / 100) * ele.client.vat +
                Number(ele.amount)
              ).toFixed(2);
              options.push({
                "Invoice ID": ele.invoice_id,
                "Client Name": ele.name,
                "Start Date": ele.startDate,
                "End Date": ele.endDate,
                Amount: amount,
                Status: ele.status === "paid" ? ele.status : "Pending",
              });
              pendingBills.push(ele);
            }
          });

          let total = pendingBills.reduce((accumulator, items) => {
            let amount = (
              (Number(items.amount) / 100) * items.client.vat +
              Number(items.amount)
            ).toFixed(2);
            return accumulator + Number(amount);
          }, 0);

          console.log(total.toFixed(2));
          setPendingAmmount(total.toFixed(2));
          setBillList(pendingBills);
          // setMaindata(res.data.invoices);
          setData({ userData: options });
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
    <div className="min-h-screen bg-black ">
      <div className="p-5 ">
        {/* <div className="border-2 border-red-700 rounded-xl p-5">
          <h1 className="text-white md:text-3xl text-xl font-bold">
            {moment(new Date()).format("ddd, DD MMM yyyy")}
          </h1>
          <h1 className="text-white md:text-3xl text-xl font-bold md:mt-5 mt-2">
            Hello <span className="text-red-700 uppercase">{userName}</span>{" "}
          </h1>
        </div> */}

        <div className="grid md:grid-cols-3 grid-col-1 ">

          <div className="border-2  border-customGray  border-t-red-700 border-t-4 relative flex justify-center   md:mr-3 mt-2 cursor-pointer" onClick={() => router.push('/tasks/task?type=today')}>
            <p className="font-bold text-lg text-center text-white absolute -top-4 bg-black px-3">Task status</p>
            <div className="bg-customGray w-full flex justify-center items-center h-24 rounded-md">
              <Tooltip title={<p className="text-xl text-center">{`Total Number of Tasks / Number of Tasks Covered`}</p>} arrow>
                <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                  <CountUp end={userIncome?.totalJobs} />/<CountUp end={userIncome?.pendingJobs} />
                </p>
              </Tooltip>
            </div>
          </div>
          <div className="border-2  border-customGray  border-t-red-700 border-t-4    relative flex justify-center   md:mr-3 mt-2 cursor-pointer" onClick={() => router.push('/billing')}>
            <p className="font-bold text-lg text-center text-white absolute -top-4 bg-black px-3">
              Invoice Status
            </p>
            <div className="bg-customGray w-full flex justify-center items-center h-24 rounded-md">
              <Tooltip title={<p className="text-xl text-center">{`Total Amount of Pending Invoices / Total Number of Pending Invoices`}</p>} arrow>
                <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                  £ <CountUp end={pendingAmount} duration={1} /> /{" "}
                  <CountUp end={billList.length} duration={1} />
                </p>
              </Tooltip>
            </div>
          </div>

          <div className="border-2  border-customGray  border-t-red-700 border-t-4   relative flex justify-center   md:mr-3 mt-2 cursor-pointer" onClick={() => router.push('/guardList')}>
            <p className="font-bold text-lg text-center text-white absolute -top-4 bg-black px-3">Guard Status</p>
            <div className="bg-customGray w-full flex justify-center items-center h-24 rounded-md">
              <Tooltip title={<p className="text-xl text-center">{`Total Number of Guard / Number of Guards Verified`}</p>} arrow>
                <p className="text-red-700 md:text-3xl text-2xl font-bold text-center">
                  <CountUp end={guardList.length} /> /  <CountUp end={guardList.filter(f => f.verified === 'true').length} />
                </p>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1">
        <div className="w-full grid-cols-1">
          <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-3 py-5 border-t-4 border-red-700 md:mx-5 m mx-3">
            <div>
              <p className="text-white font-bold md:text-3xl text-lg">
                Guard List
              </p>
            </div>
            <div className="flex items-center justify-end ">
              <div className=" flex items-center">
                <button
                  className="bg-red-700 text-white   text-base px-5 h-8 mr-2"
                  onClick={() => router.push("/guardList")}
                >
                  View All
                </button>
              </div>
            </div>
          </div>
          <div className="md:mx-5 mx-3">
            <Table
              columns={columns}
              data={guardList.slice(0, 5)}
              from={"dashboard"}
            />
          </div>
        </div>
        <div className="w-full grid-cols-1 md:mt-0 mt-5">
          <div className="grid grid-cols-2 bg-stone-900 md:px-5 p-3 py-5 border-t-4 border-red-700 md:mx-5 m mx-3">
            <div className="flex flex-col justify-between">
              <p className="text-white font-bold md:text-3xl text-lg">
                Unpaid Invoices
              </p>
            </div>

            <div className="w-full flex justify-end items-center  ">
              <div className=" flex items-center">
                <ExcelDownloder
                  filename={"client"}
                  // filename={`client-${props?.billInfo?.start} to ${props?.billInfo?.end} `}
                  type={Type.Button} // or type={'button'}
                >
                  <button className="bg-red-700 text-white   text-basexs px-5 h-8 mr-2">
                    Excel
                  </button>
                </ExcelDownloder>
              </div>
              <div className=" flex items-center">
                <button
                  className="bg-red-700 text-white  text-base px-5 h-8 mr-2"
                  onClick={() => router.push("/billing")}
                >
                  View All
                </button>
              </div>
            </div>
          </div>

          <div className="md:mx-5 mx-3 ">
            <BillingTable
              data={billList.slice(0, 5)}
              setBillId={setBillId}
              from="dashboard"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
