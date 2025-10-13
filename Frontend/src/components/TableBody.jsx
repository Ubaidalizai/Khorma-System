import React from "react";

function TableBody({ children }) {
  return (
    <tbody className="w-full  divide-y-1 divide-slate-200">{children}</tbody>
  );
}

export default TableBody;
