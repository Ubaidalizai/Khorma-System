import { GiProfit } from "react-icons/gi";
import {
  MdOutlineAccountBalance,
  MdAccountBalanceWallet,
} from "react-icons/md";
import {
  ChartBarIcon,
  CubeIcon,
  CurrencyDollarIcon,
  HomeIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { RiLogoutBoxLine } from "react-icons/ri";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardSideButton from "./DashboarSideButton";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { BACKEND_BASE_URL } from "../services/apiConfig";

const Layout = () => {
  const [isHover, setIsHover] = useState(false);
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarIsOpen");
    return savedState ? JSON.parse(savedState) : false;
  });
  const [openSubMenu, setOpenSubMenu] = useState(null);

  // Save sidebar state to localStorage whenever it changes
  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarIsOpen", JSON.stringify(newState));
      return newState;
    });
  };

  const { user, logout } = useAuth();

  const tabs = [
    { name: "داشبورد", href: "/", icon: <HomeIcon /> },
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
    {
      name: "مالی",
      href: "/accounts",
      icon: <MdAccountBalanceWallet className=" text-sm" />,
      otherOption: [
        {
          name: "هزینه‌ها",
          href: "/expenses",
          icon: <BanknotesIcon className=" text-sm" />,
        },
        {
          name: "حساب ها",
          href: "/accounts",
          icon: <MdOutlineAccountBalance className=" text-sm" />,
        },
        {
          name: "درآمد ",
          href: "/income",
          icon: <GiProfit className=" text-sm" />,
        },
      ],
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
    <section className="grid grid-cols-[0.05fr_0.4fr_1fr_auto] sm:grid-cols-[0.06fr_0.3fr_1fr_auto] md:grid-cols-[0.08fr_0.3fr_1fr_auto] lg:grid-cols-[0.07fr_.17fr_1fr_auto] min-h-screen max-w-[1540px] w-full mx-auto">
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
        } row-start-1 row-end-2   flex flex-col `}
      >
        <div className="w-full relative px-2 h-full group flex flex-col">
          {/* Menu Toggle Button */}
          <div className="w-full flex justify-end items-center pt-1 pb-0">
            <span className="cursor-pointer group">
              <AnimatedMenuIcon isOpen={isOpen} toggle={toggleSidebar} />
            </span>
          </div>

          {/* Logo Section */}
          <div className="h-[15%] flex flex-col items-center justify-center py-2">
            {isHover || isOpen ? (
              <div className="text-center">
                <h1 className=" md:font-bold font-medium text-white md:text-[16px] text-[14px]">
                  اصغری خرما فروشی{" "}
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

          {/* Navigation Items - Middle */}
          <div className="flex-1 flex flex-col justify-start gap-y-1 w-full py-2 overflow-y-auto">
            <DashboardSideButton
              icon={<HomeIcon className=" text-sm" />}
              title={tabs[0].name}
              to={tabs[0].href}
              sidebarOpen={isOpen}
              isHover={isHover}
            />
            <DashboardSideButton
              icon={tabs[1].icon}
              title={tabs[1].name}
              to={tabs[1].href}
              sidebarOpen={isOpen}
              isHover={isHover}
            />
            <DashboardSideButton
              icon={tabs[2].icon}
              title={tabs[2].name}
              to={tabs[2].href}
              sidebarOpen={isOpen}
              isHover={isHover}
            />
            <DashboardSideButton
              icon={tabs[3].icon}
              title={tabs[3].name}
              to={tabs[3].href}
              sidebarOpen={isOpen}
              isHover={isHover}
            />
            <DashboardSideButton
              icon={tabs[4].icon}
              title={tabs[4].name}
              to={tabs[4].href}
              otherOptions={tabs[4].otherOption}
              setOpen={setOpenSubMenu}
              isOpen={openSubMenu === tabs[4].name}
              sidebarOpen={isOpen}
              isHover={isHover}
            />

            <DashboardSideButton
              icon={tabs[5].icon}
              title={tabs[5].name}
              to={tabs[5].href}
              sidebarOpen={isOpen}
              isHover={isHover}
            />
            <DashboardSideButton
              icon={tabs[6].icon}
              title={tabs[6].name}
              to={tabs[6].href}
              sidebarOpen={isOpen}
              isHover={isHover}
            />
          </div>

          {/* User Info Section - Bottom */}
          <div className="h-auto border-t border-slate-200/20 py-3 px-2">
            {isHover || isOpen ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {user?.image && user.image !== "default-user.jpg" ? (
                    <img
                      src={`${BACKEND_BASE_URL}/public/images/users/${user.image}`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <div className="flex-1 text-right">
                    <p className="text-sm font-medium text-white">
                      {user?.name || "کاربر مدیر"}
                    </p>
                    <p className="text-xs text-white/70 truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                </button>

                {/* User dropdown menu */}
                {showUserMenu && (
                  <div
                    className="absolute bottom-full left-0 mb-2 w-48 rounded-md shadow-lg z-50"
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
            ) : (
              <div className="flex justify-center">
                {user?.image && user.image !== "default-user.jpg" ? (
                  <img
                    src={`${BACKEND_BASE_URL}/public/images/users/${user.image}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold cursor-pointer"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <main
        className={`pt-6 pb-1 h-screen p-3  max-md:pl-1 w-[98%]  md:w-[98%] lg:w-full xl:w-[98%] peer-hover:col-start-3 transition-all  duration-1000  col-start-2 col-end-4  scroll-smooth max-h-screen    mx-auto ${
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
      className="relative  flex cursor-pointer items-center justify-center group"
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-5 h-5 text-amber-300 group-hover:text-white"
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
