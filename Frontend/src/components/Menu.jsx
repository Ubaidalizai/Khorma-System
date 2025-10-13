import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import { useClickOutSide } from "../hooks/useClickOutSide";

const MenusContext = createContext();

function useMenus() {
  const context = useContext(MenusContext);
  if (!context) {
    throw new Error("useMenus must be used within a MenusProvider");
  }
  return context;
}

const wrapperVariants = {
  open: {
    scaleY: 1,
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    opacity: 0,
    transition: {
      when: "afterChildren",
    },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
  },
  closed: {
    opacity: 0,
    y: -15,
  },
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

export default function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenusContext.Provider value={{ open, close, openId }}>
      {children}
    </MenusContext.Provider>
  );
}

function Menu({ children, className = "" }) {
  return (
    <div
      className={`flex  relative  items-center justify-end ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
}

function Toggle({ id }) {
  const { openId, open, close } = useMenus();
  const handleClick = (e) => {
    e.stopPropagation();
    openId === "" || openId !== id ? open(id) : close();
  };

  return (
    <button
      onClick={handleClick}
      className="bg-none border-none p-1 absolute top-2/4 left-2/4 -translate-2/4  transition-all duration-200 hover:bg-gray-100 transform rounded-sm"
    >
      <motion.span
        animate={openId === id ? "open" : "closed"}
        variants={iconVariants}
      >
        <HiEllipsisVertical className="w-4 h-4 text-gray-700" />
      </motion.span>
    </button>
  );
}

function List({ children, id, className = "", parent }) {
  const containerParent = document.querySelector(`.${parent}`) || document.body;
  const { openId, close } = useMenus();
  const ref = useClickOutSide(close);

  return createPortal(
    <AnimatePresence>
      {openId === id && (
        <motion.ul
          ref={ref}
          variants={wrapperVariants}
          initial="closed"
          animate="open"
          exit="closed"
          style={{ originY: "top", translateX: "-50%" }}
          className={`absolute  left-full  bottom-2/18 bg-white rounded-sm shadow-lg border border-gray-200 py-1 z-[100] min-w-[130px] overflow-hidden ${className}`}
        >
          {children}
        </motion.ul>
      )}
    </AnimatePresence>,
    containerParent
  );
}

function Button({ children, icon, onClick, className = "" }) {
  const { close } = useMenus();

  function handleClick(e) {
    e.stopPropagation();
    onClick?.();
    close();
  }

  return (
    <motion.li variants={itemVariants}>
      <button
        onClick={handleClick}
        className={`w-full text-sm  text-left bg-none border-none py-1.5 px-4  transition-all duration-200 flex items-center gap-3 hover:bg-gray-100 text-gray-700 ${className}`}
      >
        {icon && (
          <motion.span
            variants={{
              open: { scale: 1, y: 0 },
              closed: { scale: 0, y: -7 },
            }}
            className="w-3 h-3 text-gray-500"
          >
            {icon}
          </motion.span>
        )}
        <span className=" text-[12px]">{children}</span>
      </button>
    </motion.li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;
