import React from "react";

function TableHeader({ headerData }) {
  return (
    <thead className={` w-full  h-12 rounded-sm`}>
      <tr className=" bg-dategold-300 text-slate-200 divide-x-1 divide-slate-200/20">
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
