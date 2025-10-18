// ...existing code...
import React from "react";
import Input from "./Input";
import Select from "./Select";
import NumberInput from "./NumberInput";
import { motion } from "framer-motion";
import TextArea from "./TextArea";
import Button from "./Button";
import { Controller } from "react-hook-form";
import { BiMessageAlt } from "react-icons/bi";

/**
 * Props:
 * - register, handleSubmit, formState, control  (from react-hook-form)
 * - units: [{ value: id, title: label }] optional for baseUnit select
 * - onClose: optional close callback
 */
export const inputStyle =
  "w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-3 py-[14px] transition duration-300 ease focus:outline-none focus:border-slate-300 hover:border-slate-300 shadow-sm";
function ProductForm({
  register,
  handleSubmit,
  formState,
  control,
  units = [],
  onClose,
}) {
  const { errors } = formState || {};

  // Shared input-like class for consistent width/height

  return (
    <motion.form
      noValidate
      onSubmit={handleSubmit}
      initial={{ scale: 0, rotate: "12.5deg" }}
      animate={{ scale: 1, rotate: "0deg" }}
      exit={{ scale: 0, rotate: "0deg" }}
      className="w-[560px] grid grid-cols-4 grid-rows-[1fr_1fr_1fr_1fr_0.5fr_1fr] gap-4 h-[500px] bg-white p-7 rounded-sm"
    >
      {/* name */}
      <div className="col-span-2">
        <label
          htmlFor="name"
          className="mb-[5px] block text-base font-medium text-slate-600 dark:text-white"
        >
          نام محصول
        </label>
        <div className="relative">
          <input
            id="name"
            {...register("name", { required: "Name is required" })}
            type="text"
            className={inputStyle}
          />
        </div>
        {errors?.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* baseUnit */}
      <div className="col-span-2 col-start-3 relative">
        <label
          htmlFor="baseUnit"
          className="mb-[5px] block text-base font-medium text-slate-600 dark:text-white"
        >
          Base Unit
        </label>
        <div>
          <Controller
            control={control}
            name="baseUnit"
            render={({ field }) => (
              <select {...field} id="baseUnit" className={inputStyle}>
                <option value="">Select unit</option>
                {units.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.title}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
        {errors?.baseUnit && (
          <p className="text-red-600 text-sm mt-1">{errors.baseUnit.message}</p>
        )}
      </div>

      {/* minLevel */}
      <div className="col-span-2 row-start-2">
        <label
          htmlFor="minLevel"
          className="mb-[5px] block text-base font-medium text-text-600 dark:text-white"
        >
          کمترین اندازه
        </label>
        <input
          {...register("minLevel", { valueAsNumber: true })}
          type="number"
          id="minLevel"
          className={inputStyle}
        />
        {errors?.minLevel && (
          <p className="text-red-600 text-sm mt-1">{errors.minLevel.message}</p>
        )}
      </div>

      {/* latestPurchasePrice */}
      <div className="col-span-2 col-start-3 row-start-2">
        <label
          htmlFor="latestPurchasePrice"
          className="mb-[5px] block text-base font-medium text-slate-600 dark:text-white"
        >
          Latest Purchase Price
        </label>
        <input
          {...register("latestPurchasePrice", { valueAsNumber: true })}
          id="latestPurchasePrice"
          type="number"
          step="0.01"
          className={inputStyle}
        />
        {errors?.latestPurchasePrice && (
          <p className="text-red-600 text-sm mt-1">
            {errors.latestPurchasePrice.message}
          </p>
        )}
      </div>

      {/* description */}
      <div className="col-span-4 row-span-2 row-start-3">
        <label
          htmlFor="description"
          className="mb-[5px] block text-base font-medium text-slate-700 dark:text-white"
        >
          description
        </label>
        <div className="relative">
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Type description"
            className={`${inputStyle} pl-12 resize-none`}
          />
          <span className="absolute top-[18px] left-4">
            <BiMessageAlt size={20} />
          </span>
        </div>
      </div>

      {/* trackByBatch */}
      <div className="col-span-2 flex items-center space-x-2 col-start-1 col-end-3 row-start-5">
        <input
          id="trackByBatch"
          type="checkbox"
          {...register("trackByBatch")}
          className="h-4 w-4 text-blue-600 rounded border-gray-300"
        />
        <label htmlFor="trackByBatch" className="text-sm">
          Track by batch
        </label>
      </div>

      {/* isDeleted / actions */}
      <div className="col-span-4 flex justify-center items-center  col-start-1 col-end-5 row-start-6 space-x-3">
        <div className="ml-4 w-[80%]  flex space-x-2">
          <Button
            type="button"
            className="bg-warning-orange hover:bg-warning-orange/90 text-white"
            onClick={onClose}
          >
            لغو کردن
          </Button>
          <Button
            type="submit"
            className="bg-success-green hover:bg-success-green/90"
          >
            ذخیره
          </Button>
        </div>
      </div>
    </motion.form>
  );
}

export default ProductForm;
// ...existing code...
