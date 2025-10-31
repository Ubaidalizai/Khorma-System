import {
  ChartBarIcon,
  CubeIcon,
  CurrencyDollarIcon,
  HomeIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  UsersIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

import { useState, useRef } from "react";
import { AiOutlineBell, AiOutlineUser } from "react-icons/ai";
import { RiLogoutBoxLine } from "react-icons/ri";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
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
  // Finance group items will be rendered together below
  { name: "حساب‌ها", href: "/accounts", icon: <UsersIcon className=" text-sm" /> },
  { name: "هزینه‌ها", href: "/expenses", icon: <BanknotesIcon className=" text-sm" /> },
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
  const [isOpen,setIsOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef();
  const location = useLocation();
  const [notifications] = useState([
    { id: 1, message: "Low stock alert: Dates", type: "warning" },
    { id: 2, message: "New purchase order received", type: "info" },
    { id: 3, message: "Daily sales report ready", type: "success" },
  ]);

  const [showUserMenu, setShowUserMenu] = useState(false);

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
    <section className="peer mx-auto  w-full min-h-screen grid   grid-cols-[0.12fr_.19fr_1fr_auto] sm:grid-cols-[0.06fr_.15fr_1fr_auto] md:grid-cols-[0.06fr_.13fr_1fr_auto] lg:grid-cols-[0.07fr_.12fr_1fr_auto]  grid-rows-[46px_auto]">
      <header className="relative z-50 col-span-4 row-start-1  duration-100 ease-out px-2 py-2 transition-all   xl:block   w-full  mx-auto   min-h-10">
        <span className=" absolute top-2/4 -translate-y-2/4 right-4 cursor-pointer group">
          <AnimatedMenuIcon isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
        </span>
        <div className=" absolute left-6 top-2/4 -translate-y-2/4 flex items-center gap-4">
          <div className="relative " style={{ direction: "ltr" }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className=" rounded-full transition-colors duration-200 flex items-center gap-3"
            >
              <span className="rounded-full text-slate-600 p-1 shadow-sm hover:bg-slate-300 transition-all duration-150">
                {user.image ? <img src={`http://localhost:3001/uploads/${user.image}`} alt={user.name} className="w-[40px] h-[20px] rounded-full" /> : <AiOutlineUser className="text-[25px]   text-black" />}
              </span>
              <p className=" font-medium  text-[15px]">
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
          {/* <span className=" relative  p-1 rounded-full shadow-sm hover:bg-slate-300 transition-all duration-150">
            <AiOutlineBell className="text-[24px] text-black" />
            {notifications.length > 0 && (
              <span
                className="absolute -top-1 -right-1 h-3 w-3 text-white text-[8px] rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--error-red)" }}
              >
                {notifications.length}
              </span>
            )}
          </span> */}
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
        className={`peer  max-h-screen  dark:bg-primary-dark-400 bg-accent-300  hover:col-end-3  col-start-1 ${
          isOpen ? "col-end-3" : "col-end-2"
        } row-start-1 row-end-4   flex flex-col gap-2  cursor-pointer transition-all duration-200 `}
      >
        <div className="w-full  relative px-2  h-full group flex items-center flex-col justify-center">
          <div className="h-[23%]  flex flex-col items-center justify-around">
            {isHover || isOpen ? (
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
          <div className="flex  py-2  flex-2  flex-col justify-start gap-y-0.5   w-full ">
            <DashboardSideButton
              icon={<HomeIcon className=" text-sm" />}
              title={tabs[0].name}
              to={tabs[0].href}
              isOpen={isOpen}
            />
            <DashboardSideButton
              icon={tabs[1].icon}
              title={tabs[1].name}
              to={tabs[1].href}
              isOpen={isOpen}
            />
            <DashboardSideButton
              icon={tabs[2].icon}
              title={tabs[2].name}
              to={tabs[2].href}
              isOpen={isOpen}
            />
            <DashboardSideButton
              icon={tabs[3].icon}
              title={tabs[3].name}
              to={tabs[3].href}
              isOpen={isOpen}
            />
            {/* Finance group - collapsible */}
            <button
              type="button"
              onClick={() => setIsFinanceOpen((v) => !v)}
              className="w-full flex items-center justify-between text-sm font-medium rounded-lg transition-all duration-200"
              style={{
                padding: "var(--space-2) var(--space-4)",
                backgroundColor:
                  location.pathname.startsWith("/accounts") || location.pathname.startsWith("/expenses")
                    ? "var(--primary-brown-light)"
                    : "transparent",
                color:
                  location.pathname.startsWith("/accounts") || location.pathname.startsWith("/expenses")
                    ? "white"
                    : "var(--amber-light)",
                borderRight:
                  location.pathname.startsWith("/accounts") || location.pathname.startsWith("/expenses")
                    ? `4px solid var(--amber)`
                    : "4px solid transparent",
                textAlign: "right",
              }}
              onMouseEnter={(e) => {
                if (!location.pathname.startsWith("/accounts") && !location.pathname.startsWith("/expenses")) {
                  e.currentTarget.style.backgroundColor = "var(--primary-brown-light)";
                  e.currentTarget.style.color = "white";
                }
              }}
              onMouseLeave={(e) => {
                if (!location.pathname.startsWith("/accounts") && !location.pathname.startsWith("/expenses")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--amber-light)";
                }
              }}
            >
              <span className="flex items-center">
                <CurrencyDollarIcon className="ml-3 h-5 w-5" />
                <span className="mr-3">مالی</span>
              </span>
              <span className={`transition-transform duration-200 ${isFinanceOpen ? "rotate-180" : ""}`}>⌄</span>
            </button>
            {isFinanceOpen && (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
                <div style={{ marginRight: "var(--space-4)" }}>
                  <DashboardSideButton icon={tabs[4].icon} title={tabs[4].name} to={tabs[4].href} />
                </div>
                <div style={{ marginRight: "var(--space-4)" }}>
                  <DashboardSideButton icon={tabs[5].icon} title={tabs[5].name} to={tabs[5].href} />
                </div>
              </div>
            )}
            <DashboardSideButton
              icon={tabs[6].icon}
              title={tabs[6].name}
              to={tabs[6].href}
              isOpen={isOpen}
            />
            <DashboardSideButton
              icon={tabs[7].icon}
              title={tabs[7].name}
              to={tabs[7].href}
            />
          </div>
        </div>
      </div>

      <main
        className={`py-1 h-screen p-3  max-md:pl-1 w-[98%]  md:w-[98%] lg:w-full xl:w-[98%] peer-hover:col-start-3 transition-all  duration-1000  col-start-2 col-end-4 row-start-2 row-end-4  scroll-smooth max-h-[calc(100vh-50px)]    mx-auto ${
          isOpen ? "col-start-3" : ""
        }`}
      >
        <Outlet />
      </main>
    </section>
  );
};

export default Layout;
const transition = {
  duration: 0.5,
  ease: [0.76, 0, 0.24, 1],
};
const AnimatedMenuIcon = ({ isOpen, toggle }) => {
  return (
    <motion.button
      onClick={toggle}
      aria-label="Toggle menu"
      whileTap={{ scale: 0.9 }}
      className="relative w-10 h-10 flex cursor-pointer items-center justify-center group"
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-7 h-7 text-primary-brown-light group-hover:text-amber-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        {/* Top Line */}
        <motion.line
          x1="3"
          y1="6"
          x2="21"
          y2="6"
          animate={
            isOpen
              ? { y1: 12, y2: 12, rotate: 45, transition }
              : { y1: 6, y2: 6, rotate: 0, transition }
          }
          style={{ originX: "50%", originY: "50%" }}
        />

        {/* Middle Line */}
        <motion.line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          animate={
            isOpen ? { opacity: 0, transition } : { opacity: 1, transition }
          }
        />

        {/* Bottom Line */}
        <motion.line
          x1="3"
          y1="18"
          x2="21"
          y2="18"
          animate={
            isOpen
              ? { y1: 12, y2: 12, rotate: -45, transition }
              : { y1: 18, y2: 18, rotate: 0, transition }
          }
          style={{ originX: "50%", originY: "50%" }}
        />
      </motion.svg>

      {/* Glowing hover ring for premium feel */}
      <motion.span
        className="absolute inset-0 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.3, opacity: 0.1 }}
        transition={{ duration: 0.4 }}
        style={{ backgroundColor: "var(--primary-brown-light)" }}
      />
    </motion.button>
  );
};
