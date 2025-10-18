import React from "react";

function Table({ children, firstRow, className }) {
  return (
    <div className="w-full flex flex-col gap-y-2 py-3 mx-auto">
      {/* Optional header / action row */}
      {firstRow && (
        <div className="w-full relative text-left rtl:text-right dark:text-slate-600 mb-2">
          {firstRow}
        </div>
      )}

      {/* Scroll container (main behavior) */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table
          className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`}
        >
          {children}
        </table>
      </div>
    </div>
  );
}

export default Table;
