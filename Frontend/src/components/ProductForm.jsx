import { Controller } from "react-hook-form";
import { useUnits } from "../services/useApi";
import Button from "./Button";
import Spinner from "./Spinner";

/**
 * ProductForm Component
 * Props:
 * - register, handleSubmit, formState, control (from react-hook-form)
 * - onClose: optional close callback
 */
export const inputStyle =
  "w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-3 transition duration-300 ease focus:outline-none focus:border-blue-500 hover:border-slate-300 shadow-sm";

function ProductForm({ register, handleSubmit, formState, control, onClose }) {
  const { errors } = formState || {};
  const { data: units, isLoading: isUnitLoading } = useUnits();
  
  if (isUnitLoading) return <Spinner />;

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div className="md:col-span-1">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            نام محصول
          </label>
          <input
            id="name"
            {...register("name", { required: "Name is required" })}
            type="text"
            className={inputStyle}
            placeholder="نام محصول را وارد کنید"
          />
          {errors?.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Base Unit */}
        <div className="md:col-span-1">
          <label
            htmlFor="baseUnit"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            واحد پایه
          </label>
          <Controller
            control={control}
            name="baseUnit"
            render={({ field }) => (
              <select {...field} id="baseUnit" className={inputStyle}>
                <option value="">انتخاب واحد</option>
                {units?.data?.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors?.baseUnit && (
            <p className="text-red-600 text-sm mt-1">{errors.baseUnit.message}</p>
          )}
        </div>

        {/* Minimum Level */}
        <div className="md:col-span-1">
          <label
            htmlFor="minLevel"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            کمترین اندازه
          </label>
          <input
            {...register("minLevel", { valueAsNumber: true })}
            type="number"
            id="minLevel"
            className={inputStyle}
            placeholder="0"
            min="0"
          />
          {errors?.minLevel && (
            <p className="text-red-600 text-sm mt-1">{errors.minLevel.message}</p>
          )}
        </div>

        {/* Track by Batch */}
        <div className="md:col-span-1 flex items-center">
          <div className="flex items-center space-x-2">
            <input
              id="trackByBatch"
              type="checkbox"
              {...register("trackByBatch")}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="trackByBatch" className="text-sm text-slate-700">
              ردیابی بر اساس بچ
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-200">
        <Button
          type="button"
          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition duration-200"
          onClick={onClose}
        >
          لغو کردن
        </Button>
        <Button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
        >
          ذخیره
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
