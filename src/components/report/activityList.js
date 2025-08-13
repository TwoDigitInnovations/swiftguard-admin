import React, { useMemo } from "react";
import { timeSince } from "../../services/service";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import moment from "moment";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

const ActivityList = (props) => {
  // { row }
  // const props = { data: row.original };
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div className="mb-3">

      <>
        <div className="   border-t-4  border-red-900">
          <ListItemButton
            onClick={handleClick}
            className="flex md:px-5 p-3 justify-between w-full bg-stone-900"
          >
            <div>
              <p className="text-red-700 text-sm text-semibold mb-1 pr-5 block md:hidden">
                {moment(props?.data?.createdAt).format("DD-MM-YYYY, HH:mm")}
              </p>
              <p className="text-white font-semibold md:text-lg text-xs">
                {props.data.msg || props.data.message}
              </p>
            </div>

            <div className="flex">
              <p className="text-red-700 ml-2 text-md text-semibold mb-1 pr-5 md:block hidden">
                {moment(props?.data?.createdAt).format("DD-MM-YYYY, HH:mm")}
              </p>
              {open ? (
                <TiArrowSortedUp className="text-red-700 text-xl" />
              ) : (
                <TiArrowSortedDown className="text-red-700 text-xl" />
              )}
            </div>

          </ListItemButton>

          {props?.data && (
            <Collapse in={open} timeout="auto" unmountOnExit>
              <div className="border-red-700 border md:p-5 p-3">
                <div className="bg-stone-900 md:p-5 p-3">
                  <div className="flex justify-between">
                    <p className="text-red-700 text-xl font-bold">
                      {props?.data?.invited_for?.job?.title ||
                        props?.data?.job?.title}
                    </p>
                    <p className="text-red-700 text-xl font-bold">
                      £{" "}
                      {props?.data?.invited_for?.job?.amount ||
                        props?.data?.job?.amount}
                      /hr
                    </p>
                  </div>

                  <div className="grid grid-cols-2 mt-5">
                    <div>
                      <p className="text-red-700 text-lg font-bold">
                        Start Date & Time
                      </p>
                      <p className="text-white text-sm">
                        {moment(
                          props?.data?.invited_for?.job?.startDate ||
                          props?.data?.job?.startDate
                        ).format("DD/MM/YYYY, HH:mm")}
                      </p>
                    </div>
                    <div>
                      <p className="text-red-700 text-lg font-bold">
                        End Date & Time
                      </p>
                      <p className="text-white text-sm">
                        {moment(
                          props?.data?.invited_for?.job?.endDate ||
                          props?.data?.job?.endDate
                        ).format("DD/MM/YYYY, HH:mm")}
                      </p>
                    </div>
                  </div>
                  <p className="text-red-700 text-lg font-bold mt-5"> Address</p>
                  <p className="text-white text-sm">
                    {props?.data?.invited_for?.job?.address ||
                      props?.data?.job?.address}
                  </p>
                  <p className="text-red-700 text-lg font-bold mt-5"> Job Detail</p>
                  <p className="text-white text-sm max-w-max">
                    {props?.data?.invited_for?.job?.description ||
                      props?.data?.job?.description}
                  </p>
                </div>
              </div>
            </Collapse>
          )}
        </div>
      </>
    </div>
  );
};

export default ActivityList;
