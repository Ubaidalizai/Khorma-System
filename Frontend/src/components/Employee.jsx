import { AiOutlineUpCircle } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import React, { useState, useEffect, useRef } from "react";
import {
  useEmployeeStocks,
  useEmployees,
  useCreateStockTransfer,
} from "../services/useApi";
import SearchInput from "../components/SearchInput";
import Table from "../components/Table";
import TableBody from "../components/TableBody";
import TableRow from "../components/TableRow";
import TableColumn from "../components/TableColumn";
import TableHeader from "../components/TableHeader";
import TableMenuModal from "../components/TableMenuModal";
import Menus from "../components/Menu";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { BiTransferAlt } from "react-icons/bi";
import Confirmation from "../components/Confirmation";
import GloableModal from "../components/GloableModal";
import Button from "../components/Button";
import { useForm } from "react-hook-form";

// Headers in Dari
const tableHeader = [
  { title: "محصول" },
  { title: "تعداد" },
  { title: "تاریخ تحویل" },
  { title: "عملیات" },
];

const Employee = () => {
  const [search, setSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferDestination, setTransferDestination] = useState("warehouse");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { register, handleSubmit, reset } = useForm();

  const { data: employees } = useEmployees();
  const { data: stocks, isLoading, error } = useEmployeeStocks({ 
    search, 
    employeeId: selectedEmployee 
  });
  const { mutate: createStockTransfer } = useCreateStockTransfer();

  useEffect(() => {
    if (employees?.data?.length > 0 && !selectedEmployee) {
      setSelectedEmployee(employees.data[0]._id);
      setEmployeeSearch(employees.data[0].name);
    }
  }, [employees, selectedEmployee]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredEmployees =
    employees?.data?.filter((emp) =>
      emp.name.toLowerCase().includes(employeeSearch.toLowerCase())
    ) || [];

  const filteredStocks = stocks?.data || [];

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleShowDetails = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleTransfer = (item) => {
    setSelectedItem(item);
    setShowTransfer(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteConfirm(true);
  };

  const onSubmitTransfer = (data) => {
    if (
      !data.quantity ||
      data.quantity <= 0 ||
      data.quantity > selectedItem.quantity_in_hand
    )
      return;
    createStockTransfer({
      product: selectedItem.product._id,
      fromLocation: "employee",
      toLocation: transferDestination,
      employee: selectedItem.employee._id,
      quantity: Number(data.quantity),
    });
  };

  const confirmDelete = () => {
    // Implement delete logic if available
    console.log("Delete item:", selectedItem);
    setShowDeleteConfirm(false);
    setSelectedItem(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading employee stocks: {error.message}
      </div>
    );
  }

  return (
    <section>
      <div className="mb-6"></div>
      <Table
        firstRow={
          <div className="w-full flex gap-4  items-center px-1.5">
            <div className=" w-[350px]">
              <SearchInput
                placeholder="جستجو کنید"
                value={search}
                onChange={handleSearch}
              />
            </div>
            <div className="relative w-[350px]" ref={dropdownRef}>
              <input
                type="text"
                placeholder="انتخاب کارمند..."
                value={employeeSearch}
                onChange={(e) => {
                  setEmployeeSearch(e.target.value);
                  setIsDropdownOpen(true);
                  const matched = filteredEmployees.find((emp) =>
                    emp.name
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                  );
                  if (matched) {
                    setSelectedEmployee(matched._id);
                  } else if (e.target.value === "") {
                    setSelectedEmployee(employees?.data?.[0]?._id || "");
                  }
                }}
                onFocus={() => setIsDropdownOpen(true)}
                r
                className={`w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-3.5 transition duration-300 ease focus:outline-none focus:border-slate-200 hover:border-slate-300 shadow-sm pr-10`}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <AiOutlineSearch
                  className={` w-6 ${isDropdownOpen ? " text-orange-400" : ""}`}
                />
              </div>
              <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => {
                  setEmployeeSearch("");
                  setIsDropdownOpen(!isDropdownOpen);
                }}
              >
                <AiOutlineUpCircle
                  className={`w-6 transition-transform ${
                    isDropdownOpen ? "rotate-180 text-orange-400" : ""
                  }`}
                />
              </div>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <div
                        key={emp._id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setEmployeeSearch(emp.name);
                          setSelectedEmployee(emp._id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {emp.name}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500">
                      هیچ کارمندی یافت نشد
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        }
      >
        <TableHeader headerData={tableHeader} />
        <TableBody>
          {filteredStocks?.map((item) => (
            <TableRow key={item._id}>
              <TableColumn>{item.product?.name || "N/A"}</TableColumn>
              <TableColumn className="font-semibold">
                {item.quantity_in_hand}
              </TableColumn>
              <TableColumn>
                {new Date(item.createdAt).toLocaleDateString("fa-IR")}
              </TableColumn>
              <TableColumn>
                <span className={`itemavs${item._id} relative`}>
                  <TableMenuModal>
                    <Menus>
                      <Menus.Menu>
                        <Menus.Toggle id={item._id} />
                        <Menus.List
                          parent={`itemavs${item._id}`}
                          id={item._id}
                          className="bg-white rounded-lg shadow-xl"
                        >
                          <Menus.Button
                            icon={<HiSquare2Stack />}
                            onClick={() => handleShowDetails(item)}
                          >
                            نمایش
                          </Menus.Button>
                          {item.quantity_in_hand > 0 && (
                            <Menus.Button
                              icon={<BiTransferAlt size={24} />}
                              onClick={() => handleTransfer(item)}
                            >
                              انتقال موجودی
                            </Menus.Button>
                          )}
                          <Menus.Button
                            icon={<HiTrash />}
                            onClick={() => handleDelete(item)}
                          >
                            حذف
                          </Menus.Button>
                        </Menus.List>
                      </Menus.Menu>
                    </Menus>
                  </TableMenuModal>
                </span>
              </TableColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Details Modal */}
      <GloableModal open={showDetails} setOpen={setShowDetails}>
        {selectedItem && (
          <div className="bg-white rounded-sm max-w-2xl w-[700px] max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                جزئیات موجودی کارمند
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    کارمند
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedItem.employee?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    محصول
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedItem.product?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    تعداد در دست
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {selectedItem.quantity_in_hand} عدد
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    تاریخ ایجاد
                  </h3>
                  <p className="text-sm text-gray-700">
                    {new Date(selectedItem.createdAt).toLocaleString("fa-IR")}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button onClick={() => setShowDetails(false)}>بستن</Button>
            </div>
          </div>
        )}
      </GloableModal>

      {/* Transfer Modal */}
      <GloableModal open={showTransfer} setOpen={setShowTransfer}>
        <form
          noValidate
          className="bg-white rounded-lg shadow-sm w-[600px]"
          onSubmit={handleSubmit(onSubmitTransfer)}
        >
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">انتقال موجودی</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <span>کارمند: </span>
              <span className="font-bold">
                {selectedItem?.employee?.name || "N/A"}
              </span>
            </div>
            <div>
              <span>محصول: </span>
              <span className="font-bold">
                {selectedItem?.product?.name || "N/A"}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مقصد انتقال
              </label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={transferDestination}
                onChange={(e) => setTransferDestination(e.target.value)}
              >
                <option value="warehouse">انبار</option>
                <option value="store">فروشگاه</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تعداد (حداکثر {selectedItem?.quantity_in_hand})
              </label>
              <input
                className="w-full border rounded-md px-3 py-2"
                type="number"
                min="1"
                max={selectedItem?.quantity_in_hand}
                {...register("quantity", {
                  required: true,
                  min: 1,
                  max: selectedItem?.quantity_in_hand,
                })}
              />
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
            <Button
              onClick={() => setShowTransfer(false)}
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              بستن
            </Button>
            <Button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              انتقال موجودی
            </Button>
          </div>
        </form>
      </GloableModal>

      {/* Delete Confirmation */}
      <GloableModal open={showDeleteConfirm} setOpen={setShowDeleteConfirm}>
        <Confirmation
          type="delete"
          handleClick={confirmDelete}
          handleCancel={() => setShowDeleteConfirm(false)}
          close={() => setShowDeleteConfirm(false)}
          message="آیا مطمئن هستید که این آیتم را حذف کنید؟"
        />
      </GloableModal>
    </section>
  );
};

export default Employee;
