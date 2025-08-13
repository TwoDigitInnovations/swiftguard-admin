/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
// import faker from 'faker';
import { faker } from "@faker-js/faker";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function StockBarChart(props) {
  const [opt, setOpt] = useState({});
  const [labels, setlable] = useState([]);
  useEffect(() => {
    setlable([]);
    setOpt({});
    const income = [];
    const profit = [];
    const vat = [];
    const wage = [];
    const lable = [];
    var months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    if (props.types === 'MONTHLY') {
      months.forEach((ele) => {
        const element = props?.stockBar?.stats.find(f => f._id === ele)
        // props?.stockBar?.stats.forEach((element) => {
        if (element) {
          income.push(element["Net Income"]?.toFixed(2) || 0);
          profit.push(element?.Profit?.toFixed(2) || 0);
          vat.push(element?.Vat?.toFixed(2) || 0);
          wage.push(element?.Wage?.toFixed(2) || 0);
          lable.push(element._id);
        }
        // else{
        //   income.push(0);
        //   profit.push(0);
        //   vat.push(0);
        //   wage.push(0);
        //   lable.push(ele);
        // }
        // });
      })
    } else if (props.types === 'AGGREGATE') {
      const currentYear = moment().format('YYYY');
      const year = [Number(currentYear) - 5, Number(currentYear) - 4, Number(currentYear) - 3, Number(currentYear) - 2, Number(currentYear) - 1, Number(currentYear)]
      year.forEach((ele) => {
        const element = props?.stockBar?.stats.find(f => f._id === ele)
        // props?.stockBar?.stats.forEach((element) => {
        // console.log(income, ele === element._id, ele)
        // console.log(element)

        // if (!lable.includes(ele)) {
        if (element) {
          console.log('in------------>', ele)
          income.push(element["Net Income"]?.toFixed(2) || 0);
          profit.push(element?.Profit?.toFixed(2) || 0);
          vat.push(element?.Vat?.toFixed(2) || 0);
          wage.push(element?.Wage?.toFixed(2) || 0);
          lable.push(ele);
        } else {
          console.log('out------------>', ele)
          console.log(lable, ele)
          income.push(0);
          profit.push(0);
          vat.push(0);
          wage.push(0);
          lable.push(ele);
        }
        // }
        // });
      })
    } else {
      props?.stockBar?.stats.forEach((element) => {
        income.push(element["Net Income"]?.toFixed(2) || 0);
        profit.push(element?.Profit?.toFixed(2) || 0);
        vat.push(element?.Vat?.toFixed(2) || 0);
        wage.push(element?.Wage?.toFixed(2) || 0);
        lable.push(element._id);
      });
    }




    console.log(lable)
    setlable(lable);
    setOpt({
      income,
      profit,
      vat,
      wage,
    });
  }, [props]);

  const options = {
    plugins: {
      title: {
        display: true,
        text: props?.stockBar?.message,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Net Income",
        data: opt?.income,
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: "Profit",
        data: opt?.profit,
        backgroundColor: "rgb(75, 192, 192)",
      },
      {
        label: "Vat",
        data: opt?.vat,
        backgroundColor: "rgb(53, 162, 235)",
      },
      {
        label: "Wage",
        data: opt?.wage,
        backgroundColor: "rgba(153, 102, 255, 1)",
      },
    ],
  };
  return <Bar options={options} data={data} className="max-h-80 max-w-full" />;
}
