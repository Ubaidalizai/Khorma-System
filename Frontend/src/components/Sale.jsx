import React from "react";

function Sale() {
  return (
    <Table
      firstRow={
        <div className=" w-full flex gap-1 justify-around  ">
          <div className="flex-1 flex items-center justify-start">
            <SearchInput placeholder="لطفا جستجو کنید" />
          </div>
          <div className="flex-1">
            <Select
              placeholder=" بر اساس پرداخت"
              options={[
                { value: "تمام پرداخت ها" },
                { value: " پرداخت نسبی" },
                { value: "پرداخت های معلق" },
              ]}
            />
          </div>
          <div className="flex-1">
            <Select
              placeholder=" تمام حالات"
              options={[
                { value: "تمام فاکتورها" },
                { value: "فاکتورهای با حجم بالا" },
                { value: "فاکتورها با حجم پایین" },
              ]}
            />
          </div>
          <div className="flex-1 flex items-center">
            <Select
              placeholder=" تمام حالات"
              options={[{ value: "تما مشتری ها" }]}
            />
          </div>
        </div>
      }
    >
      <TableHeader headerData={salesHeader} />
      <TableBody>
        {filteredSales.map((sale) => (
          <TableRow key={sale.id}>
            <TableColumn>{sale.billNumber}</TableColumn>
            <TableColumn>
              {new Date(sale.saleDate).toLocaleDateString()}
            </TableColumn>
            <TableColumn>{sale.customer}</TableColumn>
            <TableColumn>{sale.employee}</TableColumn>
            <TableColumn>{sale.items.length} items</TableColumn>
            <TableColumn>
              {formatCurrency(sale.totalAmount.toFixed(2))}
            </TableColumn>
            <TableColumn className=" text-success-green">
              {formatCurrency(sale.amountPaid.toFixed(2))}
            </TableColumn>
            <TableColumn className=" text-red-500">
              {formatCurrency(sale.amountOwed.toFixed(2))}
            </TableColumn>
            <TableColumn>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBillTypeColor(
                  sale.billType
                )}`}
              >
                {sale.billType}
              </span>
            </TableColumn>
            <TableColumn>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                  sale.paymentStatus
                )}`}
              >
                {sale.paymentStatus}
              </span>
            </TableColumn>
            <TableColumn
              className={` relative ${
                "salesItem" +
                sale?.id +
                new Date(sale?.saleDate).getMilliseconds()
              }`}
            >
              <TableMenuModal>
                <Menus>
                  <Menus.Menu>
                    <Menus.Toggle id={sale?.id} />
                    <Menus.List
                      parent={
                        "salesItem" +
                        sale?.id +
                        new Date(sale?.saleDate).getMilliseconds()
                      }
                      id={sale?.id}
                      className="bg-white rounded-lg shadow-xl"
                    >
                      <TableMenuModal.Open opens="deplicate">
                        <Menus.Button icon={<HiSquare2Stack />}>
                          نمایش
                        </Menus.Button>
                      </TableMenuModal.Open>

                      <TableMenuModal.Open opens="edit">
                        <Menus.Button icon={<HiPencil />}>ویرایش</Menus.Button>
                      </TableMenuModal.Open>

                      <TableMenuModal.Open opens="delete">
                        <Menus.Button icon={<HiTrash />}>حذف</Menus.Button>
                      </TableMenuModal.Open>
                      <TableMenuModal.Open opens="print">
                        <Menus.Button icon={<AiTwotonePrinter />}>
                          چاپ
                        </Menus.Button>
                      </TableMenuModal.Open>
                    </Menus.List>
                  </Menus.Menu>

                  <TableMenuModal.Window name="delete" className={""}>
                    <Confirmation type="delete" />
                  </TableMenuModal.Window>
                  <TableMenuModal.Window
                    name="print"
                    className={""}
                  ></TableMenuModal.Window>
                  <TableMenuModal.Window name="edit" className={``}>
                    <Confirmation type="edit" />
                  </TableMenuModal.Window>
                </Menus>
              </TableMenuModal>
            </TableColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default Sale;
