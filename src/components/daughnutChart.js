/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function DoughnutChart(props) {
  const [opt, setOpt] = useState({});
  const [labels, setLables] = useState([]);
  useEffect(() => {
    const user = [];
    const lables = [];
    props?.daughNut?.stats.forEach((element) => {
      user.push(element?.revenue?.toFixed(2) || 0);
      lables.push(element.name);
    });

    setLables(lables);
    setOpt({
      user,
    });
  }, [props]);

  const data = {
    labels,
    datasets: [
      {
        label: "# of Votes",
        data: opt?.user,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgba(80, 80, 200, 3)",
          "rgb(75, 192, 192)",
          "rgba(153, 102, 255, 1)",
          "rgb(53, 162, 235)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgba(80, 80, 200, 3)",
          "rgb(75, 192, 192)",
          "rgba(153, 102, 255, 1)",
          "rgb(53, 162, 235)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut data={data} className="max-h-80 " />;
}
