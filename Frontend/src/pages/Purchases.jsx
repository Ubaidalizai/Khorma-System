import { useState } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

const Purchases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data
  const [purchases] = useState([
    {
      id: 1,
      supplier: "Fresh Foods Ltd",
      product: "Fresh Dates",
      quantity: 100,
      unitPrice: 12.5,
      totalAmount: 1250,
      date: "2024-01-15",
      status: "Completed",
    },
    {
      id: 2,
      supplier: "Grain Suppliers Inc",
      product: "Chickpeas",
      quantity: 200,
      unitPrice: 6.75,
      totalAmount: 1350,
      date: "2024-01-14",
      status: "Pending",
    },
    {
      id: 3,
      supplier: "Bakery Supplies Co",
      product: "Cake Mix",
      quantity: 50,
      unitPrice: 10.99,
      totalAmount: 549.5,
      date: "2024-01-13",
      status: "Completed",
    },
    {
      id: 4,
      supplier: "Sweet Sugar Corp",
      product: "Sugar",
      quantity: 300,
      unitPrice: 3.25,
      totalAmount: 975,
      date: "2024-01-12",
      status: "Completed",
    },
  ]);

  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.product.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className='space-y-6'>
      {/* Page header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Purchase Management
          </h1>
          <p className='text-gray-600 mt-2'>
            Track and manage your inventory purchases
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
            New Purchase
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-blue-500'>
              <DocumentArrowDownIcon className='h-6 w-6 text-white' />
            </div>
            <div className='mr-4'>
              <p className='text-sm font-medium text-gray-600'>
                Total Purchases
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {purchases.length}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-green-500'>
              <EyeIcon className='h-6 w-6 text-white' />
            </div>
            <div className='mr-4'>
              <p className='text-sm font-medium text-gray-600'>Completed</p>
              <p className='text-2xl font-bold text-gray-900'>
                {purchases.filter((p) => p.status === "Completed").length}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-yellow-500'>
              <PencilIcon className='h-6 w-6 text-white' />
            </div>
            <div className='mr-4'>
              <p className='text-sm font-medium text-gray-600'>Pending</p>
              <p className='text-2xl font-bold text-gray-900'>
                {purchases.filter((p) => p.status === "Pending").length}
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
              <p className='text-sm font-medium text-gray-600'>Total Amount</p>
              <p className='text-2xl font-bold text-gray-900'>
                $
                {purchases
                  .reduce((sum, p) => sum + p.totalAmount, 0)
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
            placeholder='Search purchases...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
          />
        </div>
      </div>

      {/* Purchases table */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Purchase ID
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Supplier
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Product
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Quantity
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Unit Price
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Total Amount
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
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    #{purchase.id.toString().padStart(4, "0")}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {purchase.supplier}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {purchase.product}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {purchase.quantity}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    ${purchase.unitPrice}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    ${purchase.totalAmount.toLocaleString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {purchase.date}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        purchase.status
                      )}`}
                    >
                      {purchase.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <div className='flex space-x-2'>
                      <button className='text-blue-600 hover:text-blue-900'>
                        <EyeIcon className='h-4 w-4' />
                      </button>
                      <button className='text-amber-600 hover:text-amber-900'>
                        <PencilIcon className='h-4 w-4' />
                      </button>
                      <button className='text-red-600 hover:text-red-900'>
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

      {/* New purchase form */}
      {showAddModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Add New Purchase
              </h3>
              <form className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Supplier
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    placeholder='Enter supplier name'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Product
                  </label>
                  <select className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'>
                    <option>Select product...</option>
                    <option>Fresh Dates</option>
                    <option>Chickpeas</option>
                    <option>Cake Mix</option>
                    <option>Sugar</option>
                  </select>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Quantity
                    </label>
                    <input
                      type='number'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                      placeholder='0'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Unit Price
                    </label>
                    <input
                      type='number'
                      step='0.01'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                      placeholder='0.00'
                    />
                  </div>
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
                    Add Purchase
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

export default Purchases;
