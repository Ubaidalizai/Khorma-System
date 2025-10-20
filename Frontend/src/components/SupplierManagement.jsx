import React, { useState } from 'react';
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from '../services/useApi';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const SupplierManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
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

  const { data: suppliers, isLoading, error, refetch } = useSuppliers();
  const createSupplierMutation = useCreateSupplier();
  const updateSupplierMutation = useUpdateSupplier();
  const deleteSupplierMutation = useDeleteSupplier();

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers?.data?.filter(supplier =>
    supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_info?.phone?.includes(searchTerm)
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
      if (editingSupplier) {
        await updateSupplierMutation.mutateAsync({
          id: editingSupplier._id,
          supplierData: formData
        });
        toast.success('تامین‌کننده با موفقیت به‌روزرسانی شد');
      } else {
        await createSupplierMutation.mutateAsync(formData);
        toast.success('تامین‌کننده با موفقیت اضافه شد');
      }
      
      setIsModalOpen(false);
      setEditingSupplier(null);
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
      toast.error('خطا در ذخیره تامین‌کننده');
      console.error('Error saving supplier:', error);
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name || '',
      contact_info: {
        phone: supplier.contact_info?.phone || '',
        email: supplier.contact_info?.email || '',
        address: supplier.contact_info?.address || '',
        city: supplier.contact_info?.city || '',
        state: supplier.contact_info?.state || '',
        zip_code: supplier.contact_info?.zip_code || ''
      }
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (supplier) => {
    if (window.confirm('آیا از حذف این تامین‌کننده اطمینان دارید؟')) {
      try {
        await deleteSupplierMutation.mutateAsync(supplier._id);
        toast.success('تامین‌کننده با موفقیت حذف شد');
        refetch();
      } catch (error) {
        toast.error('خطا در حذف تامین‌کننده');
        console.error('Error deleting supplier:', error);
      }
    }
  };

  const handleAddNew = () => {
    setEditingSupplier(null);
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
            مدیریت تامین‌کنندگان
          </h2>
          <p className="text-gray-600 mt-1">
            افزودن، ویرایش و حذف تامین‌کنندگان
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="btn-primary flex items-center space-x-2 space-x-reverse"
        >
          <PlusIcon className="h-5 w-5" />
          <span>افزودن تامین‌کننده</span>
        </button>
      </div>

      {/* Search and Stats */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو در تامین‌کنندگان..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pr-10"
            />
          </div>
          <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
            <span>کل: {suppliers?.length || 0}</span>
            <span>نمایش: {filteredSuppliers.length}</span>
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نام تامین‌کننده
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ایمیل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تلفن
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
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <BuildingOfficeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>هیچ تامین‌کننده‌ای یافت نشد</p>
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-8 w-8 text-gray-400 ml-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {supplier.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.contact_info?.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.contact_info?.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.contact_info?.address || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.contact_info?.city || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                          title="ویرایش"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(supplier)}
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
                  {editingSupplier ? 'ویرایش تامین‌کننده' : 'افزودن تامین‌کننده جدید'}
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
                    نام تامین‌کننده *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input w-full"
                    placeholder="نام تامین‌کننده"
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
                    disabled={createSupplierMutation.isPending || updateSupplierMutation.isPending}
                    className="btn-primary"
                  >
                    {createSupplierMutation.isPending || updateSupplierMutation.isPending
                      ? 'در حال ذخیره...'
                      : editingSupplier
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

export default SupplierManagement;
