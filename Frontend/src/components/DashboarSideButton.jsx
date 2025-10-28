import { AiOutlineMenu } from "react-icons/ai";
import { cloneElement, Fragment } from "react";
import { NavLink, useLocation } from "react-router-dom";

function DashboardSideButton({ icon, title, to }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <NavLink
      to={to}
      className={`text-sm font-medium hover:bg-primary-brown-light hover:text-white transition-all duration-200  peer group relative   hover: text-white  cursor-pointer   w-full  mx-auto rounded-md flex items-center gap-x-2`}
      style={{
        padding: "var(--space-2) var(--space-4)",
        backgroundColor: isActive
          ? "var(--primary-brown-light)"
          : "transparent",
        color: isActive ? "white" : "var(--amber-light)",
        borderRight: isActive
          ? `4px solid var(--amber)`
          : "4px solid transparent",
        textAlign: "right",
      }}
    >
      <span className="">{cloneElement(icon, { className: "w-[20px]" })}</span>
      <span className="hidden md:text-[14px] text-[12px]   group-hover:block">
        {title}
      </span>
    </NavLink>
  );
}

export default DashboardSideButton;
