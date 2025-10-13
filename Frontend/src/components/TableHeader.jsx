import React from "react";

function TableHeader({ headerData }) {
  return (
    <thead className={` w-full  h-12`}>
      <tr className=" bg-dategold-400 bg-slate-100 text-slate-700  ">
        {headerData.map((header) => (
          <th
            key={header.title}
            className={` box-border text-center  align-middle  lg:text-[14px] md:text-xs text-[10px]  lg:font-medium font-light   uppercase md:tracking-wider`}
          >
            {header.title}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;
