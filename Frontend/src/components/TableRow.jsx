import React from "react";

function TableRow({ children }) {
  return (
    <tr className=" hover:bg-slate-100/50 md:py-1 h-12 text-base font-[400] text-left  w-full    transition-all duration-100 ease-out cursor-pointer  ">
      {children}
    </tr>
  );
}

export default TableRow;
