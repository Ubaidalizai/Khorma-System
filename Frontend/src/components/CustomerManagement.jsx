import React, { useState } from 'react';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '../services/useApi';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const CustomerManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contact_info: {
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip_code: ''
    }
  });

  const { data: customers, isLoading, error, refetch } = useCustomers();
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();

  // Filter customers based on search term
  const filteredCustomers = customers?.data?.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact_info?.phone?.includes(searchTerm) ||
    customer.contact_info?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact_info.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact_info: {
          ...prev.contact_info,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCustomer) {
        await updateCustomerMutation.mutateAsync({
          id: editingCustomer._id,
          customerData: formData
        });
        toast.success('مشتری با موفقیت به‌روزرسانی شد');
      } else {
        await createCustomerMutation.mutateAsync(formData);
        toast.success('مشتری با موفقیت اضافه شد');
      }
      
      setIsModalOpen(false);
      setEditingCustomer(null);
      setFormData({
        name: '',
        contact_info: {
          phone: '',
          email: '',
          address: '',
          city: '',
          state: '',
          zip_code: ''
        }
      });
      refetch();
    } catch (error) {
      toast.error('خطا در ذخیره مشتری');
      console.error('Error saving customer:', error);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || '',
      contact_info: {
        phone: customer.contact_info?.phone || '',
        email: customer.contact_info?.email || '',
        address: customer.contact_info?.address || '',
        city: customer.contact_info?.city || '',
        state: customer.contact_info?.state || '',
        zip_code: customer.contact_info?.zip_code || ''
      }
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (customer) => {
    if (window.confirm('آیا از حذف این مشتری اطمینان دارید؟')) {
      try {
        await deleteCustomerMutation.mutateAsync(customer._id);
        toast.success('مشتری با موفقیت حذف شد');
        refetch();
      } catch (error) {
        toast.error('خطا در حذف مشتری');
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      contact_info: {
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip_code: ''
      }
    });
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4" style={{ borderColor: 'var(--primary-brown)' }}></div>
        <span className="mr-4 text-lg" style={{ color: 'var(--text-medium)' }}>در حال بارگذاری...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="h-16 w-16 mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-600 mb-2">خطا در بارگذاری داده‌ها</h3>
        <p className="text-gray-600 mb-4">لطفاً صفحه را رفرش کنید یا دوباره تلاش کنید</p>
        <button 
          onClick={() => refetch()}
          className="btn-primary"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--primary-brown)' }}>
            مدیریت مشتریان
          </h2>
          <p className="text-gray-600 mt-1">
            افزودن، ویرایش و حذف مشتریان
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="btn-primary flex items-center space-x-2 space-x-reverse"
        >
          <PlusIcon className="h-5 w-5" />
          <span>افزودن مشتری</span>
        </button>
      </div>

      {/* Search and Stats */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو در مشتریان..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pr-10"
            />
          </div>
          <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
            <span>کل: {customers?.length || 0}</span>
            <span>نمایش: {filteredCustomers.length}</span>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نام مشتری
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تماس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ایمیل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  آدرس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  شهر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <UserGroupIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>هیچ مشتری‌ای یافت نشد</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center ml-3">
                          <UserGroupIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <PhoneIcon className="h-4 w-4 text-gray-400 ml-1" />
                        <span>{customer.contact_info?.phone || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400 ml-1" />
                        <span className="truncate max-w-xs">
                          {customer.contact_info?.email || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 text-gray-400 ml-1 flex-shrink-0" />
                        <span className="truncate max-w-xs">
                          {customer.contact_info?.address || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.contact_info?.city || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                          title="ویرایش"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="حذف"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingCustomer ? 'ویرایش مشتری' : 'افزودن مشتری جدید'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">بستن</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نام مشتری *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input w-full"
                    placeholder="نام مشتری"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    name="contact_info.email"
                    value={formData.contact_info.email}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تلفن
                  </label>
                  <input
                    type="tel"
                    name="contact_info.phone"
                    value={formData.contact_info.phone}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    placeholder="09123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    آدرس
                  </label>
                  <textarea
                    name="contact_info.address"
                    value={formData.contact_info.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="form-input w-full"
                    placeholder="آدرس کامل"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      شهر
                    </label>
                    <input
                      type="text"
                      name="contact_info.city"
                      value={formData.contact_info.city}
                      onChange={handleInputChange}
                      className="form-input w-full"
                      placeholder="شهر"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      استان
                    </label>
                    <input
                      type="text"
                      name="contact_info.state"
                      value={formData.contact_info.state}
                      onChange={handleInputChange}
                      className="form-input w-full"
                      placeholder="استان"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    کد پستی
                  </label>
                  <input
                    type="text"
                    name="contact_info.zip_code"
                    value={formData.contact_info.zip_code}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    placeholder="1234567890"
                  />
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={createCustomerMutation.isPending || updateCustomerMutation.isPending}
                    className="btn-primary"
                  >
                    {createCustomerMutation.isPending || updateCustomerMutation.isPending
                      ? 'در حال ذخیره...'
                      : editingCustomer
                      ? 'به‌روزرسانی'
                      : 'افزودن'}
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

export default CustomerManagement;
