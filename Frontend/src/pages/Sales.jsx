import { useState } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [billType, setBillType] = useState("small");

  // Mock data
  const [sales] = useState([
    {
      id: 1,
      customer: "Ahmad Khan",
      products: ["Fresh Dates", "Chickpeas"],
      totalAmount: 245.5,
      date: "2024-01-15",
      billType: "Small",
      status: "Completed",
    },
    {
      id: 2,
      customer: "Sara Ahmed",
      products: ["Cake Mix", "Sugar"],
      totalAmount: 1250.75,
      date: "2024-01-15",
      billType: "Large",
      status: "Completed",
    },
    {
      id: 3,
      customer: "Mohammad Ali",
      products: ["Fresh Dates"],
      totalAmount: 89.99,
      date: "2024-01-14",
      billType: "Small",
      status: "Pending",
    },
    {
      id: 4,
      customer: "Fatima Hassan",
      products: ["Chickpeas", "Sugar", "Cake Mix"],
      totalAmount: 2100.25,
      date: "2024-01-14",
      billType: "Large",
      status: "Completed",
    },
  ]);

  const filteredSales = sales.filter(
    (sale) =>
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.products.some((product) =>
        product.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBillTypeColor = (type) => {
    switch (type) {
      case "Large":
        return "bg-blue-100 text-blue-800";
      case "Small":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className='space-y-6'>
      {/* Page header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Sales Management</h1>
          <p className='text-gray-600 mt-2'>
            Track and manage your sales transactions
          </p>
        </div>
        <div className='flex space-x-3'>
          <button className='bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center'>
            <DocumentArrowDownIcon className='h-5 w-5 ml-2' />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className='bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center'
          >
            <PlusIcon className='h-5 w-5 ml-2' />
            New Sale
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-green-500'>
              <DocumentArrowDownIcon className='h-6 w-6 text-white' />
            </div>
            <div className='mr-4'>
              <p className='text-sm font-medium text-gray-600'>Total Sales</p>
              <p className='text-2xl font-bold text-gray-900'>{sales.length}</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-blue-500'>
              <EyeIcon className='h-6 w-6 text-white' />
            </div>
            <div className='mr-4'>
              <p className='text-sm font-medium text-gray-600'>Large Bills</p>
              <p className='text-2xl font-bold text-gray-900'>
                {sales.filter((s) => s.billType === "Large").length}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-gray-500'>
              <PencilIcon className='h-6 w-6 text-white' />
            </div>
            <div className='mr-4'>
              <p className='text-sm font-medium text-gray-600'>Small Bills</p>
              <p className='text-2xl font-bold text-gray-900'>
                {sales.filter((s) => s.billType === "Small").length}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-amber-500'>
              <DocumentArrowDownIcon className='h-6 w-6 text-white' />
            </div>
            <div className='mr-4'>
              <p className='text-sm font-medium text-gray-600'>Total Revenue</p>
              <p className='text-2xl font-bold text-gray-900'>
                $
                {sales
                  .reduce((sum, s) => sum + s.totalAmount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <div className='relative'>
          <MagnifyingGlassIcon className='absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
          <input
            type='text'
            placeholder='Search sales...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
          />
        </div>
      </div>

      {/* Sales table */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Sale ID
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Customer
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Products
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Total Amount
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Bill Type
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredSales.map((sale) => (
                <tr key={sale.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    #{sale.id.toString().padStart(4, "0")}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {sale.customer}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    <div className='max-w-xs'>
                      <p className='truncate'>{sale.products.join(", ")}</p>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    ${sale.totalAmount.toLocaleString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBillTypeColor(
                        sale.billType
                      )}`}
                    >
                      {sale.billType}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {sale.date}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        sale.status
                      )}`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <div className='flex space-x-2'>
                      <button
                        className='text-blue-600 hover:text-blue-900'
                        title='View'
                      >
                        <EyeIcon className='h-4 w-4' />
                      </button>
                      <button
                        className='text-green-600 hover:text-green-900'
                        title='Print Bill'
                      >
                        <PrinterIcon className='h-4 w-4' />
                      </button>
                      <button
                        className='text-amber-600 hover:text-amber-900'
                        title='Edit'
                      >
                        <PencilIcon className='h-4 w-4' />
                      </button>
                      <button
                        className='text-red-600 hover:text-red-900'
                        title='Delete'
                      >
                        <TrashIcon className='h-4 w-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New sale form */}
      {showAddModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Add New Sale
              </h3>
              <form className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Customer
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    placeholder='Enter customer name'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Bill Type
                  </label>
                  <div className='flex space-x-4'>
                    <label className='flex items-center'>
                      <input
                        type='radio'
                        name='billType'
                        value='small'
                        checked={billType === "small"}
                        onChange={(e) => setBillType(e.target.value)}
                        className='ml-2'
                      />
                      Small Bill
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='radio'
                        name='billType'
                        value='large'
                        checked={billType === "large"}
                        onChange={(e) => setBillType(e.target.value)}
                        className='ml-2'
                      />
                      Large Bill
                    </label>
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Products
                  </label>
                  <select
                    multiple
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  >
                    <option>Fresh Dates</option>
                    <option>Chickpeas</option>
                    <option>Cake Mix</option>
                    <option>Sugar</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Total Amount
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    placeholder='0.00'
                  />
                </div>
                <div className='flex justify-end space-x-3 pt-4'>
                  <button
                    type='button'
                    onClick={() => setShowAddModal(false)}
                    className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700'
                  >
                    Add Sale
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
