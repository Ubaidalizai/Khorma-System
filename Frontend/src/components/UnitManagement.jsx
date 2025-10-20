import React, { useState } from 'react';
import { useUnits, useCreateUnit, useUpdateUnit, useDeleteUnit } from '../services/useApi';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ScaleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const UnitManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    conversion_to_base: 1,
    is_base_unit: false,
  });

  const { data: units, isLoading, error, refetch } = useUnits();
  const createUnitMutation = useCreateUnit();
  const updateUnitMutation = useUpdateUnit();
  const deleteUnitMutation = useDeleteUnit();

  // Filter units based on search term
  const filteredUnits = units?.data?.filter(unit =>
    unit.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUnit) {
        await updateUnitMutation.mutateAsync({
          id: editingUnit._id,
          unitData: formData
        });
        toast.success('واحد با موفقیت به‌روزرسانی شد');
      } else {
        await createUnitMutation.mutateAsync(formData);
        toast.success('واحد با موفقیت اضافه شد');
      }
      
      setIsModalOpen(false);
      setEditingUnit(null);
      setFormData({
        name: '',
        description: '',
        conversion_to_base: 1,
        is_base_unit: false,
      });
      refetch();
    } catch (error) {
      toast.error('خطا در ذخیره واحد');
      console.error('Error saving unit:', error);
    }
  };

  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setFormData({
      name: unit.name || '',
      description: unit.description || '',
      conversion_to_base: unit.conversion_to_base || 1,
      is_base_unit: unit.is_base_unit || false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (unit) => {
    if (window.confirm('آیا از حذف این واحد اطمینان دارید؟')) {
      try {
        await deleteUnitMutation.mutateAsync(unit._id);
        toast.success('واحد با موفقیت حذف شد');
        refetch();
      } catch (error) {
        toast.error('خطا در حذف واحد');
        console.error('Error deleting unit:', error);
      }
    }
  };

  const handleAddNew = () => {
    setEditingUnit(null);
    setFormData({
      name: '',
      description: '',
      conversion_to_base: 1,
      is_base_unit: false,
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
            مدیریت واحدها
          </h2>
          <p className="text-gray-600 mt-1">
            افزودن، ویرایش و حذف واحدهای اندازه‌گیری
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="btn-primary flex items-center space-x-2 space-x-reverse"
        >
          <PlusIcon className="h-5 w-5" />
          <span>افزودن واحد</span>
        </button>
      </div>

      {/* Search and Stats */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو در واحدها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pr-10"
            />
          </div>
          <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
            <span>کل: {units?.data?.length || 0}</span>
            <span>نمایش: {filteredUnits.length}</span>
            <span>واحد پایه: {units?.data?.filter(u => u.is_base_unit).length || 0}</span>
          </div>
        </div>
      </div>

      {/* Units Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نام واحد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  توضیحات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ضریب تبدیل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نوع واحد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <ScaleIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>هیچ واحدی یافت نشد</p>
                  </td>
                </tr>
              ) : (
                filteredUnits.map((unit) => (
                  <tr key={unit._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ScaleIcon className="h-8 w-8 text-gray-400 ml-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {unit.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">
                        {unit.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {unit.conversion_to_base}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {unit.is_base_unit ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          واحد پایه
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          واحد فرعی
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleEdit(unit)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                          title="ویرایش"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(unit)}
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
                  {editingUnit ? 'ویرایش واحد' : 'افزودن واحد جدید'}
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
                    نام واحد *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input w-full"
                    placeholder="مثال: کیلوگرم، کارتن، بسته"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    توضیحات
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="form-input w-full"
                    placeholder="توضیحات واحد (اختیاری)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ضریب تبدیل به واحد پایه *
                  </label>
                  <input
                    type="number"
                    name="conversion_to_base"
                    value={formData.conversion_to_base}
                    onChange={handleInputChange}
                    min="0.0001"
                    step="0.0001"
                    required
                    className="form-input w-full"
                    placeholder="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    برای واحد پایه: 1، برای واحدهای فرعی: تعداد واحدهای فرعی در یک واحد پایه
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_base_unit"
                    checked={formData.is_base_unit}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="mr-2 block text-sm text-gray-700">
                    این واحد، واحد پایه است
                  </label>
                </div>

                {formData.is_base_unit && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <div className="flex">
                      <InformationCircleIcon className="h-5 w-5 text-blue-400 ml-2" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium">واحد پایه</p>
                        <p>این واحد به عنوان واحد اصلی برای محاسبات استفاده خواهد شد.</p>
                      </div>
                    </div>
                  </div>
                )}

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
                    disabled={createUnitMutation.isPending || updateUnitMutation.isPending}
                    className="btn-primary"
                  >
                    {createUnitMutation.isPending || updateUnitMutation.isPending
                      ? 'در حال ذخیره...'
                      : editingUnit
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

export default UnitManagement;
