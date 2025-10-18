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
import ProductForm from "./ProductForm";

function EditProduct({ productId, onClose }) {
  const { data, isLoading, isError } = useProdcutItem(productId);
  const { mutate: updateProduct } = useUpdateProdcut();
  const { handleSubmit, reset, register, control, formState } = useForm({
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
        name: data.name ?? "",
        baseUnit: data.baseUnit ?? "",
        minLevel: data.minLevel ?? 0,
        latestPurchasePrice: data.latestPurchasePrice ?? "",
        description: data.description ?? "",
        trackByBatch: data.trackByBatch ?? false,
      });
    }
  }, [data, reset]);

  const onSubmit = (formData) => {
    console.log(formData);
    updateProduct({ id: productId, updatedItem: formData });
    reset();
  };

  if (isLoading) return <Spinner />;
  if (isError) return;

  return (
    <ProductForm
      register={register}
      control={control}
      formState={formState}
      handleSubmit={handleSubmit(onSubmit)}
    />
  );
}

export default EditProduct;
