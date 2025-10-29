import React from "react";
import { createPortal } from "react-dom";
import { useClickOutSide } from "../hooks/useClickOutSide";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";

function GloableModal({ open, setOpen, children, isClose }) {
  const ref = useClickOutSide(() => setOpen(false));
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.23 }}
          className="bg-text-400/20  backdrop-blur-[1px]  bg-black/15   h-screen  mx-auto   fixed inset-0 z-50 flex justify-center items-center  cursor-pointer"
        >
          <div className="relative p-3" ref={ref}>
            {!isClose && (
              <AiOutlineClose
                className=" absolute top-5 right-4 p4"
                onClick={() => setOpen(false)}
              />
            )}

            {React.isValidElement(children)
              ? React.cloneElement(children, {
                  close,
                  onSubmit: (e) => {
                    try {
                      if (typeof children.props.onSubmit === "function") {
                        children.props.onSubmit(e);
                      }
                    } finally {
                      // close after submit handler runs
                      close();
                    }
                  },
                })
              : children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default GloableModal;
