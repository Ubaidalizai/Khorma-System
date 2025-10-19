import React, { useState, useEffect } from "react";
import { fetchProducts, fetchCustomers } from "../services/apiUtiles";

function SaleForm({ register, handleSubmit, watch, onClose }) {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([
    { product: "", batch_number: "", quantity: 0 },
  ]);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, customersData] = await Promise.all([
          fetchProducts(),
          fetchCustomers(),
        ]);

        setProducts(productsData.map((p) => ({ value: p._id, label: p.name })));
        setCustomers(
          customersData.map((c) => ({ value: c._id, label: c.name }))
        );
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addItem = () => {
    setItems([...items, { product: "", batch_number: "", quantity: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateTotal = () => {
    // This would need to be calculated based on product prices
    // For now, just return a placeholder
    return items.reduce((total, item) => total + item.quantity * 100, 0); // Assuming 100 as base price
  };

  const calculateFinalTotal = () => {
    const total = calculateTotal();
    return total - discount;
  };

  const handleFormSubmit = (data) => {
    const saleData = {
      items: items.filter((item) => item.product && item.quantity > 0),
      discount: discount,
    };
    handleSubmit(saleData);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleFormSubmit)}
      className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'
    >
      <div className='p-6 border-b border-gray-200 flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-gray-900'>
          اضافه کردن فروش جدید
        </h2>
      </div>
      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              مشتری
            </label>
            <select
              {...register("customer")}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
            >
              <option value=''>انتخاب مشتری</option>
              {customers.map((customer) => (
                <option key={customer.value} value={customer.value}>
                  {customer.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              تخفیف (افغانی)
            </label>
            <input
              type='number'
              step='0.01'
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
              placeholder='0.00'
              min='0'
            />
          </div>
        </div>

        {/* Items Section */}
        <div className='mb-6'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>اقلام فروش</h3>
            <button
              type='button'
              onClick={addItem}
              className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'
            >
              اضافه کردن قلم
            </button>
          </div>

          <div className='space-y-4'>
            {items.map((item, index) => (
              <div
                key={index}
                className='grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg'
              >
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    محصول *
                  </label>
                  <select
                    value={item.product}
                    onChange={(e) =>
                      updateItem(index, "product", e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    required
                  >
                    <option value=''>انتخاب محصول</option>
                    {products.map((product) => (
                      <option key={product.value} value={product.value}>
                        {product.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    شماره بچ *
                  </label>
                  <input
                    type='text'
                    value={item.batch_number}
                    onChange={(e) =>
                      updateItem(index, "batch_number", e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    placeholder='BN-001'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    مقدار *
                  </label>
                  <input
                    type='number'
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "quantity",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    placeholder='0'
                    min='0'
                    required
                  />
                </div>

                <div className='flex items-end'>
                  <button
                    type='button'
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className='w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sale Summary */}
        <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
          <h3 className='text-lg font-semibold text-gray-900 mb-3'>
            خلاصه فروش
          </h3>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>مجموع:</span>
              <span className='font-semibold text-gray-900'>
                {calculateTotal().toFixed(2)} افغانی
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-600'>تخفیف:</span>
              <span className='font-semibold text-red-600'>
                -{discount.toFixed(2)} افغانی
              </span>
            </div>
            <div className='pt-2 border-t border-gray-300'>
              <div className='flex justify-between'>
                <span className='font-bold text-gray-900'>مجموع نهایی:</span>
                <span className='text-xl font-bold text-amber-600'>
                  {calculateFinalTotal().toFixed(2)} افغانی
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='p-6 border-t border-gray-200 flex justify-end gap-4'>
        <button
          type='button'
          onClick={onClose}
          className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
        >
          لغو
        </button>
        <button
          type='submit'
          className='px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700'
          disabled={loading}
        >
          {loading ? "در حال بارگذاری..." : "اضافه کردن فروش"}
        </button>
      </div>
    </form>
  );
}

export default SaleForm;

