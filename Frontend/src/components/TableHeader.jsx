import React from "react";

function TableHeader({ headerData }) {
  return (
    <thead className={` w-full  h-12 rounded-sm`}>
      <tr className=" bg-slate-100 text-slate-500 divide-x-1 divide-slate-200/20">
        {headerData.map((header, index) => (
          <th
            key={index}
            className={` box-border text-right  align-middle  lg:text-[14px] md:text-xs text-[10px]  lg:font-medium font-light   uppercase md:tracking-wider`}
          >
            {header.title}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;
