import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// set fonts
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

// const ConstantsUrl = "http://apis.jjowen.co.uk/v1/api/";
const ConstantsUrl = "https://apis.jjowen.co.uk/v1/api/";
// const ConstantsUrl = "http://localhost:3005/v1/api/";

// "https://sp-app-api.herokuapp.com"

function Api(method, url, data, router) {
  return new Promise(function (resolve, reject) {
    let token = "";

    if (typeof window !== "undefined") {
      token = localStorage?.getItem("token") || "";
    }
    axios({
      method,
      url: ConstantsUrl + url,
      data,
      headers: { Authorization: `jwt ${token}` },
    }).then(
      (res) => {
        resolve(res.data);
      },
      (err) => {
        console.log(err);
        if (err.response) {
          if (err?.response?.status === 401) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("userDetail");
              router.push("/");
            }
          }
          reject(err.response.data);
        } else {
          reject(err);
        }
      }
    );
  });
}

function ApiFormData(method, url, data, router) {
  return new Promise(function (resolve, reject) {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage?.getItem("token") || "";
    }
    axios({
      method,
      url: ConstantsUrl + url,
      data,
      headers: {
        Authorization: `jwt ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }).then(
      (res) => {
        resolve(res.data);
      },
      (err) => {
        console.log(err);
        if (err.response) {
          if (err?.response?.status === 401) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("userDetail");
              router.push("/");
            }
          }
          reject(err.response.data);
        } else {
          reject(err);
        }
      }
    );
  });
}

const timeSince = (date) => {
  date = new Date(date);
  const diff = new Date().valueOf() - date.valueOf();
  const seconds = Math.floor(diff / 1000);
  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " Years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " Months" : " Month") +
      " ago"
    );
  }
  interval = seconds / 604800;
  if (interval > 1) {
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " Weeks" : " Week") +
      " ago"
    );
  }

  interval = seconds / 86400;
  if (interval > 1) {
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " Days" : " Day") +
      " ago"
    );
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " Hours" : " Hour") +
      " ago"
    );
  }
  interval = seconds / 60;
  if (interval > 1) {
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " Min" : " min") +
      " ago"
    );
  }
  return "Just now";
};


const pdfDownload = async (fileName, data) => {
  return new Promise(function (resolve, reject) {
    const columns = Object.keys(data[0]); 

    console.log(columns)
    const headers = columns.map((column) => ({ text: column, style: 'tableHeader' })); 

    console.log(headers)
    const rows = data.map((user, i) => {
      const cells = columns.map((column) => ({ text: user[column], style: i % 2 == 0 ? 'firstRow' : 'secondRow' })); 
      return cells; 
    });
    const newData = [headers, ...rows]
    console.log(newData)

    const docDefinition = {
      content: [
        { text: 'Assignment History', style: 'header' },
        {
          style: 'tables',
          table: {
            headerRows: 1,
            // widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [headers, ...rows],
          },
          layout: 'noBorders'
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: 10,
          alignment: 'center'
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'white',
          alignment: 'center',
          fillColor: 'black'
        },
        firstRow: {
          fillColor: 'lightgrey',
          color: 'black',
          fontSize: 10,
        },
        secondRow: {
          fontSize: 10,
          color: 'black',
        }
      },
    };


    // let pdf = pdfmake
    // pdf.vfs = pdffonts.pdfMake.vfs;

    pdfMake.createPdf(docDefinition).getDataUrl((blob) => {
      console.log('pdf======>', blob)

      resolve(blob)
    });
  })



}

function sortByMonth(arr) {
  var months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  arr.sort(function (a, b) {
    return months.indexOf(a._id)
      - months.indexOf(b._id);
  });
}
export { Api, timeSince, ApiFormData, pdfDownload, sortByMonth };
