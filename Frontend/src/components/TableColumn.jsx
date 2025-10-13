import React from "react";

function TableColumn({ children, className }) {
  return (
    <td
      className={`${
        className ? className : ""
      } align-middle capitalize text-center`}
    >
      {children}
    </td>
  );
}

export default TableColumn;
