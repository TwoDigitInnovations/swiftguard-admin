import { useExcelDownloder } from "react-xls";
import { useEffect, useState, useMemo } from "react";
import moment from "moment";
import { Api } from "../../services/service";
import { useRouter } from "next/router";
import PaginationTable from "../PaginationTable";

const Payroll = (props) => {
    const { ExcelDownloder, Type, setData } = useExcelDownloder();

    const [guardRange, setGuardRange] = useState({
        endDate: moment(
            new Date(new Date().getTime() - 1 * 60 * 60 * 24 * 1000)
        ).format("YYYY-MM-DD"),
        startDate: moment(
            new Date(new Date().getTime() - 7 * 60 * 60 * 24 * 1000)
        ).format("YYYY-MM-DD"),
    });

    const router = useRouter();

    const [guardHistory, setGuardHistory] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pageCount, setPageCount] = useState(1);

    // pageIndex localStorage me save karein
    const [pageIndex, setPageIndex] = useState(() => {
        return Number(localStorage.getItem("payrollPageIndex")) || 1;
    });

    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // jab pageIndex change ho to save karein
        localStorage.setItem("payrollPageIndex", pageIndex);
    }, [pageIndex]);

    useEffect(() => {
        checkHistory();
    }, [pageIndex, pageSize]);

    const checkHistory = () => {
        const history = localStorage.getItem("history");
        if (history) {
            try {
                const h = JSON.parse(history);
                setGuardRange(h);
                getGuardHistory(h, pageIndex);
                localStorage.removeItem("history");
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                });
            } catch (error) {
                console.error("Error parsing history:", error);
                getGuardHistory(guardRange, pageIndex);
            }
        } else {
            getGuardHistory(guardRange, pageIndex);
        }
    };

    const getGuardHistory = (range, currentPage = 1) => {
        const start = moment(range?.startDate, "YYYY-MM-DD").format();
        const end = moment(range?.endDate, "YYYY-MM-DD").format();

        setLoading(true);
        props.loader?.(true);

        Api(
            "get",
            `admin/gaurdPay?startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}&page=${currentPage}&limit=${pageSize}`,
            "",
            router
        ).then(
            async (res) => {
                setLoading(false);
                props.loader?.(false);

                if (res?.status && res?.data) {
                    const guards = res.data?.guards || [];

                    const processedGuards = guards
                        .filter(element => element)
                        .map((element, i) => ({
                            _id: element._id || `guard-${i}`,
                            No: (currentPage - 1) * pageSize + (i + 1),
                            name: element.name || "N/A",
                            wages: element.wages ? Number(element.wages).toFixed(2) : "0.00",
                            payroll: element.payroll || "N/A",
                            endDate: range?.endDate,
                            startDate: range?.startDate,
                            job_id: element.job_id || null
                        }));

                    const excelData = processedGuards.map(guard => ({
                        No: guard.No,
                        "Outlet Name": guard.name,
                        Wage: guard.wages,
                        Payroll: guard.payroll
                    }));

                    setData?.({ userdata: excelData });
                    setTotalCount(res?.data?.totalPages);
                    setPageCount(res?.data?.totalPages);
                    setGuardHistory(processedGuards);
                } else {
                    props.toaster?.({ type: "error", message: res?.message || "No data found" });
                    setGuardHistory([]);
                    setTotalCount(0);
                    setPageCount(1);
                }
            },
            (err) => {
                console.error("API Error:", err);
                setLoading(false);
                props.loader?.(false);
                props.toaster?.({ type: "error", message: err?.message || "Failed to fetch data" });
                setGuardHistory([]);
                setTotalCount(0);
                setPageCount(1);
            }
        );
    };

    function ActionSection({ row }) {
        if (!row?.original) return null;

        return (
            <div className="flex">
                <button
                    className="bg-green-700 text-white py-1 px-2 rounded-md hover:bg-green-600 transition-colors"
                    onClick={() => {
                        try {
                            const dateData = {
                                startDate: row.original.startDate || guardRange.startDate,
                                endDate: row.original.endDate || guardRange.endDate
                            };
                            localStorage.setItem("history", JSON.stringify(dateData));

                            const guardId = row.original._id || row.original.id;
                            if (guardId) {
                                router.push(
                                    `${guardId}?start=${dateData.startDate}&end=${dateData.endDate}`
                                );
                            } else {
                                props.toaster?.({ type: "error", message: "Invalid guard data" });
                            }
                        } catch (error) {
                            props.toaster?.({ type: "error", message: "Failed to navigate" });
                        }
                    }}
                >
                    View
                </button>
            </div>
        );
    }

    const columns = useMemo(
        () => [
            {
                Header: "No",
                accessor: "No",
                Cell: ({ row }) => {
                    const rowNumber = (pageIndex - 1) * pageSize + row.index + 1;
                    return <span>{rowNumber}</span>;
                }
            },
            { Header: "Outlet Name", accessor: "name" },
            { Header: "Wage", accessor: "wages" },
            { Header: "Payroll", accessor: "payroll" },
            { Header: "Action", Cell: ActionSection, disableSortBy: true }
        ],
        [pageIndex, pageSize]
    );

    const handleSearch = () => {
        setPageIndex(1);
        getGuardHistory(guardRange, 1);
    };

    const handlePageChange = (newPage) => {
        setPageIndex(newPage);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setPageIndex(1);
    };

    return (
        <div className="md:px-5 p-4 rounded-xl md:mx-5 mx-3">
            <div className="bg-stone-900 md:px-5 p-4 rounded-xl border-t-8 border-red-700">
                <p className="text-white font-bold md:text-3xl text-lg">Payroll</p>
            </div>

            <div className="border-2 border-red-700 rounded-lg p-5 mt-4">
                <p className="text-white text-lg font-bold">
                    Payroll from {guardRange?.startDate} to {guardRange?.endDate}
                    {totalCount > 0 && (
                        <span className="text-sm font-normal ml-2">
                            (Total: {totalCount} records)
                        </span>
                    )}
                </p>

                <div className="grid md:grid-cols-2 grid-cols-1 mt-5">
                    <div className="grid grid-cols-1 md:mr-2">
                        <p className="text-white text-lg font-semibold mt-2">Start Date</p>
                        <input
                            value={guardRange?.startDate}
                            onChange={(e) =>
                                setGuardRange(prev => ({ ...prev, startDate: e.target.value }))
                            }
                            type="date"
                            className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5"
                        />
                    </div>

                    <div className="grid grid-cols-1">
                        <p className="text-white text-lg font-semibold mt-2">End Date</p>
                        <input
                            value={guardRange?.endDate}
                            onChange={(e) =>
                                setGuardRange(prev => ({ ...prev, endDate: e.target.value }))
                            }
                            type="date"
                            className="rounded-md border-2 border-red-900 mt-1 outline-none text-neutral-500 bg-black p-1.5"
                        />
                    </div>
                </div>

                <div className="flex justify-between mt-5">
                    <ExcelDownloder
                        filename={`payroll-${guardRange.startDate}-to-${guardRange.endDate}`}
                        type={Type.Button}
                    >
                        <button className="bg-red-700 text-white py-1 px-3 rounded-md ml-2 hover:bg-red-600 transition-colors">
                            Excel
                        </button>
                    </ExcelDownloder>

                    <button
                        className="bg-green-700 text-white py-1 px-2 rounded-md hover:bg-green-600 transition-colors"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>
            </div>

            <div className="mt-5">
                <PaginationTable
                    columns={columns}
                    data={guardHistory}
                    pageCount={pageCount}
                    setPageCount={setPageCount}
                    pageIndex={pageIndex}
                    setPageIndex={handlePageChange}
                    pageSize={pageSize}
                    setPageSize={handlePageSizeChange}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default Payroll;
