import { AnimatePresence, motion } from "framer-motion";
import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { FaXmark } from "react-icons/fa6";
import { useClickOutSide } from "../hooks/useClickOutSide";

const ModalContext = createContext();
export default function Modal({ children }) {
  const [openId, setOpenId] = useState("");
  const open = setOpenId;
  const close = () => setOpenId("");
  return (
    <ModalContext.Provider value={{ openId, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}
function Toggle({ children, id }) {
  const { open, close, openId } = useContext(ModalContext);
  const handleClick = () => {
    openId === "" || openId !== id ? open(id) : close();
  };
  return cloneElement(children, { onClick: (e) => handleClick(e) });
}

function Window({ children, name }) {
  const { openId, close } = useContext(ModalContext);
  const ref = useClickOutSide(close);
  let parentElement = document.querySelector("header") || document.body;

  return createPortal(
    <AnimatePresence>
      {openId === name && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.23 }}
          className="bg-text-400/20 dark:bg-white/20 backdrop-blur h-screen  mx-auto   fixed inset-0 z-50 grid place-items-center  cursor-pointer"
        >
          {cloneElement(children, { ref })}
        </motion.div>
      )}
    </AnimatePresence>,
    parentElement
  );
}

Modal.Toggle = Toggle;
Modal.Window = Window;
