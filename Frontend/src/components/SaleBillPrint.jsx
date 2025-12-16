import { useCallback, useEffect, useRef, useState } from "react";
// import { useReactToPrint } from "react-to-print";
import { PrinterIcon, XMarkIcon } from "@heroicons/react/24/outline";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DateObject from "react-date-object";
import persianCalendar from "react-date-object/calendars/persian";
import persianLocale from "react-date-object/locales/persian_fa";
import { CiLocationOn } from "react-icons/ci";
import { SlCallIn } from "react-icons/sl";
import { formatNumberWithPersianDigits } from "../utilies/helper";

const SaleBillPrint = ({ sale, customer, onClose, autoPrint = false }) => {
  const printRef = useRef(null);
  const [isContentReady, setIsContentReady] = useState(false);

  const tableHeaders = [
    { title: "شماره" },
    { title: "نام محصل" },
    { title: "تفصیل" },
    { title: "وزن" },
    { title: "کارتن" },
    { title: "قیمت" },
    { title: "مجموع کل" },
  ];

  const formatPersianDate = (dateString) => {
    try {
      return new DateObject({
        date: new Date(dateString),
        calendar: persianCalendar,
        locale: persianLocale,
      }).format("YYYY/MM/DD");
    } catch {
      return new Date(dateString).toLocaleDateString("fa-IR");
    }
  };

  const formatPersianDateTime = (dateString) => {
    try {
      const date = new DateObject({
        date: new Date(dateString),
        calendar: persianCalendar,
        locale: persianLocale,
      });

      return {
        dayName: date.format("dddd"),
        dateStr: date.format("YYYY/MM/DD"),
        time: new Date(dateString).toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch {
      return {
        dayName: "",
        dateStr: dateString,
        time: "",
      };
    }
  };

  // Weight & carton
  const calculateWeightAndCarton = (item) => {
    const qty = item.quantity || 0;
    const conversion = item.unit?.conversion_to_base || 1;
    const totalWeight = qty * conversion;

    const unitName = item.unit?.name?.toLowerCase() || "";
    const isCarton = unitName.includes("کارتن") || unitName.includes("carton");

    return {
      weight: totalWeight,
      carton: isCarton ? qty : 0,
    };
  };

  const services = sale?.items || [];

  const totalWeight = services.reduce(
    (sum, item) => sum + calculateWeightAndCarton(item).weight,
    0
  );

  const totalCarton = services.reduce(
    (sum, item) => sum + calculateWeightAndCarton(item).carton,
    0
  );

  const printDateTime = formatPersianDateTime(new Date());
  const handlePrint = useCallback(async () => {
    if (!printRef.current) return;

    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      ignoreElements: (el) => el.classList?.contains("no-print"),
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.autoPrint();
    window.open(pdf.output("bloburl"), "_blank");
  }, []);

  useEffect(() => {
    if (autoPrint && sale) {
      const t = setTimeout(handlePrint, 400);
      return () => clearTimeout(t);
    }
  }, [autoPrint, sale, handlePrint]);

  // Mark content as ready when ref is available
  useEffect(() => {
    if (printRef.current) {
      setIsContentReady(true);
    }
  }, []);

  // If no sale data, show loading
  if (!sale) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 "></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری فاکتور...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-md p-4 max-h-[90vh] overflow-y-auto">
      {/* HEADER - Add no-print class */}
      <div className="flex justify-between  pb-2 mb-4 no-print">
        <h2 className="font-bold text-lg">چاپ فاکتور</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="border px-3 py-1 flex items-center gap-2 hover:bg-gray-50"
            disabled={!isContentReady}
          >
            <PrinterIcon className="h-5 w-5" />
            پرینت
          </button>
          <button
            onClick={onClose}
            className="border px-3 py-1 flex items-center gap-2 hover:bg-gray-50"
          >
            <XMarkIcon className="h-5 w-5" />
            بستن
          </button>
        </div>
      </div>

      {/* ✅ FIXED: Printable content with proper ref */}
      <div
        className=" bg-[#ffffff] border   border-[#e2e8f0] rounded-md "
        ref={printRef}
      >
        <div
          className="bg-[#ffffff] py-5 px-2  rounded-md"
          style={{
            width: "215mm",
            minHeight: "297mm",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}
          <div className="w-full flex justify-between pb-[12px] border-b  border-[#90a1b9] mb-4">
            <span className="font-semibold">
              {formatPersianDate(sale?.saleDate)}
            </span>
            <span className="underline underline-offset-2 text-[#a0522d] font-bold">
              {sale?.billNumber}
            </span>
          </div>

          {/* Company Header */}
          <header className="rounded-md  p-6 mb-6  bg-[url(/banner.png)] bg-no-repeat  bg-cover  bg-center">
            <h3 className="text-2xl font-bold text-[#ffffff] text-right mb-4">
              شرکت تجارتی برادران اصغری
            </h3>

            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              {/* Address */}
              <div className="flex items-center gap-2">
                <CiLocationOn className="text-xl text-[#ffffff]" />
                <p className="text-[#ffffff] text-sm">
                  افغانستان کندهار سرک نو احمدی مارکیت دوکان شماره ۳ و ۴
                </p>
              </div>

              {/* Phone Numbers */}
              <div className="flex items-center gap-2">
                <SlCallIn className="text-xl text-[#fff]" />
                <div className="text-[#fff] text-sm flex gap-3">
                  <span>0708181028</span>
                  <span>0709006272</span>
                  <span>0708471789</span>
                </div>
              </div>
            </div>
          </header>

          {/* Invoice Details */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-5 px-4 border mb-6 rounded border-[#e5e7eb]">
            {/* Invoice To */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[#1e2939] font-semibold">فاکتور برای :</h3>
                <span className="text-[#1e2939]">
                  {customer?.name ||
                    sale?.customerName?.name ||
                    sale?.customerName ||
                    "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">تفصیل:</span>
                <span>-</span>
              </div>
            </div>

            {/* Date and Warehouse */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">تاریخ:</span>
                <span>{formatPersianDate(sale?.saleDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">گدام:</span>
                <span>فروشگاه مرکزی</span>
              </div>
            </div>

            {/* Bill Number & Currency */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">شماره فاکتور:</span>
                <span>{sale?.billNumber || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">واحد پول:</span>
                <span>افغانی</span>
              </div>
            </div>
          </section>

          {/* Services Table */}
          <section className="mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-[#d1d5dc]">
                <thead>
                  <tr className="bg-[#f3f4f6]">
                    {tableHeaders.map((header, index) => (
                      <th
                        key={index}
                        className="border border-[#d1d5dc] px-4 py-2 text-right font-semibold"
                      >
                        {header.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {services.map((curr, index) => {
                    const { weight, carton } = calculateWeightAndCarton(curr);
                    return (
                      <tr key={index} className="hover:bg-[#f9fafb]">
                        <td className="border border-[#d1d5dc] px-4 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border border-[#d1d5dc] px-4 py-2">
                          {curr.product?.name || "-"}
                        </td>
                        <td className="border border-[#d1d5dc] px-4 py-2">
                          {curr.description || "-"}
                        </td>
                        <td className="border border-[#d1d5dc] px-4 py-2 text-left">
                          {formatNumberWithPersianDigits(weight.toFixed(1))}
                        </td>
                        <td className="border border-[#d1d5dc] px-4 py-2 text-left">
                          {formatNumberWithPersianDigits(carton)}
                        </td>
                        <td className="border border-[#d1d5dc] px-4 py-2 text-left">
                          {formatNumberWithPersianDigits(curr.unitPrice)}
                        </td>
                        <td className="border border-[#d1d5dc] px-4 py-2 text-left">
                          {formatNumberWithPersianDigits(curr.totalPrice)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Totals Section */}
          <section className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            {/* Summary Box */}
            <div className="border border-[#d1d5dc] rounded overflow-hidden w-full md:w-[300px]">
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#1e2939]">مجموعه:</span>
                  <span className="font-medium bg-[#eff6ff] px-3 py-1 rounded">
                    {formatNumberWithPersianDigits(sale?.totalAmount || 0)}{" "}
                    افغانی
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1e2939]">مجموع وزن:</span>
                  <span className="font-medium bg-[#eff6ff] px-3 py-1 rounded">
                    {formatNumberWithPersianDigits(totalWeight.toFixed(1))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1e2939]">مجموع کارتن:</span>
                  <span className="font-medium bg-[#eff6ff] px-3 py-1 rounded">
                    {formatNumberWithPersianDigits(totalCarton)}
                  </span>
                </div>
              </div>
              <div className=" text-[#fff] bg-[#7c4a2d] p-4 font-bold">
                <div className="flex justify-between">
                  <span>مجموع کل:</span>
                  <span>
                    {formatNumberWithPersianDigits(sale?.totalAmount || 0)}{" "}
                    افغانی
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="w-full md:w-[300px] space-y-3">
              {sale && (
                <>
                  <div className="flex justify-between border-b pb-[12px] border-[#45556c]">
                    <span>مبلغ رسید:</span>
                    <span>
                      {formatNumberWithPersianDigits(sale?.paidAmount || 0)}{" "}
                      افغانی
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-[12px] border-[#45556c]">
                    <span>باقیمانده:</span>
                    <span>
                      {formatNumberWithPersianDigits(sale?.dueAmount || 0)}{" "}
                      افغانی
                    </span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-[#d1d5dc] pt-6 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              {/* Manager Signature */}
              <div className="text-right">
                <h4 className="text-lg font-semibold">مدیریت برادران اصغری</h4>
                <div className="mt-6">
                  <p className="text-sm">مهر و امضاء</p>
                  <div className="h-[1px] w-48 border-t border-[#d1d5dc] mt-[30px]"></div>
                </div>
              </div>

              {/* Thanks Message */}
              <div className="text-right">
                <p className="text-lg font-medium">از خریداری شما سپاسگزاریم</p>
                <p className="text-[#4a5565] mt-1">
                  امیدواریم دوباره خدمت‌گذار تان باشیم
                </p>
              </div>
            </div>

            {/* Print DateTime */}
            <div className="mt-8 pt-4 border-t border-[#d1d5dc] text-sm">
              <div className="flex justify-between">
                <div>
                  <span className="font-semibold">تاریخ چاپ: </span>
                  <span>
                    {printDateTime.dayName} -{" "}
                    {formatNumberWithPersianDigits(printDateTime.dateStr)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">وقت چاپ: </span>
                  <span>
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default SaleBillPrint;
