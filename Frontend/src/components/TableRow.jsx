import React from "react";

function TableRow({ children }) {
  return (
    <tr className=" hover:bg-slate-100 md:py-1 h-12 text-base font-medium text-left  w-full    transition-all duration-100 ease-out cursor-pointer  ">
      {children}
    </tr>
  );
}

export default TableRow;
