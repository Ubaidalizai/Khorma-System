import { AiOutlineMenu } from "react-icons/ai";
import { cloneElement, Fragment } from "react";
import { NavLink, useLocation } from "react-router-dom";

function DashboardSideButton({ icon, title, to }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <NavLink
      to={to}
      className={`text-sm font-medium px-4 py-2 text-right  hover:bg-primary-brown-light hover:border-r-4 hover:border-[var(--amber)] hover:text-white transition-all duration-200  peer group relative   hover: text-white  cursor-pointer   w-full  mx-auto rounded-md flex items-center gap-x-2 ${
        isActive
          ? " bg-primary-brown-light text-white border-r-4 border-[var(--amber)] "
          : " bg-transparent text-[var(--amber-light)] border-transparent"
      }`}
    >
      <span className="">{cloneElement(icon, { className: "w-[20px]" })}</span>
      <span className="hidden md:text-[14px] text-[12px]   group-hover:block">
        {title}
      </span>
    </NavLink>
  );
}

export default DashboardSideButton;
