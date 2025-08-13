import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { sortByMonth } from "../services/service";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function LineChart(props) {
  const [opt, setOpt] = useState({});
  const [labels, setLables] = useState([]);
  useEffect(() => {
    setLables([]);
    setOpt({});
    const rate = [];
    const wage = [];
    const lable = [];
    // props?.data?.stats.forEach((element) => {

    // });

    var months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    if (props.types === 'MONTHLY') {
      months.forEach((ele) => {
        const element = props?.data?.stats.find(f => f._id === ele)
        // props?.data?.stats.forEach((element) => {
        if (element) {
          rate.push(element["Net Income"]?.toFixed(2) || 0);
          lable.push(element._id);
        }
        //  else {
        //   rate.push(0);
        //   lable.push(ele);
        // }
        // });
      })
    } else if (props.types === 'AGGREGATE') {
      const currentYear = moment().format('YYYY');
      const year = [Number(currentYear) - 5, Number(currentYear) - 4, Number(currentYear) - 3, Number(currentYear) - 2, Number(currentYear) - 1, Number(currentYear)]
      year.forEach((ele) => {
        // props?.data?.stats.forEach((element) => {
        const element = props?.data?.stats.find(f => f._id === ele)
        // if (!lable.includes(ele)) {
        if (element) {
          rate.push(element["Net Income"]?.toFixed(2) || 0);
          lable.push(ele);
        } else {
          rate.push(0);
          lable.push(ele);
        }
        //   }
        // });
      })
    } else {
      props?.data?.stats.forEach((element) => {
        rate.push(element["Net Income"]?.toFixed(2) || 0);
        lable.push(element._id);
      });
    }
    console.log(lable)
    setLables(lable);
    setOpt({
      rate,
      wage,
    });
  }, [props]);

  const options = {
    responsive: true,
    plugins: {
      // legend: {
      //   position: "top",
      // },
      title: {
        display: true,
        text: props?.data?.message,
      },
    },
  };

  const data = {
    labels,
    //   data: labels.map(() => faker.datatype.number({ min: 0, max: 2000 })),
    datasets: [
      {
        label: "Net Income",
        // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        data: opt?.rate,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "white",
      },
      // {
      //   label: "Wage",
      //   // data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      //   data: opt?.wage,
      //   borderColor: "rgb(75, 192, 192)",
      //   backgroundColor: "white",
      // },
    ],
  };

  return <Line options={options} data={data} className="max-h-80 max-w-full" />;
}
