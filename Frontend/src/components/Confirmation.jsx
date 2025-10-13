import { GiCancel } from "react-icons/gi";
import { BsPencilSquare } from "react-icons/bs";
import { BiTrashAlt } from "react-icons/bi";
import { BsInfoCircle } from "react-icons/bs";
import { BsFillTrashFill } from "react-icons/bs";
import React from "react";
import Button from "./Button";

function Confirmation({ type, handleClick, handleCancel }) {
  return (
    <div class="flex flex-col bg-white w-82 h-52 rounded-md py-4 px-6 border border-slate-100">
      <div className=" flex-3 relative ">
        {type === "delete" ? (
          <BsFillTrashFill
            size={70}
            className=" text-red-300 absolute left-2/4 -translate-x-2/4"
          />
        ) : (
          <BsInfoCircle
            size={70}
            className=" text-slate-200 absolute left-2/4 -translate-x-2/4"
          />
        )}
      </div>
      <div class=" flex-1 flex justify-around items-center py-3">
        <Button
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
        <Button icon={<GiCancel />}>نه کنسل کنید</Button>
      </div>
    </div>
  );
}

export default Confirmation;
