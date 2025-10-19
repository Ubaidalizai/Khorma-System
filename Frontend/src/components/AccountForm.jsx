import React, { useState, useEffect } from "react";
import {
  fetchSuppliers,
  fetchCustomers,
  fetchEmployees,
} from "../services/apiUtiles";

function AccountForm({ register, handleSubmit, watch, onClose }) {
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState("supplier");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [suppliersData, customersData, employeesData] = await Promise.all(
          [fetchSuppliers(), fetchCustomers(), fetchEmployees()]
        );

        setSuppliers(
          suppliersData.map((s) => ({ value: s._id, label: s.name }))
        );
        setCustomers(
          customersData.map((c) => ({ value: c._id, label: c.name }))
        );
        setEmployees(
          employeesData.map((e) => ({ value: e._id, label: e.name }))
        );
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getReferenceOptions = () => {
    switch (accountType) {
      case "supplier":
        return suppliers;
      case "customer":
        return customers;
      case "employee":
        return employees;
      default:
        return [];
    }
  };

  const handleFormSubmit = (data) => {
    const accountData = {
      type: data.type,
      refId: data.refId,
      name: data.name,
      openingBalance: parseFloat(data.openingBalance) || 0,
      currentBalance: parseFloat(data.currentBalance) || 0,
      currency: data.currency || "AFN",
      isDeleted: false,
    };
    handleSubmit(accountData);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleFormSubmit)}
      className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'
    >
      <div className='p-6 border-b border-gray-200 flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-gray-900'>
          اضافه کردن حساب جدید
        </h2>
      </div>
      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              نوع حساب *
            </label>
            <select
              {...register("type")}
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
              required
            >
              <option value='supplier'>تامین کننده</option>
              <option value='customer'>مشتری</option>
              <option value='employee'>کارمند</option>
              <option value='bank'>بانک</option>
              <option value='cash'>نقد</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              مرجع *
            </label>
            <select
              {...register("refId")}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
              required
            >
              <option value=''>انتخاب مرجع</option>
              {getReferenceOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              نام حساب *
            </label>
            <input
              type='text'
              {...register("name")}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
              placeholder='نام حساب را وارد کنید'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              ارز
            </label>
            <select
              {...register("currency")}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
            >
              <option value='AFN'>افغانی (AFN)</option>
              <option value='USD'>دالر (USD)</option>
              <option value='EUR'>یورو (EUR)</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              موجودی اولیه *
            </label>
            <input
              type='number'
              step='0.01'
              {...register("openingBalance")}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
              placeholder='0.00'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              موجودی فعلی *
            </label>
            <input
              type='number'
              step='0.01'
              {...register("currentBalance")}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
              placeholder='0.00'
              required
            />
          </div>
        </div>
      </div>
      <div className='p-6 border-t border-gray-200 flex justify-end gap-4'>
        <button
          type='button'
          onClick={onClose}
          className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
        >
          لغو
        </button>
        <button
          type='submit'
          className='px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700'
          disabled={loading}
        >
          {loading ? "در حال بارگذاری..." : "اضافه کردن حساب"}
        </button>
      </div>
    </form>
  );
}

export default AccountForm;

