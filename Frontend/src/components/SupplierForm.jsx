import React, { useState } from "react";
import { inputStyle } from "./ProductForm";

function SupplierForm({ handleSubmit, register, onSubmit }) {
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
  });
  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh]  overflow-y-auto"
    >
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          اضافه کردن تهیه کننده جدید
        </h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name *
            </label>
            <input
              type="text"
              {...register("name")}
              className={inputStyle}
              placeholder="Ahmed Hassan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={contactInfo?.email}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, email: e.target.value })
              }
              className={inputStyle}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              value={contactInfo?.phone}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, phone: e.target.value })
              }
              className={inputStyle}
              placeholder="+93 700 123 456"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={contactInfo?.address}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, address: e.target.value })
              }
              className={inputStyle}
              placeholder="City, Country"
            />
          </div>
        </div>
      </div>
      <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
        <button
          onClick={() => {}}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          لغو کردن
        </button>
        <button
          onClick={() => {}}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          اضافه کردن تهیه کننده
        </button>
      </div>
    </form>
  );
}

export default SupplierForm;
