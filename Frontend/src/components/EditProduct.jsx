import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useProdcutItem, useUpdateProdcut } from "../services/useApi";
import Spinner from "./Spinner";
import Input from "./Input";
import Select from "./Select";
import NumberInput from "./NumberInput";
import TextArea from "./TextArea";
import Button from "./Button";

function EditProduct({ productId, onClose }) {
  const { data, isLoading, isError } = useProdcutItem(productId);
  const { mutate: updateProduct } = useUpdateProdcut();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      itemName: "",
      unit: "",
      minLevel: "",
      tracker: "",
      description: "",
    },
  });

  // Reset form when API data is loaded
  useEffect(() => {
    if (data) {
      reset({
        itemName: data.itemName ?? "",
        unit: data.unit ?? "",
        minLevel: data.minQuantity ?? "",
        tracker: data.tracker ?? "",
        description: data.description ?? "",
      });
    }
  }, [data, reset]);

  const onSubmit = (formData) => {
    updateProduct(
      { id: productId, ...formData },
      {
        onSuccess: () => {
          toast.success("محصول با موفقیت ویرایش شد ✅");
          if (typeof onClose === "function") onClose();
        },
        onError: () => {
          toast.error("خطا در ویرایش محصول ❌");
        },
      }
    );
  };

  if (isLoading) return <Spinner />;
  if (isError) return <p>خطا در دریافت اطلاعات محصول</p>;

  return (
    <motion.form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      initial={{ scale: 0, rotate: "12.5deg" }}
      animate={{ scale: 1, rotate: "0deg" }}
      exit={{ scale: 0, rotate: "0deg" }}
      className="w-[560px] grid grid-cols-4 grid-rows-5 gap-4 h-[500px] bg-white p-4 rounded-sm"
    >
      {/* Item Name */}
      <div className="col-span-2">
        <Controller
          name="itemName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="نام جنس"
              id="ProdcutName"
              placeholder="Add Product"
            />
          )}
        />
      </div>

      {/* Unit Select */}
      <div className="col-span-2 col-start-3">
        <Controller
          name="unit"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="واحد مدنظر"
              id="unit"
              options={[
                { value: "Khorma", label: "Khorma" },
                { value: "saib", label: "Saib" },
                { value: "angor", label: "Angor" },
              ]}
            />
          )}
        />
      </div>

      {/* Minimum Level */}
      <div className="col-span-2 row-start-2">
        <Controller
          name="minLevel"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              id="minLevel"
              label="اندازه"
              placeholder="minQuantity"
            />
          )}
        />
      </div>

      {/* Tracker */}
      <div className="col-span-2 col-start-3 row-start-2">
        <Controller
          name="tracker"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="نمبر ردیابی"
              id="tracker"
              placeholder="Select TrackByBatch"
            />
          )}
        />
      </div>

      {/* Description */}
      <div className="col-span-4 row-span-2 row-start-3">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextArea {...field} label="توضیحات" row={3} />
          )}
        />
      </div>

      {/* Cancel Button */}
      <div className="col-span-2 flex justify-center items-center col-start-1 col-end-3 row-start-5">
        <Button
          type="button"
          className="bg-warning-orange hover:bg-warning-orange/90 text-white"
          onClick={() => typeof onClose === "function" && onClose()}
        >
          لغو کردن
        </Button>
      </div>

      {/* Submit Button */}
      <div className="col-span-2 flex justify-center items-center col-start-3 row-start-5">
        <Button
          type="submit"
          className="bg-success-green hover:bg-success-green/90"
        >
          اضافه کردن در سیستم
        </Button>
      </div>
    </motion.form>
  );
}

export default EditProduct;
