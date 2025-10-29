import {
  ChartBarIcon,
  CubeIcon,
  CurrencyDollarIcon,
  HomeIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AiOutlineBell, AiOutlineUser } from "react-icons/ai";
import { RiLogoutBoxLine } from "react-icons/ri";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import DashboardSideButton from "./DashboarSideButton";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
const tabs = [
  { name: "داشبورد", href: "/" },
  {
    name: "موجودی",
    href: "/inventory",
    icon: <CubeIcon className=" text-sm" />,
  },
  {
    name: "خریدها",
    href: "/purchases",
    icon: <ShoppingCartIcon className=" text-sm" />,
  },
  {
    name: "فروش‌ها",
    href: "/sales",
    icon: <CurrencyDollarIcon className=" text-sm" />,
  },
  {
    name: "حساب‌ها",
    href: "/accounts",
    icon: <UsersIcon className=" text-sm" />,
  },
  {
    name: "گزارش‌ها",
    href: "/reports",
    icon: <ChartBarIcon className=" text-sm" />,
  },
  {
    name: "پنل مدیریت",
    href: "/admin",
    icon: <ShieldCheckIcon className=" text-sm" />,
  },
];
const Layout = () => {
  const [isHover, setIsHover] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef();
  const [notifications] = useState([
    { id: 1, message: "Low stock alert: Dates", type: "warning" },
    { id: 2, message: "New purchase order received", type: "info" },
    { id: 3, message: "Daily sales report ready", type: "success" },
  ]);

  const [showUserMenu, setShowUserMenu] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("خروج موفقیت‌آمیز بود");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("خطا در خروج از سیستم");
    }
  };
  const handleEnterHover = () => {
    setIsHover(true);
  };
  const handleLeaveHover = () => {
    setIsHover(false);
  };
  return (
    <section className="peer   max-w-[1440px]  mx-auto  w-full min-h-screen grid   grid-cols-[0.12fr_.19fr_1fr_auto] sm:grid-cols-[0.06fr_.15fr_1fr_auto] md:grid-cols-[0.06fr_.13fr_1fr_auto] lg:grid-cols-[0.07fr_.12fr_1fr_auto]  grid-rows-[46px_auto]">
      <header className="relative z-50    col-span-4 row-start-1  duration-100 ease-out px-2 py-2 transition-all   xl:block   w-full  mx-auto   min-h-10">
        <div className=" absolute left-4 flex items-center gap-2">
          <div className="relative " style={{ direction: "ltr" }} ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className=" rounded-full transition-colors duration-200 flex items-center gap-3"
            >
              <span className="rounded-full text-slate-600 p-1  bg-slate-200 hover:bg-slate-300 transition-all duration-150">
                <AiOutlineUser className="text-[18px]   text-black" />
              </span>
              <p className=" font-medium  text-[10px]">
                {user?.name || "کاربر مدیر"}
              </p>
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div
                className="absolute left-0 mt-2 w-48 rounded-md shadow-lg z-50"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="py-1">
                  <div
                    className="px-4 py-2 border-b"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-dark)" }}
                    >
                      {user?.name || user?.email || "کاربر"}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-medium)" }}
                    >
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 hover:bg-slate-100 py-2 text-sm transition-colors duration-200"
                  >
                    <RiLogoutBoxLine className="text-[18px] text-black" />
                    خروج از سیستم
                  </button>
                </div>
              </div>
            )}
          </div>
          <span className=" relative  p-1 rounded-full bg-slate-200 hover:bg-slate-300 transition-all duration-150">
            <AiOutlineBell className="text-[18px] text-black" />
            {notifications.length > 0 && (
              <span
                className="absolute -top-1 -right-1 h-3 w-3 text-white text-[8px] rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--error-red)" }}
              >
                {notifications.length}
              </span>
            )}
          </span>
        </div>
      </header>
      <div
        onMouseEnter={handleEnterHover}
        onMouseLeave={handleLeaveHover}
        style={{
          boxShadow: "-4px 0 8px var(--shadow)",
          background:
            "linear-gradient(135deg, var(--primary-brown), var(--primary-brown-dark))",
        }}
        className="peer  max-h-screen  dark:bg-primary-dark-400 bg-accent-300  hover:col-end-3  col-start-1 col-end-2 row-start-1 row-end-4   flex flex-col gap-2  cursor-pointer transition-all duration-200 "
      >
        <div className="w-full  relative px-2  h-full group flex items-center flex-col justify-center">
          <div className="h-[23%]  flex items-center justify-center">
            {isHover ? (
              <div className="text-center">
                <h1 className="font-bold text-white text-[16px]">
                  سیستم مدیریت
                </h1>
                <p
                  className="text-sm"
                  style={{
                    color: "var(--amber-light)",
                    marginTop: "var(--space-1)",
                  }}
                >
                  تجارت و توزیع
                </p>
              </div>
            ) : (
              <div className="w-[40px]">
                <img src="./log.png" />
              </div>
            )}
          </div>
          <div className="flex  py-2  flex-2  flex-col justify-start   w-full ">
            <DashboardSideButton
              icon={<HomeIcon className=" text-sm" />}
              title={tabs[0].name}
              to={tabs[0].href}
            />
            <DashboardSideButton
              icon={tabs[1].icon}
              title={tabs[1].name}
              to={tabs[1].href}
            />
            <DashboardSideButton
              icon={tabs[2].icon}
              title={tabs[2].name}
              to={tabs[2].href}
            />
            <DashboardSideButton
              icon={tabs[3].icon}
              title={tabs[3].name}
              to={tabs[3].href}
            />
            <DashboardSideButton
              icon={tabs[4].icon}
              title={tabs[4].name}
              to={tabs[4].href}
            />
            <DashboardSideButton
              icon={tabs[5].icon}
              title={tabs[5].name}
              to={tabs[5].href}
            />
            <DashboardSideButton
              icon={tabs[6].icon}
              title={tabs[6].name}
              to={tabs[6].href}
            />
          </div>
        </div>
      </div>

      <main className="py-1 h-screen p-3  max-md:pl-1 w-[98%]  md:w-[98%] lg:w-full xl:w-[98%] peer-hover:col-start-3 transition-all  duration-1000  col-start-2 col-end-4 row-start-2 row-end-4  scroll-smooth max-h-[calc(100vh-50px)]    mx-auto ">
        <Outlet />
      </main>
    </section>
  );
};

export default Layout;

const SideBarItem = ({ navItem }) => {
  return (
    <li className="">
      <NavLink
        to={navItem.href}
        className={
          "peer  group flex items-center gap-1 py-1 font-poppins text-[14px] hover:bg-orange-300 border-b border-white hover:border-none"
        }
      >
        <motion.span className="flex justify-center"></motion.span>
        <span className="hidden group-hover:block">{navItem.name}</span>
      </NavLink>
    </li>
  );
};
