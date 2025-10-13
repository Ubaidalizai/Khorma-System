import React from "react";

function Table({ children, firstRow }) {
  return (
    <div className="w-[100%] flex  flex-col gap-y-2 py-3  mx-auto">
      <div className="w-full  relative text-left rtl:text-right dark:text-slate-600">
        {firstRow}
      </div>
      <div className=" w-full">
        <table className="w-full rounded-sm  relative text-left rtl:text-right dark:text-slate-600">
          {children}
        </table>
      </div>
    </div>
  );
}

export default Table;
