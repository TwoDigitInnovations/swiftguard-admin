/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef, createRef, createContext } from "react";

import { useRouter } from "next/router";
// import BillingTable from "../src/components/billing2/billingTable";
// import Bill from "../src/components/billing2/billGenerate";

import moment from "moment";
import { extendMoment } from "moment-range";
// import ViewBill from "../src/components/billing2/viewBill";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { useScreenshot } from "use-react-screenshot";
import html2canvas from "html2canvas";
import { useExcelDownloder } from "react-xls";
import { IoSearch, IoCalendar } from "react-icons/io5";
import ArchiveTable from "./archiveTable";
import ViewArchive from "./viewArchive";
import { Api } from "../../services/service";

export const billContext = createContext();
const Archive = (props) => {
    const { ExcelDownloder, Type, setData } = useExcelDownloder();

    const componentRef = createRef();
    const ref = createRef();
    const router = useRouter();
    const [type, setType] = useState("man");
    const [clientlist, setClientList] = React.useState([]);
    const [opt, setOpt] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [billList, setBillList] = React.useState([]);
    const [billId, setBillId] = useState();
    const [guardRange, setGuardRange] = useState({
        endDate: moment(
            new Date(new Date().getTime() - 1 * 60 * 60 * 24 * 1000)
        ).format("YYYY-MM-DD"),
        startDate: moment(
            new Date(new Date().getTime() - 7 * 60 * 60 * 24 * 1000)
        ).format("YYYY-MM-DD"),
    });
    const [gaurdHistory, setGuardHistory] = useState([]);
    const [exeldata, setExelData] = useState([]);
    const [searchdata, setSearchdata] = useState({
        start: "",
        end: "",
        search: "",
    });
    const [maindata, setMaindata] = useState([]);
    const [billArray, setBillArray] = useState({});
    const [isrefresh, setIsRefresh] = useState({});


    useEffect(() => {
        // router.events.on("routeChangeComplete", () => {
        // if(type === 'man'){
        // getClientList();
        getBillList();
        getGuardHistory(guardRange);
        // }

        // });
    }, [type]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "JK Security | Invoice",
        copyStyles: true,
        // print: true,
        bodyClass: "bg-black",
        pageStyle: `@media print {
      .d_none{
          display: none !important;
        }
        .grid{
          display: flex !important;
        }
        .d_flex{
          display: flex !important;
        }
        .j_between{
          justify-content: space-between !important;
        }
        .black:{
          color: black !important;
        }
        .f_bold{
          font-weight: 700 !important;
        }
        .breaker {page-break-after: always;}
        .flexWraper{
          inline-size: 300px !important; 
        }
       
    }`,
    });
    function isNumber(value) {
        if (typeof value === "string") {
            return !isNaN(value);
        }
    }
    // const exportAsImage = async (element, imageFileName) => {
    //   const canvas = await html2canvas(element);
    //   const image = canvas.toDataURL("image/png", 1.0);
    //   // download the image
    // };
    function isDateWithinRage(date) {
        const when = extendMoment(moment)(date, "DD-MM-YYYY");
        const start = extendMoment(moment)(searchdata?.start, "YYYY-MM-DD");
        const end = extendMoment(moment)(searchdata?.end, "YYYY-MM-DD");
        const range = extendMoment(moment).range(start, end);
        return when.within(range);
    }
    const searchList = () => {
        console.log(searchdata);
        let data = [];
        if (!searchdata?.start && !searchdata?.end && searchdata?.search) {
            if (isNumber(searchdata?.search)) {
                data = maindata.filter((f) => {
                    let num = ((Number(f.amount) / 100) * 20 + Number(f.amount)).toFixed(
                        2
                    );
                    return num.includes(searchdata?.search);
                });
            } else {
                data = maindata.filter(
                    (f) =>
                        f.name.toLowerCase().includes(searchdata?.search.toLowerCase()) ||
                        f.invoice_id
                            .toLowerCase()
                            .includes(searchdata?.search.toLowerCase())
                );
            }
        } else {
            data = maindata.filter(
                (f) =>
                    isDateWithinRage(f.startDate) &&
                    f.name.toLowerCase().includes(searchdata?.search.toLowerCase())
            );
        }

        console.log(data);
        const options = [];
        if (data.length === 0) {
            data = maindata;
        }
        data.forEach((ele, index) => {
            options.push({
                "Invoice ID": ele.invoice_id,
                "Client Name": ele.name,
                "Start Date": ele.startDate,
                "End Date": ele.endDate,
                Amount: ele?.amount,
                Status: ele.status === "paid" ? ele.status : "Pending",
            });
        });
        setBillList(data);

        // setData({ userData: options });
    };

    const getGuardHistory = (range) => {
        const start = moment(range?.startDate, "YYYY-MM-DD").format();
        const end = moment(range?.endDate, "YYYY-MM-DD").format();
        console.log(start, end);
        props.loader(true);
        Api(
            "get",
            `admin/gaurdPay?startDate=${encodeURIComponent(
                start
            )}&endDate=${encodeURIComponent(end)}`,
            "",
            router
        ).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    // setGuardHistory(res.data);
                    let d = [];
                    res.data?.forEach((element, i) => {
                        // d.push({
                        //   No: i + 1,
                        //   "Outlet Name": element?.name,
                        //   Wage: element?.wages.toFixed(2),
                        // });
                        element.No = i + 1;
                        element.endDate = range?.endDate;
                        element.startDate = range?.startDate;
                        element.wages = element?.wages.toFixed(2);
                    });
                    setExelData(d);
                    setGuardHistory(res.data);
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

    const getClientList = () => {
        props.loader(true);
        Api("get", "provider/client", "", router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    let options = [];
                    res.data.clients.forEach((ele, index) => {
                        options.push({
                            label: ele.fullName,
                            value: ele._id,
                            // disabled: false,
                        });
                        if (res.data.clients.length === index + 1) {
                            setOpt(options);
                        }
                    });
                    setClientList(res.data.clients);
                    // exportAsImage(componentRef.current, "test");
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



    const resStoreInvoice = (id) => {
        props.loader(true);
        Api("delete", `admin/invoice/${id}?isArchive=false`, "", router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    props.toaster({
                        type: "success",
                        message: "Invoice restored successfully",
                    });
                    getBillList();
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

    const deleteInvoice = (id) => {
        props.loader(true);
        Api("delete", `admin/removeinvoice/${id}`, "", router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    props.toaster({
                        type: "success",
                        message: "Invoice deleted successfully",
                    });
                    getBillList();
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

    const getBillList = () => {
        props.loader(true);
        Api("get", "admin/archiveinvoice", "", router).then(
            async (res) => {
                console.log(res);
                props.loader(false);

                if (res?.status) {
                    let options = [];
                    res.data.invoices.forEach((ele, index) => {
                        ele.endDate = moment(ele.endDate).format("DD-MM-YYYY");
                        ele.startDate = moment(ele.startDate).format("DD-MM-YYYY");
                        ele.name = ele.client.fullName;
                        ele.amount = ele.amount.toFixed(2);

                        options.push({
                            "Invoice ID": ele.invoice_id,
                            "Client Name": ele.name,
                            "Start Date": ele.startDate,
                            "End Date": ele.endDate,
                            Amount: ele?.amount,
                            Status: ele.status === "paid" ? ele.status : "Pending",
                        });
                    });
                    setBillList(res.data.invoices);
                    setMaindata(res.data.invoices);
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

    const d = () => {
        return (
            <div className="bg-white" ref={ref}>
                <p>test</p>
            </div>
        );
    };

    return (
        <billContext.Provider value={[billArray, setBillArray]}>
            <div >
                <div>
                    {billId !== undefined && billId !== "" && (
                        <div className="flex justify-center pb-5">
                            <ViewArchive
                                {...props}
                                setBillId={setBillId}
                                billId={billId}
                                ref={componentRef}
                                handlePrint={handlePrint}
                                getBillList={getBillList}
                                setIsRefresh={setIsRefresh}
                                isrefresh={isrefresh}
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-2  p-4 rounded-xl  border-2 border-red-700 ">
                        <div className="flex flex-col justify-between">
                            <p className="text-white font-bold md:text-3xl text-lg">Deleted Invoices</p>
                        </div>
                        {/* <div className="flex justify-end items-center">
                            <div className="flex rounded-lg max-w-max bg-black">
                                <button
                                    className={`${type === "man" && "bg-red-700"
                                        } text-white  rounded-lg text-xs px-5 h-8`}
                                    onClick={() => {
                                        setType("man");
                                    }}
                                >
                                    Manage Invoices
                                </button>
                                <button
                                    className={`${type === "gen" && "bg-red-700"
                                        } text-white  rounded-lg text-xs px-5 h-8`}
                                    onClick={() => {
                                        setType("gen");
                                    }}
                                >
                                    Generate Invoices
                                </button>
                            </div>
                        </div> */}
                        {/* {type === "man" && (
                            <div className="w-full flex justify-between items-center col-span-2 mt-4">
                                <div className=" flex items-center">
                                    <ExcelDownloder
                                        filename={"client"}
                                        // filename={`client-${props?.billInfo?.start} to ${props?.billInfo?.end} `}
                                        type={Type.Button} // or type={'button'}
                                    >
                                        <button className="bg-red-700 text-white  rounded-lg text-xs px-5 h-8 mr-2">
                                            Excel
                                        </button>
                                    </ExcelDownloder>
                                </div>
                                <div className="flex items-center justify-end ">
                                    <input
                                        className="  rounded-md border-2 text-sm  border-red-900 outline-none ml-2 text-white bg-black w-44 p-1.5 "
                                        type="date"
                                        value={searchdata?.start}
                                        onChange={(text) => {
                                            setSearchdata({ ...searchdata, start: text.target.value });
                                        }}
                                    />
                                    <input
                                        className="  rounded-md border-2 border-red-900 text-sm  outline-none ml-2 text-white bg-black w-44 p-1.5 "
                                        type="date"
                                        value={searchdata?.end}
                                        onChange={(text) => {
                                            setSearchdata({ ...searchdata, end: text.target.value });
                                        }}
                                    />
                                    <input
                                        className="  rounded-md border-2 border-red-900 text-sm outline-none ml-2 text-white bg-black w-72 p-1.5 "
                                        placeholder="Search...."
                                        value={searchdata?.search}
                                        onChange={(text) => {
                                            setSearchdata({ ...searchdata, search: text.target.value });
                                        }}
                                    />
                                    <div
                                        onClick={searchList}
                                        className="h-8 w-8 bg-red-700 rounded-md ml-3 flex justify-center items-center"
                                    >
                                        <IoSearch className="text-white text-xl" />
                                    </div>
                                </div>
                            </div>
                        )} */}
                    </div>

                    <div className="p-4 rounded-xl  border-2 border-red-700">

                        <>
                            {/* {billList?.length > 0 && ( */}
                            <ArchiveTable
                                data={billList}
                                setBillId={setBillId}
                                deleteInvoice={deleteInvoice}
                                resStoreInvoice={resStoreInvoice}
                            />
                            {/* )} */}
                        </>

                    </div>
                </div>
            </div>

        </billContext.Provider>
    );
};

export default Archive;
