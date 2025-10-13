import React from "react";
import { BiSearch } from "react-icons/bi";

function SearchInput({ placeholder }) {
  return (
    <div className="relative">
      <input
        className="w-full py-[14px] bg-transparent placeholder:text-text-500 placeholder:text-lg  placeholder:font-medium placeholder:text-slate-700 dark:text-slate-200  text-slate-700 text-sm border border-slate-200  rounded-md pl-3 pr-28  transition duration-300 ease focus:outline-none focus:border-slate-300 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm focus:shadow"
        placeholder={placeholder}
      />
      <button
        className="absolute top-2/4 -translate-y-2/4 h-[90%] right-1 flex items-center gap-1 rounded-sm  bg-dategold-400  px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-text-700 focus:shadow-none active:bg-text-700 hover:bg-text-300  cursor-pointer  active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
      >
        <BiSearch className=" text-slate-100 dark:text-slate-200" />
        <span className=" text-slate-100 font-semibold"> جستجو</span>
      </button>
    </div>
  );
}

export default SearchInput;
