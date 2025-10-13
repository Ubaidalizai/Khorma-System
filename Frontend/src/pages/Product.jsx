import { IoMdAdd } from "react-icons/io";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import Table from "../components/Table";
import TableHeader from "../components/TableHeader";
import TableBody from "../components/TableBody";
import TableRow from "../components/TableRow";
import TableColumn from "../components/TableColumn";
import Menus from "../components/Menu";
import TableMenuModal from "../components/TableMenuModal";
import SearchInput from "../components/SearchInput";
import Modal from "../components/Modal";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import NumberInput from "../components/NumberInput";
import TextArea from "../components/TextArea";
import { motion } from "framer-motion";
import Confirmation from "../components/Confirmation";
import { useState } from "react";
const headers = [
  { title: "نمبر مسلسل" },
  { title: "تاریخ" },
  { title: "اسم جنس" },
  { title: "واحد موردنظر" },
  { title: "کمترین اندازه" },
  { title: "توضیحات" },
  { title: "عملیات" },
];

function Product({ properties }) {
  return (
    <section className="w-full">
      <Table
        firstRow={
          <div className=" w-full flex  justify-between ">
            <div className=" w-[300px]">
              <SearchInput />
            </div>
          </div>
        }
      >
        <TableHeader headerData={headers} />
        <TableBody>
          {properties.map((el) => (
            <TableRow>
              <TableColumn>{el?.id}</TableColumn>
              <TableColumn>{el?.date}</TableColumn>
              <TableColumn>{el?.itemName}</TableColumn>
              <TableColumn>{el?.unit}</TableColumn>
              <TableColumn>{el?.minQuantity}</TableColumn>
              <TableColumn>{el?.description}</TableColumn>
              <div
                className={`${
                  "itemavs" + el?.id + new Date(el?.date).getMilliseconds()
                } table-cell   w-auto relative  align-middle md:*:text-lg text-[12px] md:font-medium font-light  capitalize`}
              >
                <div
                  className={`  w-full h-full flex justify-center items-center`}
                >
                  <TableMenuModal>
                    <Menus>
                      <Menus.Menu>
                        <Menus.Toggle id={el?.id} />
                        <Menus.List
                          parent={
                            "itemavs" +
                            el?.id +
                            new Date(el?.date).getMilliseconds()
                          }
                          id={el?.id}
                          className="bg-white rounded-lg shadow-xl"
                        >
                          <TableMenuModal.Open opens="deplicate">
                            <Menus.Button icon={<HiSquare2Stack />}>
                              نمایش
                            </Menus.Button>
                          </TableMenuModal.Open>

                          <TableMenuModal.Open opens="edit">
                            <Menus.Button icon={<HiPencil />}>
                              ویرایش
                            </Menus.Button>
                          </TableMenuModal.Open>

                          <TableMenuModal.Open opens="delete">
                            <Menus.Button icon={<HiTrash />}>حذف</Menus.Button>
                          </TableMenuModal.Open>
                        </Menus.List>
                      </Menus.Menu>

                      <TableMenuModal.Window name="delete" className={""}>
                        <Confirmation type="delete" />
                      </TableMenuModal.Window>
                      <TableMenuModal.Window name="edit" className={``}>
                        <Confirmation type="edit" />
                      </TableMenuModal.Window>
                    </Menus>
                  </TableMenuModal>
                </div>
              </div>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

export default Product;
