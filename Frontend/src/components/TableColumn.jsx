import React from "react";

function TableColumn({ children, className }) {
  return (
    <td
      className={`${
        className ? className : ""
      } align-middle capitalize text-right px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900`}
    >
      {children}
    </td>
  );
}

export default TableColumn;
