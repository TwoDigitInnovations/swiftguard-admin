/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    createContext,
    useEffect,
    useMemo,
    useState,
    useRef,
    useContext,
} from "react";
import Image from "next/image";
import { Api } from "../../services/service";
import { useRouter } from "next/router";
import JobTable from "./jobTable";
import moment from "moment";
import { AiFillCloseSquare } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";
import * as htmlToImage from "html-to-image";
import { useExcelDownloder } from "react-xls";
// import { billContext } from "../../../pages/billing2";

const ViewArchive = React.forwardRef((props, ref) => {
    const { billId, setBillId } = props;
    const router = useRouter();
    const [jobList, setJoblist] = useState([]);
    const [bill, setBill] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [note, setNote] = useState("");
    const [isCapture, setIsCapture] = useState(false);
    const { ExcelDownloder, Type, setData } = useExcelDownloder();
    // const [billArray, setBillArray] = useContext(billContext);

    const tableRef = useRef(null);

    useEffect(() => {
        if (billId !== undefined && billId !== "") {
            getInvoice();
        }
        // setBillArray(billArray)
    }, [billId]);

    const removeInvoice = () => {
        Api("delete", `admin/removeinvoice/${bill?._id}`, router).then((res) => {
            props.loader(false);
            if (res.status) {
                props.setBillId("");
            } else {
                props.toaster({ type: "error", message: res.message });
            }
        });
    }

    const generateinvoice = () => {
        Api("get", `admin/updareinvoice/${bill?._id}`, router).then((res) => {
            props.loader(false);
            if (res.status) {
                // props.toaster({ type: "success", message: "Invoice Updated" });
                setBill({
                    ...res.data.invoice,

                    vat: (res.data.invoice.amount / 100) * res.data.invoice.client.vat,
                    total:
                        (res.data.invoice.amount / 100) * res.data.invoice.client.vat +
                        res.data.invoice.amount,
                });
                setNote(res?.data?.invoice?.note || "");
                setJoblist(res.data.invoice.jobDetails);
                const start = encodeURIComponent(
                    moment(new Date(res.data.invoice.startDate), "YYYY-MM-DD").format()
                );
                const end = encodeURIComponent(moment(new Date(res.data.invoice.endDate), "YYYY-MM-DD").format());
                const s = moment(res.data.invoice.startDate).format("YYYY-MM-DD")
                const e = moment(res.data.invoice.endDate).format("YYYY-MM-DD")
                props.setIsRefresh({
                    ...props.isrefresh,
                    start: s,
                    end: e,
                    url: `listClient?start=${start}&end=${end}`
                })
                const d = [];
                res.data.invoice.jobDetails?.forEach((element, i) => {
                    d.push({
                        No: i + 1,
                        Date: moment(element?.startDate).format("DD/MM/YYYY"),
                        Description: `${element?.msg} from ${moment(
                            element?.startDate
                        ).format("DD/MM/YYYY hh:mm A")} to ${moment(
                            element?.endDate
                        ).format("DD/MM/YYYY hh:mm A")}`,
                        Rate: element?.rate,
                        Hour: element?.hour,
                        Amount: element.amount.toFixed(2),
                    });
                });
                setData({ userdata: d });
            } else {
                props.toaster({ type: "error", message: res.message });
            }
        });
    }

    const submit = (bills) => {
        const data = {
            start: bills?.startDate,
            end: bills?.endDate,
            client_id: bills?.client?._id,
            timestamp: moment(),
            invoiceID: bills?._id,
        };

        Api("post", "admin/invoice", data, router).then((res) => {
            props.loader(false);
            if (res.status) {
                props.toaster({ type: "success", message: "Invoice Updated" });
                setBill({
                    ...res.data.invoice[0],
                    client: bills.client,
                    vat: (res.data.invoice[0].amount / 100) * bills.client.vat,
                    total:
                        (res.data.invoice[0].amount / 100) * bills.client.vat +
                        res.data.invoice[0].amount,
                });
                setNote(res?.data?.invoice[0]?.note || "");
                setJoblist(res.data.invoice[0].jobDetails);
                const d = [];
                res.data.invoice[0].jobDetails?.forEach((element, i) => {
                    d.push({
                        No: i + 1,
                        Date: moment(element?.startDate).format("DD/MM/YYYY"),
                        Description: `${element?.msg} from ${moment(
                            element?.startDate
                        ).format("DD/MM/YYYY hh:mm A")} to ${moment(
                            element?.endDate
                        ).format("DD/MM/YYYY hh:mm A")}`,
                        Rate: element?.rate,
                        Hour: element?.hour,
                        Amount: element.amount.toFixed(2),
                        Discount: element?.discount?.toFixed(2) || 0,
                        Net: element?.discounted_amount?.toFixed(2) || element?.amount?.toFixed(2)
                    });
                });
                setData({ userdata: d });
            } else {
                props.toaster({ type: "error", message: res.message });
            }
        });
    };

    const sendinvoice = () => {
        props.loader(true);
        var node = document.getElementById("my-node");

        htmlToImage
            .toPng(node)
            .then(function (dataUrl) {
                setIsCapture(false);
                const data = {
                    // bill?.client?.email
                    email: bill?.client?.email,
                    attachment: dataUrl,
                };
                Api("post", "sendPdf", data, router).then(
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
            .catch(function (error) {
                props.loader(false);
                console.error("oops, something went wrong!", error);
            });
    };

    const getInvoice = () => {
        props.loader(true);
        Api("get", `admin/invoice/${billId}`, "", router).then(
            async (res) => {
                // console.log("second",res)
                props.loader(false);
                if (res?.status) {

                    // if (res.data.invoices[0].deleted) {
                    // submit(res.data.invoices[0]);
                    setBill({
                        ...res.data.invoices[0],

                        vat: (res.data.invoices[0].amount / 100) * res.data.invoices[0].client.vat,
                        total:
                            (res.data.invoices[0].amount / 100) * res.data.invoices[0].client.vat +
                            res.data.invoices[0].amount,
                    });
                    setNote(res?.data?.invoices[0]?.note || "");
                    setJoblist(res.data.invoices[0].jobDetails);
                    const s = moment(res.data.invoices[0].startDate).format("YYYY-MM-DD")
                    const e = moment(res.data.invoices[0].endDate).format("YYYY-MM-DD")
                    props.setIsRefresh({
                        start: s,
                        end: e,

                    })
                    // } else {
                    //   submit(res.data.invoices[0])
                    // }

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

    const updateStatus = () => {
        props.loader(true);

        Api(
            "patch",
            `admin/invoice/${billId}/status`,
            { status: "paid" },
            router
        ).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    props.toaster({ type: "success", message: res?.data?.message });
                    setBill({
                        ...bill,
                        status: "paid",
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
    };

    const createContext = () => {
        props.loader(true);

        Api("post", `admin/invoice/note/${billId}`, { note }, router).then(
            async (res) => {
                props.loader(false);
                if (res?.status) {
                    props.toaster({ type: "success", message: res?.data?.message });
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
        <div
            className={`${isCapture ? " p-5" : ""} bg-white w-[800px]`}
            ref={ref}
            id="my-node"
        >
            <div
                className={`${isCapture ? "hidden" : "flex justify-end items-center d_none"
                    } `}
            >
                {/* {!bill.deleted &&
                 <BiRefresh
                    className="bg-red-700 text-white text-3xl mr-2 rounded-sm"
                    onClick={() => {
                        submit();
                    }}
                />} */}

                <AiFillCloseSquare
                    className="text-red-700 text-4xl mr-2 d_none"
                    onClick={() => {
                        if (bill.deleted) {
                            removeInvoice()
                        } else {
                            props.setBillId("");
                            props.getBillList();
                        }

                    }}
                />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 border-b-2 border-gray-700 d_flex j_between">
                <div className="grid grid-cols-1 pl-2">
                    <div className="py-3 w-full ">
                        <Image
                            src="/jk.png"
                            width="180"
                            height="180"
                            alt="icon"
                            layout="fixed"
                            className="my-2"
                        ></Image>
                    </div>
                </div>
                <div className="grid grid-cols-1">
                    <div className="flex flex-col justify-start items-end p-3  ">
                        {/* {!bill.deleted && <button
                            className={`${isCapture
                                ? "hidden"
                                : "bg-green-700 rounded-sm text-white p-1 w-28 d_none"
                                } `}
                            onClick={updateStatus}
                            disabled={bill?.status === "paid"}
                        >
                            {bill?.status === "paid" ? "Paid" : "Mark as paid"}
                        </button>} */}
                        <p className="text-black mt-2 black">
                            INVOICE NO. {bill?.invoice_id}
                        </p>
                        <p className="text-black mt-1 black">
                            {moment(bill?.createdAt).format("DD, MMM YYYY")}
                        </p>
                    </div>
                </div>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1  mt-5 d_flex j_between">
                <div className="grid grid-cols-1">
                    <div className="flex flex-col justify-start items-start p-3  ">
                        <p className="text-black font-bold">Client Details:</p>
                        <p className="text-black mt-2 font-bold text-sm">
                            Name:{" "}
                            <span className="text-neutral-500 black font-normal">
                                {bill?.client?.billingName}
                            </span>
                        </p>
                        <p className="text-black mt-1 font-bold text-sm flexWraper">
                            Address:{" "}
                            <span className="text-neutral-500 black font-normal">
                                {bill?.client?.billingAddress}
                            </span>
                        </p>
                        <p className="text-black mt-1 font-bold text-sm">
                            Contact #:{" "}
                            <span className="text-neutral-500 black font-normal">
                                {bill?.client?.phoneNumber}
                            </span>
                        </p>
                        <p className="text-black mt-1 font-bold text-sm">
                            Email :{" "}
                            <span className="text-neutral-500 black font-normal">
                                {bill?.client?.email}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1">
                    <div className="flex flex-col justify-start items-end p-3  ">
                        <p className="text-black font-bold">Payment Details:</p>
                        <p className="text-black mt-2 font-bold text-sm">
                            V.A.T Reg #:{" "}
                            <span className="text-neutral-500 black font-normal">
                                899525846
                            </span>
                        </p>
                        <p className="text-black mt-1 font-bold text-sm">
                            Account Name:{" "}
                            <span className="text-neutral-500 black font-normal">
                                JK ORGANIZATION LTD
                            </span>
                        </p>
                        <p className="text-black mt-1 font-bold text-sm">
                            Account No:{" "}
                            <span className="text-neutral-500 black font-normal">
                                41425374
                            </span>
                        </p>
                        <p className="text-black mt-1 font-bold text-sm">
                            Bank Name:{" "}
                            <span className="text-neutral-500 black font-normal">HSBC</span>
                        </p>
                        <p className="text-black mt-1 font-bold text-sm">
                            Sort code:{" "}
                            <span className="text-neutral-500 black font-normal">
                                40-06-20
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full px-2">
                {/* <JobTable data={jobList} /> */}
                <table className="w-full bg-white border rounded-md" ref={tableRef}>
                    <thead className="text-left">
                        <th className="min-w-[50px] border p-1">No</th>
                        <th className="min-w-[50px] border p-1">Date</th>
                        <th className="min-w-[50px] border p-1">Description</th>
                        <th className="min-w-[50px] border p-1">Rate</th>
                        <th className="min-w-[50px] border p-1">Hour</th>
                        <th className="min-w-[50px] border p-1">Amount</th>
                        <th className="min-w-[50px] border p-1">Discount</th>
                        <th className="min-w-[50px] border p-1">Net</th>
                    </thead>

                    {jobList?.map((item, i) => (
                        <tr key={item?._id} className="text-left">
                            <th className="border  font-normal text-sm p-1">{i + 1}</th>
                            <th className="border  font-normal text-sm p-1">
                                {moment(item?.startDate).format("DD/MM/YYYY")}
                            </th>
                            <th className="border  font-normal text-sm p-1 flex-wrap  ">
                                {`${item?.msg} from ${moment(item?.startDate).format(
                                    "DD/MM/YYYY hh:mm A"
                                )} to ${moment(item?.endDate).format("DD/MM/YYYY hh:mm A")}`}
                            </th>
                            <th className="border  font-normal text-sm p-1">{item?.rate}</th>
                            <th className="border  font-normal text-sm p-1">
                                {item?.hour.toFixed(2)}
                            </th>
                            <th className="border  font-normal text-sm p-1">
                                {item?.amount?.toFixed(2)}
                            </th>
                            <th className="border  font-normal text-sm p-1">
                                {item?.discount?.toFixed(2) || 0}
                            </th>
                            <th className="border  font-normal text-sm p-1">
                                {item?.discounted_amount?.toFixed(2) || item?.amount?.toFixed(2)}
                            </th>
                        </tr>
                    ))}
                </table>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1  mt-5 d_flex j_between">
                <div className="grid grid-cols-1">
                    <div className="flex flex-col justify-start items-start p-3  ">
                        {/* <p className="text-black mt-2 font-bold text-sm flexWraper">
                Address:{" "}
                <span className="text-neutral-500 black font-normal">
                  {bill?.client?.billingAddress}
                </span>
              </p>
              <p className="text-black mt-1 font-bold text-sm">
                Phone #:{" "}
                <span className="text-neutral-500 black font-normal">
                  {bill?.client?.phoneNumber}
                </span>
              </p>
              <p className="text-black mt-1 font-bold text-sm">
                Email:{" "}
                <span className="text-neutral-500 black font-normal">
                  {bill?.client?.email}
                </span>
              </p> */}
                    </div>
                </div>
                <div className="grid grid-cols-1">
                    <div className="flex flex-col justify-start items-end p-3  ">
                        <p className="text-neutral-500 black font-normal text-sm  ">
                            Net Total:{" "}
                            {/* <span className="text-black mt-2 font-bold ">
                £{bill?.amount?.toFixed(2)}
              </span> */}
                            {bill.discount > 0 ? <span className="text-black mt-2 font-bold ">
                                £{(bill?.amount - bill.discount).toFixed(2)}
                            </span>
                                :
                                <span className="text-black mt-2 font-bold ">
                                    £{bill?.amount?.toFixed(2)}
                                </span>
                            }
                        </p>
                        <p className="text-neutral-500 black font-normal text-sm  ">
                            VAT {bill?.client?.vat}%:{" "}
                            <span className="text-black mt-2 font-bold ">
                                £{bill?.vat?.toFixed(2)}
                            </span>
                        </p>
                        {/* {bill.discount > 0 && <p className="text-neutral-500 black font-normal text-sm  ">
              Discount:
              <span className="text-black mt-2 font-bold ">£{bill.discount.toFixed(2)}</span>
            </p>} */}
                        <p className="text-neutral-500 black font-normal text-sm  ">
                            Gross Total:{" "}
                            {bill.discount > 0 ? <span className="text-black mt-2 font-bold ">
                                £{(bill?.total - bill.discount).toFixed(2)}
                            </span>
                                :
                                <span className="text-black mt-2 font-bold ">
                                    £{bill?.total?.toFixed(2)}
                                </span>
                            }
                        </p>
                        {/* {!bill.deleted && <div className={`${isCapture ? "hidden" : "flex mt-5 d_none"}`}>
                            <button
                                className="bg-red-700 rounded-sm text-white p-1 text-sm"
                                onClick={() => {
                                    setOpenDialog(true);
                                }}
                            >
                                View Note
                            </button>
                            <button
                                className="bg-red-700 rounded-sm text-white ml-1 p-1 text-sm"
                                onClick={props.handlePrint}
                            >
                                Print Invoice
                            </button>
                            <button
                                className="bg-red-700 rounded-sm text-white ml-1 p-1 text-sm"
                                onClick={() => {
                                    setIsCapture(true);
                                    setTimeout(() => {
                                        sendinvoice();
                                    }, 1000);
                                }}
                            >
                                Send Invoice
                            </button>
                            <ExcelDownloder
                                // data={data}
                                filename={"book"}
                                type={Type.Button} // or type={'button'}
                            >
                                <button className="bg-red-700 rounded-sm text-white ml-1 p-1 text-sm">
                                    Excel
                                </button>
                            </ExcelDownloder>
                        </div>}
                        {bill?.deleted && <div className={`${isCapture ? "hidden" : "flex mt-5 d_none"}`}>
                            <button
                                className="bg-red-700 rounded-sm text-white ml-1 p-1 text-sm"
                                onClick={generateinvoice}
                            >
                                Generate Invoice
                            </button>

                        </div>} */}
                    </div>
                </div>
            </div>
            <div className="border-b-2 border-gray-700 pb-5 px-2">
                <p className="text-black text-xs text-normal">
                    Please quote your invoice number and customer ref in all
                    correspondence or when making payment. Failure to do so may result in
                    us being unable to identify your account or cause a delay in applying
                    your payment. For payment enquiries or to discuss the content of this
                    invoice please contact: Olsi Kasa 0773 751 8194
                </p>
                <p className="text-black text-bold mt-2">
                    PLEASE NOTE THAT PAYMENT IS DUE WITHIN 7 DAYS OF INVOICE DATE, THANK
                    YOU FOR YOUR COOPERATION
                </p>
            </div>
            <p className="text-black text-normal text-xs py-3 px-2">
                © 2022 JK Security Limited
            </p>

            {openDialog ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none d_none">
                        <div className="relative my-6 w-1/2">
                            <div className="border-2 rounded-md shadow-lg relative flex flex-col w-full bg-black outline-none focus:outline-none border-red-900">
                                <div className="flex items-start justify-between p-5   rounded-t">
                                    <h3 className="text-2xl font-semibold text-white">Note</h3>
                                </div>
                                <div className="px-5 pt-5 pb-5 border-0  bg-black relative  md:h-auto w-full">
                                    <textarea
                                        className="w-full text-black p-1"
                                        rows={8}
                                        value={note}
                                        onChange={(text) => {
                                            setNote(text.target.value);
                                        }}
                                    ></textarea>
                                </div>

                                <div className="flex items-center justify-end p-3  bg-black rounded-b">
                                    <button
                                        className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            createContext();
                                        }}
                                    >
                                        Create
                                    </button>
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            setOpenDialog(false);
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
});

export default ViewArchive;
