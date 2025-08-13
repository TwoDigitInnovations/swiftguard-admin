/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { setKey, fromAddress } from "react-geocode";
import Constants from "../services/constant";
import axios from "axios";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const LocationDropdown = (props) => {
  const [showList, setShowList] = useState(false);
  const [prediction, setPredictions] = useState([]);
  const [address, setAddress] = useState({
    value: { description: "" },
  });
  const [location, setLocation] = useState({});
  const [value, setValue] = useState(null);

  useEffect(() => {
    setAddress({ value: { description: props.value }, label: props.value });
  }, [props.value]);

  const checkLocation = async (add) => {
    try {
      setKey(process.env.NEXT_PUBLIC_MAP_KEY);
      if (add) {
        fromAddress(add).then(
          (response) => {
            const lat = response.results[0].geometry.location;
            setLocation(lat);
            props.getLocationVaue(lat, add);
          },
          (error) => {
            console.error(error);
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!!address) {
      checkLocation(address.label);
    }
  }, [address]);

  return (
    <div className="relative">
      <div className="grid grid-cols-1">
        <div>
          <div className="grid grid-cols-1">
            <p className="text-white text-lg font-semibold ">{props.title}</p>
            <div className="rounded-md border-2 border-black">
              <GooglePlacesAutocomplete
                apiKey={process.env.NEXT_PUBLIC_MAP_KEY}
                selectProps={{
                  value: address,
                  onChange: setAddress,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDropdown;

// useEffect(() => {
//   getLocation();
// }, []);

// const getLocation = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//     } else {
//       // alert("Location permission denied");
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// };

// const GOOGLE_PACES_API_BASE_URL =
//   "https://maps.googleapis.com/maps/api/place";

// const GooglePlacesInput = async (text) => {
//   const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=AIzaSyAshORpoR1zzvluMgps8NQXO8avnVLnsL4&input=${text}`;
//   try {
//     //   const check = await PermissionsAndroid.check(
//     //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//     //   );

//     //   if (check) {
//     setShowList(true);
//     const result = await axios.request({
//       method: "post",
//       url: apiUrl,
//     });
//     if (result) {
//       const {
//         data: { predictions },
//       } = result;
//       setPredictions(predictions);
//       setShowList(true);
//     }
//     // } else {
//     //   getLocation();
//     // }
//   } catch (e) {
//   }
// };

// return (

// <div className="relative">
//   <div className="grid grid-cols-1">
//     <div>

//       <div className="grid grid-cols-1">
//         <p className="text-white text-lg font-semibold">{props.title}</p>
//         <input
//           className="rounded-md border-2 border-red-900 mt-1 outline-none text-white bg-black p-2 icncolor grid grid-cols-1"
//           value={address}
//           placeholder={props.title}
//           onChange={(location) => {
//             GooglePlacesInput(location.target.value);
//             setAddress(location.target.value);
//           }}
//         />
//       </div>
//     </div>
//   </div>
//   {prediction != "" && showList && (

//     <div className="border-2 border-red-900 rounded-md overflow-hidden bg-black absolute">
//       {prediction.map((item, index) => (
//         <div
//           key={index}
//           className="flex items-center border-b-2 border-red-900"
//         >

//           <p
//             className="text-md my-1 text-white px-2 cursor-pointer"
//             onClick={() => {
//               setAddress(item.description);
//               checkLocation(item.description);
//               setShowList(false);

//             }}
//           >
//             {item.description}
//           </p>
//         </div>
//       ))}
//     </div>
//   )}
// </div>
// );
