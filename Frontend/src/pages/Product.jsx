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
// removed unused motion import
import Confirmation from "../components/Confirmation";
import { useState } from "react";
import { createPortal } from "react-dom";
import GloableModal from "../components/GloableModal";
import EditProduct from "../components/EditProduct";
const headers = [
  { title: "نمبر مسلسل" },
  { title: "تاریخ" },
  { title: "اسم جنس" },
  { title: "واحد موردنظر" },
  { title: "کمترین اندازه" },
  { title: "توضیحات" },
  { title: "عملیات" },
];

function Product({ properties: productList }) {
  const [items, setItems] = useState(productList || []);
  const [isEditable, setIsEditable] = useState(false);
  const [selectedPro, setSelectedPro] = useState(null);
  const handleDelete = (item) => {
    // perform delete
    setItems((curr) => curr.filter((i) => i.id !== item.id));
  };

  return (
    <section className="w-full">
      <Table
        firstRow={
          <div className=" w-full flex  justify-between ">
            <div className=" w-[300px]">
              <SearchInput placeholder="جستجو کنید" />
            </div>
            <div className=" w-[300px]">
              <Select
                id="sort"
                name="sort"
                options={[
                  { value: "نام جنس" },
                  { value: "واحد جنس" },
                  { value: "همه" },
                  { value: "واحد" },
                ]}
              />
            </div>
          </div>
        }
      >
        <TableHeader headerData={headers} />
        <TableBody>
          {items?.map((el) => (
            <TableRow key={el.id}>
              <TableColumn>{el?.id}</TableColumn>
              <TableColumn>{el?.date}</TableColumn>
              <TableColumn>{el?.itemName}</TableColumn>
              <TableColumn>{el?.unit}</TableColumn>
              <TableColumn>{el?.minQuantity}</TableColumn>
              <TableColumn>{el?.description}</TableColumn>
              <TableColumn>
                <span
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
                              <Menus.Button icon={<HiTrash />}>
                                حذف
                              </Menus.Button>
                            </TableMenuModal.Open>
                          </Menus.List>
                        </Menus.Menu>

                        <TableMenuModal.Window name="delete" className={""}>
                          <Confirmation
                            type="delete"
                            handleClick={() => handleDelete(el)}
                            handleCancel={() => {}}
                          />
                        </TableMenuModal.Window>
                        <TableMenuModal.Window name="edit" className={``}>
                          <Confirmation
                            type="edit"
                            handleClick={() => {
                              /* implement edit confirmation behavior */
                              // For demonstration we simply update the description
                              setSelectedPro(el);
                              setIsEditable(true);
                            }}
                            handleCancel={() => {}}
                          />
                        </TableMenuModal.Window>
                      </Menus>
                    </TableMenuModal>
                  </div>
                </span>
              </TableColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <GloableModal open={isEditable} setOpen={setIsEditable}>
        <EditProduct productId={selectedPro?.id} />
      </GloableModal>
    </section>
  );
}

export default Product;
