import React from "react";
import { useForm } from "react-hook-form";

function CustomerForm() {
  const { register, handleSubmit } = useForm();
  return (
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] mx-auto p-6 overflow-y-auto">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Customer</h2>
      </div>

      <form
        onSubmit={handleSubmit((data) => console.log(data))}
        className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Contact info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="text"
            {...register("contact_info.phone")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            {...register("contact_info.email")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            {...register("contact_info.address")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </form>

      <div className="p-6 border-t flex justify-end gap-4">
        <button
          type="button"
          className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default CustomerForm;
