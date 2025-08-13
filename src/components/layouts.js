/* eslint-disable react-hooks/exhaustive-deps */
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useRef, createRef, useEffect, useContext } from "react";
import { IoList, IoChevronBack, IoCloseCircleOutline } from "react-icons/io5";
import dynamic from "next/dynamic";
import { Context, userContext } from "../../pages/_app";
import { Api } from "../services/service";

import { IoLogOut } from "react-icons/io5";


import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper, { PaperProps } from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { RiOrganizationChart } from "react-icons/ri";
import Toggle from './Toggle/index'

//import Draggable from 'react-draggable';

// import {
//   BrowserView,
//   MobileView,
//   isBrowser,
//   isMobile,
// } from "react-device-detect";
import * as rdd from "react-device-detect";
import Constants from "../services/constant";

const menuItems = [
  {
    href: "/home",
    title: "Dashbord",
    // icon: "/home1.png",
    img: 'dashboard',
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
    sub: false,
  },
  {
    href: "/organization/organization",
    title: "Organization",
    icon: "/home1.png",
    activeIcon: "/home.png",
    access: ["ADMIN"],
    sub: false,
  },
  {
    href: "/tasks/task",
    title: "Tasks",
    icon: "/home1.png",
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
    sub: false,
  },
  {
    href: "/clients/clientsList",
    title: "Clients",
    icon: "/home1.png",
    activeIcon: "/home.png",
    access: ["USER", "ORG", "ADMIN"],
    sub: false,
  },
  {
    href: "/guardList",
    title: "Guard list",
    icon: "/security.png",
    activeIcon: "/security1.png",
    access: ["USER", "ORG", "ADMIN"],
    sub: false,
  },
  // {
  //   href: "/history",
  //   title: "History",
  //   icon: "/History.png",
  //   activeIcon: "/History1.png",
  //   access: ["USER", "ORG", "ADMIN"],
  // },
  {
    href: "/report",
    title: "Activity report",
    icon: "/privacy.png",
    activeIcon: "/privacy1.png",
    access: ["USER", "ORG", "ADMIN"],
    sub: false,
  },
  {
    href: "/statistics",
    title: "Statistics",
    icon: "/privacy.png",
    activeIcon: "/privacy1.png",
    access: ["ORG", "ADMIN"],
    sub: false,
  },
  // {
  //   href: "/billing",
  //   title: "Billing",
  //   icon: "/privacy.png",
  //   activeIcon: "/privacy1.png",
  //   access: ["USER", "ORG", "ADMIN"],
  // },
  {
    // href: "/billing2",
    title: "Billing Management",
    icon: "/privacy.png",
    sub: true,
    active: false,
    activeIcon: "/privacy1.png",
    access: ["USER", "ORG", "ADMIN"],
    list: [
      {
        href: "/billing2",
        title: "Billing",
        icon: "/privacy.png",
        activeIcon: "/privacy1.png",
        access: ["USER", "ORG", "ADMIN"],
      },
      {
        href: "/payroll",
        title: "Payroll",
        icon: "/privacy.png",
        activeIcon: "/privacy1.png",
        access: ["USER", "ORG", "ADMIN"],
      },
    ]
  },
  // {
  //   href: "/archive",
  //   title: "Archive Invoices",
  //   icon: "/privacy.png",
  //   activeIcon: "/privacy1.png",
  //   access: ["ORG", "ADMIN"],
  // },
  // {
  //   href: "/notification",
  //   title: "Notification ",
  //   icon: "/notification1.png",
  //   activeIcon: "/notification.png",
  // },
  {
    href: "/editProfile",
    title: "Edit profile",
    icon: "/privacy.png",
    activeIcon: "/privacy1.png",
    access: ["USER", "ORG", "ADMIN"],
    sub: false,
  },
  {
    href: "/setting",
    title: "Settings",
    icon: "/user.png",
    activeIcon: "/user1.png",
    access: ["USER", "ORG", "ADMIN"],
    sub: false,
  },
  // {
  //   href: "/festaevent",
  //   title: "Festa Events",
  //   icon: "/user.png",
  //   activeIcon: "/user1.png",
  //   access: ["USER", "ORG", "ADMIN"],
  // },
];

const Layout = ({ children, loader, toaster }) => {
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [pageShow, setPageShow] = useState(false);
  const [orgList, setOrgList] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [initial, setInitial] = useContext(Context);
  const [user, setUser] = useContext(userContext);
  const [userName, setUserName] = useState("ADMIN");
  const [menulist, setMenulist] = useState(menuItems)
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [organizationOpen, setOrganizationOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  // console.log(toggleDrawer)
  // console.log(mobile)
  // console.log(orgList)
  // console.log(initial)
  // console.log(user)
  // console.log(menulist)
  // console.log(open)
  // console.log(organizationOpen)

  const handleClose = () => {
    setOpen(false);
    setOrganizationOpen(false);
  };

  useEffect(() => {
    setMobile(rdd.isMobile);
    if (rdd.isBrowser) {
      setToggleDrawer(true);
    }
    getUserDetail();

    // getusername();
  }, [mobile]);

  const getUserDetail = () => {
    const user = localStorage.getItem("userDetail");
    if (!!user) {
      setUserDetail(JSON.parse(user));
      setUser(JSON.parse(user));
    } else {
      if (router.route !== "/" && router.route !== "/signup") {
        router.push("/");
      }
    }
  };

  useEffect(() => {
    getusername();
    router.events.on("routeChangeComplete", () => {
      // loader(false);
      // setPageShow(true);
      // getUserDetail();
      // getusername();
      setMenulist(menuItems)
    });
    setMenulist(menuItems)
  }, [user, initial]);

  // useEffect(() => {
  //   router.events.on("routeChangeComplete", () => {
  //     getusername();
  //   });
  // }, []);

  const getOrg = () => {
    loader(true);
    Api("get", "organizations", "", router).then(
      async (res) => {
        loader(false);
        // ;
        if (res?.status) {
          setOrgList(res.data.users);
        } else {
          toaster({ type: "success", message: res?.message });
        }
      },
      (err) => {
        loader(false);
        toaster({ type: "error", message: err.message });
        console.log(err);
      }
    );
  };

  const getusername = () => {
    if (user.type !== "ADMIN") {
      setUserName(user.username);
    } else if (user.type === "ADMIN") {
      if (!!initial) {
        setUserName(initial.username);
      }
    }
    if (user.type === "ADMIN" && initial.username === undefined) {
      setUserName("ADMIN");
    }
  };

  return (
    <div className="md:min-h-screen flex sm:flex-1 flex-col">
      {router.route !== "/" && router.route !== "/signup" && (
        <header
          className={`bg-black fixed top-0 w-full h-16 flex  font-semibold uppercase border-b-2 border-stone-800 z-30 ${toggleDrawer && user?.id !== "6450e9bef4d2cc08c2ec0431"
            ? "ml-60"
            : "ml-0"
            }`}
        >
          <div className="flex justify-center items-center  ">
            {/* {mobile && ( */}
            <IoList
              className="text-red-700 h-8 w-8 mx-5"
              onClick={() => {
                setToggleDrawer(!toggleDrawer);
              }}
            />
            {/* )} */}
            <div
              className={`flex-1  justify-center items-center ${toggleDrawer ? "hidden md:flex" : "flex"
                }`}
            >
              <div className="md:h-12 md:w-12 h-8 w-8 relative ml-0 md:ml-10  ">
                <Image
                  src={user?.profile || "/images.png"}
                  alt="icon"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                ></Image>
              </div>
              <h2 className="md:text-base text-sm text-red-700 font-semibold ml-2 uppercase ">
                {userName}

              </h2>
              {!!user && user.type === "ADMIN" && (
                <div
                  className="ml-5 h-7 w-7 flex justify-center items-center bg-red-700 rounded-md"
                  onClick={() => {
                    setOrganizationOpen(true);
                    getOrg();
                  }}
                >
                  <RiOrganizationChart className="text-white text-xl" />
                </div>
              )}
            </div>

            <div
              className={`flex-2  fixed right-5 justify-end ${toggleDrawer ? "hidden md:flex" : "flex"
                }`}
            >
              <div className="flex items-center">
                <div className="mr-2">
                  <Toggle props={{ loader, toaster }} />
                </div>
                <button
                  className=" flex  justify-between items-center cursor-pointer border-2 border-red-900 px-2 rounded-sm"
                  onClick={handleClickOpen}
                >
                  <p className="md:text-base text-sm text-white font-semibold mt-0.5 capitalize py-2">
                    Signout
                  </p>
                  <div className="mx-2    flex items-center justify-center item-center border-red-900">
                    {/* <Image
                      src="/signout.png"
                      width="20"
                      height="20"
                      alt="icon"
                      layout="auto"
                    ></Image> */}
                    <IoLogOut className="md:h-8 md:w-8 text-red-900" />

                  </div>

                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      {router.route !== "/" &&
        router.route !== "/signup" &&
        toggleDrawer &&
        user?.id !== "6450e9bef4d2cc08c2ec0431" && (
          /*bg-stone-800*/
          <aside
            className={`bg-black w-60 fixed  min-h-screen z-40 border-r-2 border-stone-800`}
          >
            <div className="py-3 w-full justify-center text-center border-b-4 border-red-900">
              <Image
                src="/logo.png"
                width="180"
                height="180"
                alt="icon"
                layout="fixed"
                className="my-2"
              ></Image>
            </div>

            <nav>
              <ul>
                {/* {!!user && user.type === "ADMIN" && (
                <li
                  className="py-2  flex  px-5 border-b-2 border-stone-800 align-middle "
                  onClick={() => {
                    router.push("/organization/organization");
                    if (mobile) {
                      setToggleDrawer(!toggleDrawer);
                    }
                  }}
                >
                  <div className="justify-center align-middle ">
                    <Image
                      src={
                        router.asPath === "/organization/organization"
                          ? "/home.png"
                          : "/home1.png"
                      }
                      width="15"
                      height="15"
                      alt="icon"
                      layout="fixed"
                    ></Image>
                  </div>
                  <Link href={"/organization/organization"}>
                    <a
                      className={`flex ml-2 font-bold hover:text-white cursor-pointer text-sm ${
                        router.asPath === "/organization/organization"
                          ? "text-white"
                          : "text-red-900"
                      }`}
                    >
                      Organization
                    </a>
                  </Link>
                  <div className="text-right flex-1 ">
                    <Image
                      src={
                        router.asPath === "/organization/organization"
                          ? "/fwd-white.png"
                          : "/fwd-red.png"
                      }
                      width="8"
                      height="15"
                      alt="icon"
                      layout="fixed"
                    ></Image>
                  </div>
                </li>
              )} */}
                {menulist.map((item) => (
                  <div key={item.title} className={`${router.asPath === item.href && 'bg-customGray  '}`} >

                    {!item.sub && <div >
                      {item?.access?.includes(user?.usertype) && (
                        <li
                          className="py-4  flex  px-5 border-b-2 border-stone-800 align-middle "
                          onClick={() => {
                            router.push(item.href);

                            const newItem = menulist.find(f => f.title === 'Billing Management')
                            newItem.active = false;
                            setMenulist([...menulist])
                            if (mobile) {
                              setToggleDrawer(!toggleDrawer);
                            }
                          }}
                        >
                          {/* {item.icon && <div className="justify-center align-middle ">
                            <Image
                              src={
                                router.asPath === item.href
                                  ? item.activeIcon
                                  : item.icon
                              }
                              width="15"
                              height="15"
                              alt="icon"
                              layout="fixed"
                            ></Image>
                          </div>} */}

                          {Constants[item?.title?.replace(' ', '')](router.asPath === item.href ? '#FB1913' : '#ffffff', 18)}
                          <Link href={item.href}>
                            <a
                              className={`flex ml-2 font-bold hover:text-white cursor-pointer text-md ${router.asPath === item.href
                                ? "text-red-900"
                                : "text-white"
                                }`}
                            >
                              {item.title}
                            </a>
                          </Link>
                          <div className="text-right flex-1 ">
                            <Image
                              src={
                                router.asPath === item.href
                                  ? "/fwd-red.png"
                                  : "/fwd-white.png"
                              }
                              width="8"
                              height="15"
                              alt="icon"
                              layout="fixed"
                            ></Image>
                          </div>
                        </li>
                      )}


                    </div>}

                    {item.sub && <div className="border-b-2 border-stone-800 " >
                      {item?.access?.includes(user?.usertype) && (
                        <li
                          className={`py-5  flex  px-5  border-stone-800 align-middle   ${item.active && 'bg-customGray '}`}

                          // className={`py-2  flex  px-5  border-stone-800 align-middle }`}
                          onClick={() => {
                            item.active = !item.active;
                            setMenulist([...menulist])
                          }}
                        >
                          {/* {item.icon && <div className="justify-center align-middle ">
                            <Image
                              src={
                                item.active
                                  ? item.activeIcon
                                  : item.icon
                              }
                              width="15"
                              height="15"
                              alt="icon"
                              layout="fixed"
                            ></Image>
                          </div>} */}
                          {Constants[item?.title.replace(' ', '')](item.active ? '#FB1913' : '#ffffff', 18)}
                          <div>
                            <a
                              className={`flex ml-2 font-bold hover:text-white cursor-pointer text-sm ${item.active
                                ? "text-red-900"
                                : "text-white"
                                }`}
                            >
                              {item.title}
                            </a>
                          </div>
                          <div className="text-right flex-1 ">
                            <Image
                              className={`${item.active && 'rotate-90'}`}
                              src={
                                item.active
                                  ? "/fwd-red.png"
                                  : "/fwd-white.png"
                              }
                              width={"8"}
                              height="15"
                              alt="icon"
                              layout="fixed"
                            ></Image>
                          </div>
                        </li>
                      )}
                      {item?.active && item?.list.map((submenu, inx) => (<div key={inx} >
                        {item?.access?.includes(user?.usertype) && (
                          <li
                            className={`py-2  flex  px-5  border-stone-800 align-middle  bg-customGray ${router.asPath === submenu.href && 'bg-customGray '}`}
                            onClick={() => {
                              router.push(submenu.href);
                              // if (mobile) {
                              // setToggleDrawer(!toggleDrawer);
                              // }
                            }}
                          >
                            {/* <div className="justify-center align-middle ">
                              <Image
                                src={
                                  router.asPath === item.href
                                    ? item.activeIcon
                                    : item.icon
                                }
                                width="15"
                                height="15"
                                alt="icon"
                                layout="fixed"
                              ></Image>
                            </div> */}
                            <Link href={submenu.href}>
                              <a
                                className={`flex ml-2 font-bold hover:text-white cursor-pointer text-sm ${router.asPath === submenu.href
                                  ? "text-red-900"
                                  : "text-white"
                                  }`}
                              >
                                {submenu.title}
                              </a>
                            </Link>
                            <div className="text-right flex-1 ">
                              <Image
                                src={
                                  router.asPath === submenu.href
                                    ? "/fwd-red.png"
                                    : "/fwd-white.png"
                                }
                                width="8"
                                height="15"
                                alt="icon"
                                layout="fixed"
                              ></Image>
                            </div>
                          </li>
                        )}
                      </div>))}
                    </div>}
                  </div>

                ))}
                {/* <li className="flex  px-5 border-b-2 border-stone-800 align-middle ">
                  <div className="flex items-center w-full">
                    <Toggle props={{ loader, toaster, user }} />
                  </div>
                </li>
                <li className="py-2  flex  px-4 border-b-2 border-stone-800 align-middle ">
                  <div
                    className="flex-1 flex h-full items-center cursor-pointer"
                    onClick={handleClickOpen}
                  >
                    <div className="mx-2 flex justify-start item-center  ">
                      <Image
                        src="/signout.png"
                        width="15"
                        height="15"
                        alt="icon"
                        layout="fixed"
                      ></Image>
                    </div>
                    <p className="text-xs text-red-700 font-semibold mt-0.5 capitalize">
                      Sign out
                    </p>
                  </div>
                </li> */}
                {/* <li className="py-2  flex  px-5 border-b-2 border-stone-800 align-middle ">
                  <div>
                    <a
                      className={`flex ml-2 font-bold hover:text-white cursor-pointer text-sm text-red-900 `}
                    >
                      Version 27.1
                    </a>
                  </div>
                </li> */}
              </ul>
            </nav>
          </aside>
        )}
      <div className="flex flex-col md:flex-row z-0 h-screen">
        <main
          className={
            router.route !== "/" &&
              router.route !== "/signup" ?
              toggleDrawer &&
                user?.id !== "6450e9bef4d2cc08c2ec0431"
                ? " md:pl-60 md:w-full  md:pt-16"
                : mobile ? 'flex-1 pt-16' : "flex-1 md:pt-16" : 'flex-1  md:pt-0'
          }
        >
          {/* {pageShow ? children : loader(true)} */}
          {children}
        </main>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Alert
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Do you want to logout ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              router.push("/");
              localStorage.clear();
              setOpen(false);
              setUser({});
              setToggleDrawer(true)
              setInitial({});
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={organizationOpen} onClose={handleClose}>
        <div className="px-5 pt-20 pb-5 border-2  border-red-900 bg-black relative overflow-hidden w-80">
          <IoCloseCircleOutline
            className="text-red-700 h-8 w-8 absolute right-2 top-2"
            onClick={handleClose}
          />
          <p className="text-white text-lg font-semibold">Organization</p>
          <select
            className="w-full bg-black text-white border-2 border-red-700 rounded-md p-2 mt-2 outline-none"
            value={JSON.stringify(initial)}
            onChange={(text) => {
              setInitial(JSON.parse(text.target.value));
              handleClose();
            }}
          >
            <option value={JSON.stringify({})}>Select</option>
            {orgList.map((item) => (
              <option value={JSON.stringify(item)} key={item._id}>
                {item.username}
              </option>
            ))}
          </select>
        </div>
      </Dialog>
    </div>
  );
};

export default Layout;
