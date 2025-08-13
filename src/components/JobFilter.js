import React from "react";
import moment from "moment";

const JobFilter = (data, hour, type) => {
  return new Promise(function (resolve, reject) {
    const newArray = [];
    // data.forEach((element, index) => {
    // const startdate = moment(data.startDate).format("MMM DD, YYYY");
    // const starttime = data.startTime;
    // moment(data.startTime, 'HH:mm').format('h:mm:ss');
    var start = new Date(data.startDate).getTime();
    var end = new Date(data.endDate).getTime();
    var distance = (end - start) / 1000;

    const check = Math.sign(distance);

    if (check === 1) {
      distance /= 60 * 60;
      var hours = Math.abs(distance);
      resolve(hours);
    } else {
      var hours = 0;
      resolve(hours);
    }

    // var hours = Math.floor((distance % (1000 * 60 * 60)) / (60 * 60));
    // if (type === "down") {
    //   if (hours <= hour) {
    //     newArray.push(data);
    //   }
    // } else {
    //   if (hours > hour) {
    //     newArray.push(data);
    //   }
    // }

    // if (data.length === index + 1) {
    //   resolve(newArray);
    // }
    // });
  });
};

export default JobFilter;

// var diff =(dt2.getTime() - dt1.getTime()) / 1000;
// diff /= (60 * 60);
// return Math.abs(Math.round(diff));
