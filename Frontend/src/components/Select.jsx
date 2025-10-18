import { useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { useClickOutSide } from "../hooks/useClickOutSide";

function Select({
  label,
  error,
  id,
  options,
  register,
  name,
  defaultSelected,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const ref = useClickOutSide(() => setIsOpen(false));
  const filteredOptions = options?.filter((opt) =>
    opt.value.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (value) => {
    setSelected(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={ref}>
      <label
        htmlFor={id}
        className="mb-1 block text-base font-medium text-slate-600 dark:text-white"
      >
        {label}
      </label>

      {/* Select Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-transparent capitalize  placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-sm pr-3 pl-4 py-2 md:py-[14px] transition duration-300 ease focus:outline-none hover:border-slate-300 shadow-sm focus:shadow cursor-pointer flex justify-between items-center`}
      >
        <span className=" text-[16px] font-[400]">
          {selected || defaultSelected || "انتخاب نکردید"}
        </span>
        <RiArrowDownSLine
          className={` ${
            isOpen ? " rotate-180" : ""
          } transition-all duration-200`}
        />
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white  border border-slate-200 rounded-sm shadow-lg p-2">
          {/* Search box */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-2 px-3 py-1 text-sm border border-slate-200 rounded-sm focus:outline-none focus:border-slate-300 dark:bg-primary-dark-400 dark:slate-accent-300"
          />

          {/* Scrollable options */}
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(option.value)}
                  className={`cursor-pointer px-3 py-2 slate-sm capitalize hover:bg-slate-100  ${
                    selected === option.value ? "bg-slate-100 " : ""
                  }`}
                >
                  {option.value}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-2">
                No results found
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hidden input for form registration */}
      <input
        {...register}
        type="hidden"
        name={name}
        value={selected}
        readOnly
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default Select;
