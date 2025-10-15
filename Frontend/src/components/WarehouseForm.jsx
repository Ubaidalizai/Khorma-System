import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Controller } from "react-hook-form";
import Input from "./Input";
import Select from "./Select";
import NumberInput from "./NumberInput";
import TextArea from "./TextArea";
import Button from "./Button";

function WarehouseForm({ control, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <Controller
              defaultValue={""}
              name="name"
              control={control}
              render={({ field }) => (
                <Input label="warehouse name" register={field} />
              )}
            />
          </div>

          <div>
            <Controller
              defaultValue={""}
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  label="Category"
                  register={field}
                  defaultSelected={field.value}
                  options={[
                    { value: "Dates" },
                    { value: "Grains" },
                    { value: "Bakery" },
                    { value: "Baking" },
                  ]}
                />
              )}
            />
          </div>

          <div>
            <Controller
              defaultValue={""}
              name="sku"
              control={control}
              render={({ field }) => <Input label="SKU" register={field} />}
            />
          </div>

          <div>
            <Controller
              defaultValue={""}
              name="unitPrice"
              control={control}
              render={({ field }) => (
                <Input type="number" label="Unit Price ($)" register={field} />
              )}
            />
          </div>

          <div>
            <Controller
              defaultValue={0}
              name="warehouseStock"
              control={control}
              render={({ field }) => (
                <NumberInput label="Warehouse Stock" register={field} />
              )}
            />
          </div>

          <div>
            <Controller
              defaultValue={0}
              name="storeStock"
              control={control}
              render={({ field }) => (
                <NumberInput label="Store Stock" register={field} />
              )}
            />
          </div>

          <div>
            <Controller
              defaultValue={0}
              name="minStockLevel"
              control={control}
              render={({ field }) => (
                <NumberInput label="Minimum Stock Level" register={field} />
              )}
            />
          </div>

          <div>
            <Controller
              defaultValue={""}
              name="expiryDate"
              control={control}
              render={({ field }) => (
                <Input type="date" label="Expiry Date" register={field} />
              )}
            />
          </div>

          <div className="md:col-span-2">
            <Controller
              defaultValue={""}
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea label="Description" rows={3} register={field} />
              )}
            />
          </div>
        </div>
      </div>

      <div className="p-6 border-t w-[80%] mx-auto border-gray-200 flex justify-end gap-4">
        {/* <Button className=" bg-deepdate-400">لغو کردن</Button> */}
        <Button className={" bg-success-green"}>تغییر دادن گدام</Button>
      </div>
    </form>
  );
}

export default WarehouseForm;
