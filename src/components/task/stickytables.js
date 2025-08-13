import React from "react";
import styled from "styled-components";
import { useTable, useBlockLayout } from "react-table";
import { useSticky } from "react-table-sticky";

const Styles = styled.div`

  width:100%;


  .table {
    border: 1px solid #ddd;

    .tr {
      width:100% !important;
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      width:100% !important;
      padding: 5px;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      background-color: #fff;
      overflow: hidden;
      min-width:130px !important;

      :last-child {
        border-right: 0;
      }

      .resizer {
        display: inline-block;
        width: 5px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;

        &.isResizing {
          background: red;
        }
      }
    }

    &.sticky {
      overflow: scroll;
      .header,
      .footer {
        position: sticky;
        z-index: 1;
        width: fit-content;
      }

      .header {
        width:100% !important;
        top: 0;
        box-shadow: 0px 3px 3px #ccc;
      }

      .footer {
        bottom: 0;
        box-shadow: 0px -3px 3px #ccc;
      }

      .body {
        position: relative;
        z-index: 0;
        width:100%;
      }

      [data-sticky-td] {
        position: sticky;
      }

      [data-sticky-last-left-td] {
        box-shadow: 2px 0px 3px #ccc;
      }

      [data-sticky-first-right-td] {
        box-shadow: -2px 0px 3px #ccc;
      }
    }
  }
`;

let h = 600
let w = 700
if (typeof window !== "undefined") {
  h = window.screen.height
  w = window.screen.width - 90
}

function Stickytables({ columns, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 200,
      width: 200,
      maxWidth: w / 8
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      // defaultColumn,
    },
    useBlockLayout,
    useSticky
  );

  // Workaround as react-table footerGroups doesn't provide the same internal data than headerGroups
  // const footerGroups = headerGroups.slice().reverse();

  return (
    <Styles>
      <div
        {...getTableProps()}
        className="table sticky w-full"
        style={{ width: '100%' }}
      >
        <div className="header">
          {headerGroups.map((headerGroup, i) => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr" key={i}>
              {headerGroup.headers.map((column, inx) => (
                <div key={inx} {...column.getHeaderProps()} className="th">
                  {column.render("Header")}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()} className="body">
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <div key={i} {...row.getRowProps()} className="tr">
                {row.cells.map((cell, inx) => {
                  return (
                    <div key={inx} {...cell.getCellProps()} className="td">
                      {cell.render("Cell")}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* <div className="footer">
          {footerGroups.map(footerGroup => (
            <div {...footerGroup.getHeaderGroupProps()} className="tr">
              {footerGroup.headers.map(column => (
                <div {...column.getHeaderProps()} className="td">
                  {column.render("Footer")}
                </div>
              ))}
            </div>
          ))}
        </div> */}
      </div>
    </Styles>
  );
}

// function App() {
//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "Name",
//         Footer: "Name",
//         sticky: "left",
//         columns: [
//           {
//             Header: "First Name",
//             Footer: "First Name",
//             accessor: "firstName"
//           },
//           {
//             Header: "Last Name",
//             Footer: "Last Name",
//             accessor: "lastName"
//           }
//         ]
//       },
//       {
//         Header: "Info",
//         Footer: "Info",
//         columns: [
//           {
//             Header: "Age",
//             Footer: info => {
//               const total = info.rows.reduce(
//                 (sum, row) => row.values.age + sum,
//                 0
//               );
//               const average = Math.round(total / info.rows.length);
//               return <div>Moyenne: {average}</div>;
//             },
//             accessor: "age",
//             width: 50
//           },
//           {
//             Header: "Visits",
//             Footer: "Visits",
//             accessor: "visits",
//             width: 60
//           },
//           {
//             Header: "Status",
//             Footer: "Status",
//             accessor: "status"
//           }
//         ]
//       },
//       {
//         Header: " ",
//         Footer: " ",
//         sticky: "right",
//         columns: [
//           {
//             Header: "Profile Progress",
//             Footer: "Profile Progress",
//             accessor: "progress"
//           }
//         ]
//       }
//     ],
//     []
//   );

//   const data = React.useMemo(() => makeData(40), []);

//   return <Table columns={columns} data={data} />;
// }

export default Stickytables;