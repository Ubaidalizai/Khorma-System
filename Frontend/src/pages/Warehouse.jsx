import { BiLoaderAlt } from "react-icons/bi";
import React from "react";
import SearchInput from "../components/SearchInput";
import Select from "../components/Select";
import TableHeader from "../components/TableHeader";
import TableBody from "../components/TableBody";
import TableColumn from "../components/TableColumn";
import TableMenuModal from "../components/TableMenuModal";
import Menus from "../components/Menu";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import Confirmation from "../components/Confirmation";
import TableRow from "../components/TableRow";
import Table from "../components/Table";
const tableHeader = [
  { title: "جنس" },
  { title: "نمبر ردیابی" },
  { title: "واحد" },
  { title: "گدام" },
  { title: "فروشگاه" },
  { title: "تاریخ انقضا" },
  { title: "تعداد" },
  { title: "حالت" },
  { title: "عملیات" },
];
function Warehouse({
  warehouses,
  getStatusColor,
  deleteProdcut,
  updateProduct,
  setselectedProduct,
  setShowEditModal,
  isLoading,
}) {
  if (isLoading)
    return (
      <div className=" w-full h-full flex justify-center items-center">
        <BiLoaderAlt className=" text-2xl animate-spin" />
      </div>
    );
  return (
    <Table
      firstRow={
        <div className="w-full flex ">
          <div className=" flex-1  flex justify-start items-end">
            <SearchInput placeholder="جستجو کنید" />
          </div>
          <div className=" flex justify-end flex-2">
            <div className=" w-[50%]">
              <Select
                defaultSelected="فلتر کنید"
                id=""
                options={[
                  { value: "همه" },
                  { value: "گدام" },
                  { value: "جنس" },
                  { value: "حالت" },
                ]}
              ></Select>
            </div>
          </div>
        </div>
      }
    >
      <TableHeader headerData={tableHeader} />
      <TableBody>
        {warehouses?.map((filter) => (
          <TableRow key={filter.id}>
            <TableColumn>{filter.name}</TableColumn>
            <TableColumn>{filter.sku}</TableColumn>
            <TableColumn>{filter.category}</TableColumn>
            <TableColumn className="text-purple-600">
              {filter.warehouseStock}
            </TableColumn>
            <TableColumn className="text-green-600">
              {filter.storeStock}
            </TableColumn>
            <TableColumn>
              {filter.warehouseStock + filter.storeStock}
            </TableColumn>
            <TableColumn>{filter.unitPrice}</TableColumn>
            <TableColumn>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  filter.status
                )}`}
              >
                {filter.status}
              </span>
            </TableColumn>
            <TableColumn
              className={`${
                "itemavs" +
                new Date(filter.expiryDate).getMilliseconds() +
                filter?.id
              } relative`}
            >
              <span>
                <TableMenuModal>
                  <Menus>
                    <Menus.Menu>
                      <Menus.Toggle id={filter?.id} />
                      <Menus.List
                        parent={
                          "itemavs" +
                          new Date(filter.expiryDate).getMilliseconds() +
                          filter?.id
                        }
                        id={filter?.id}
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

                    <TableMenuModal.Window name="deplicate">
                      <Confirmation
                        type="view"
                        // handleClick={() => {
                        //   setSelectedProduct(filter);
                        //   setShowDetailsModal(true);
                        // }}
                        handleCancel={() => {}}
                      />
                    </TableMenuModal.Window>
                    <TableMenuModal.Window name="delete" className={""}>
                      <Confirmation
                        type="delete"
                        handleClick={() => deleteProdcut(filter.id)}
                        handleCancel={() => {}}
                      />
                    </TableMenuModal.Window>
                    <TableMenuModal.Window name="edit" className={``}>
                      <Confirmation
                        type="edit"
                        handleClick={() => {
                          setselectedProduct(filter);
                          setShowEditModal(true);
                          updateProduct();
                        }}
                        handleCancel={() => {}}
                      />
                    </TableMenuModal.Window>
                  </Menus>
                </TableMenuModal>
              </span>
            </TableColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default Warehouse;
