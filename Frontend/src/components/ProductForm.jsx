import React from "react";
import Input from "./Input";
import Select from "./Select";
import NumberInput from "./NumberInput";
import { motion } from "framer-motion";
import TextArea from "./TextArea";
import Button from "./Button";

function ProductForm({ register, handleSubmit, formState }) {
  return (
    <motion.form
      noValidate
      onSubmit={handleSubmit}
      initial={{ scale: 0, rotate: "12.5deg" }}
      animate={{ scale: 1, rotate: "0deg" }}
      exit={{ scale: 0, rotate: "0deg" }}
      className="w-[560px] grid grid-cols-4 grid-rows-5 gap-4 h-[500px] bg-white p-4 rounded-sm"
    >
      <div className="col-span-2">
        <Input
          register={register("itemName")}
          label="نام جنس"
          id="ProdcutName"
          placeholder="Add Prodcut"
          required={true}
        />
      </div>
      <div className="col-span-2 col-start-3">
        <Select
          register={register("unit")}
          label="واحد مدنظر"
          id="ProdcutName"
          placeholder="Add Prodcut"
          options={[{ value: "Khorma" }, { value: "saib" }, { value: "angor" }]}
        />
      </div>
      <div className="col-span-2 row-start-2">
        <NumberInput
          id="minLevel"
          placeholder="minQuantity"
          register={register("minLevel")}
          label="اندازه"
        />
      </div>
      <div className="col-span-2 col-start-3 row-start-2">
        <Select
          register={register("tracker")}
          label="نمبر ردیابی"
          id="ProdcutName"
          placeholder="Select TrackByBatch"
          options={[{ value: "True" }, { value: "False" }]}
        />
      </div>
      <div className="col-span-4 row-span-2 row-start-3">
        <TextArea label="توضیحات" register={register("description")} row={3} />
      </div>
      <div className="col-span-2 flex justify-center items-center col-start-1 col-end-3 row-start-5">
        <Button
          type="button"
          className="  bg-warning-orange hover:bg-warning-orange/90 text-white"
          onClick={() => typeof close === "function" && close()}
        >
          لغو کردن
        </Button>
      </div>
      <div className="col-span-2 flex justify-center items-center col-start-3 row-start-5">
        <Button
          type="submit"
          className=" bg-success-green hover:bg-success-green/90 "
        >
          اضافه کردن در سیستم
        </Button>
      </div>
    </motion.form>
  );
}

export default ProductForm;
