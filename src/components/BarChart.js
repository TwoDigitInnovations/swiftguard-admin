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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = (props) => {
  const [opt, setOpt] = useState({});
  const [labels, setLables] = useState([]);
  useEffect(() => {
    setLables([]);
    setOpt({});
    const user = [];
    const client = [];
    const staff = [];
    const lables = [];
    props?.stockBar?.stats.forEach((element) => {
      user.push(element?.users || 0);
      client.push(element?.clients || 0);
      staff.push(element?.staff || 0);
      lables.push(element._id);
    });

    setLables(lables);
    setOpt({
      user,
      client,
      staff,
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
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Users",
        data: opt?.user,
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: "Staff",
        data: opt?.staff,
        backgroundColor: "rgb(75, 192, 192)",
      },
      {
        label: "Client",
        data: opt?.client,
        backgroundColor: "rgb(53, 162, 235)",
      },
    ],
  };
  return <Bar options={options} data={data} className="max-h-80 max-w-full" />;
};

export default BarChart;
