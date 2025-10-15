import { GiCancel } from "react-icons/gi";
import { BsPencilSquare } from "react-icons/bs";
import { BiTrashAlt } from "react-icons/bi";
import { BsInfoCircle } from "react-icons/bs";
import { BsFillTrashFill } from "react-icons/bs";
import React from "react";
import Button from "./Button";

function Confirmation({ type, handleClick, handleCancel, close, message }) {
  const onConfirm = () => {
    if (typeof handleClick === "function") handleClick();
    if (typeof close === "function") close();
  };

  const onCancel = () => {
    if (typeof handleCancel === "function") handleCancel();
    if (typeof close === "function") close();
  };

  return (
    <div class="flex flex-col bg-white w-100 h-82 rounded-md py-4 px-6 border border-slate-100">
      <div className=" flex-3 relative ">
        {type === "delete" ? (
          <BsFillTrashFill
            size={40}
            className="  text-red-300 absolute left-2/4 -translate-x-2/4"
          />
        ) : (
          <BsInfoCircle
            size={40}
            className=" text-slate-200 absolute left-2/4 -translate-x-2/4"
          />
        )}
        {message ? (
          <p className="text-2xl text-center absolute top-2/4 ">{message}</p>
        ) : (
          <p className=" text-xl text-center absolute top-2/4 ">
            آیا شما مطمین هستید که این فایل را
            {type === "delete" ? "حذف" : "ویرایش"} را کنید؟
          </p>
        )}
      </div>
      <div class=" flex-1 flex justify-around items-center gap-3 py-3">
        <Button
          onClick={onConfirm}
          className={`${
            type === "delete"
              ? " bg-warning-orange hover:bg-warning-orange/90"
              : " bg-success-green hover:bg-success-green/90"
          }`}
          icon={
            type === "delete" ? (
              <BiTrashAlt className="text-red-400" />
            ) : (
              <BsPencilSquare className=" text-green-400" />
            )
          }
        >
          {type === "delete" ? "بلی، حذف کنید" : "بلی ویرایش کنید"}
        </Button>
        <Button
          onClick={onCancel}
          className={` bg-red-500`}
          icon={<GiCancel className=" text-green-500" />}
        >
          نه کنسل کنید
        </Button>
      </div>
    </div>
  );
}

export default Confirmation;
