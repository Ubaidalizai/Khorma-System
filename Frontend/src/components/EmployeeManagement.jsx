import React, { useState } from 'react';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '../services/useApi';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const EmployeeManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    role: 'salesman',
    contact_info: {
      phone: '',
      email: '',
      address: ''
    },
    hire_date: '',
    is_active: true,
  });

  const { data: employees, isLoading, error, refetch } = useEmployees();
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

  // Role options with Persian labels
  const roleOptions = [
    { value: 'salesman', label: 'فروشنده' },
    { value: 'riding_man', label: 'راننده' },
    { value: 'cashier', label: 'صندوقدار' },
    { value: 'manager', label: 'مدیر' },
    { value: 'admin', label: 'مدیر سیستم' },
  ];

  // Filter employees based on search term
  const filteredEmployees = employees?.data?.filter(employee =>
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.contact_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.contact_info?.phone?.includes(searchTerm) ||
    employee.role?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
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
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingEmployee) {
        await updateEmployeeMutation.mutateAsync({
          id: editingEmployee._id,
          employeeData: formData
        });
        toast.success('کارمند با موفقیت به‌روزرسانی شد');
      } else {
        await createEmployeeMutation.mutateAsync(formData);
        toast.success('کارمند با موفقیت اضافه شد');
      }
      
      setIsModalOpen(false);
      setEditingEmployee(null);
      setFormData({
        name: '',
        role: 'salesman',
        contact_info: {
          phone: '',
          email: '',
          address: ''
        },
        hire_date: '',
        is_active: true,
      });
      refetch();
    } catch (error) {
      toast.error('خطا در ذخیره کارمند');
      console.error('Error saving employee:', error);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name || '',
      role: employee.role || 'salesman',
      contact_info: {
        phone: employee.contact_info?.phone || '',
        email: employee.contact_info?.email || '',
        address: employee.contact_info?.address || ''
      },
      hire_date: employee.hire_date ? new Date(employee.hire_date).toISOString().split('T')[0] : '',
      is_active: employee.is_active !== undefined ? employee.is_active : true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (employee) => {
    if (window.confirm('آیا از حذف این کارمند اطمینان دارید؟')) {
      try {
        await deleteEmployeeMutation.mutateAsync(employee._id);
        toast.success('کارمند با موفقیت حذف شد');
        refetch();
      } catch (error) {
        toast.error('خطا در حذف کارمند');
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      role: 'salesman',
      contact_info: {
        phone: '',
        email: '',
        address: ''
      },
      hire_date: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const getRoleLabel = (role) => {
    const roleOption = roleOptions.find(option => option.value === role);
    return roleOption ? roleOption.label : role;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
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
            مدیریت کارمندان
          </h2>
          <p className="text-gray-600 mt-1">
            افزودن، ویرایش و حذف کارمندان
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="btn-primary flex items-center space-x-2 space-x-reverse"
        >
          <PlusIcon className="h-5 w-5" />
          <span>افزودن کارمند</span>
        </button>
      </div>

      {/* Search and Stats */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو در کارمندان..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pr-10"
            />
          </div>
          <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
            <span>کل: {employees?.data?.length || 0}</span>
            <span>نمایش: {filteredEmployees?.length}</span>
            <span>فعال: {employees?.data?.filter(e => e.is_active).length || 0}</span>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نام کارمند
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نقش
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تماس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ایمیل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاریخ استخدام
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  وضعیت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <UserIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>هیچ کارمندی یافت نشد</p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center ml-3">
                          <UserIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <BriefcaseIcon className="h-4 w-4 text-gray-400 ml-1" />
                        <span>{getRoleLabel(employee.role)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <PhoneIcon className="h-4 w-4 text-gray-400 ml-1" />
                        <span>{employee.contact_info?.phone || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400 ml-1" />
                        <span className="truncate max-w-xs">
                          {employee.contact_info?.email || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400 ml-1" />
                        <span>{formatDate(employee.hire_date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-3 w-3 ml-1" />
                          فعال
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircleIcon className="h-3 w-3 ml-1" />
                          غیرفعال
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                          title="ویرایش"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee)}
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
                  {editingEmployee ? 'ویرایش کارمند' : 'افزودن کارمند جدید'}
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
                    نام کارمند *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input w-full"
                    placeholder="نام کارمند"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نقش *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="form-input w-full"
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاریخ استخدام
                  </label>
                  <input
                    type="date"
                    name="hire_date"
                    value={formData.hire_date}
                    onChange={handleInputChange}
                    className="form-input w-full"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="mr-2 block text-sm text-gray-700">
                    کارمند فعال است
                  </label>
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
                    disabled={createEmployeeMutation.isPending || updateEmployeeMutation.isPending}
                    className="btn-primary"
                  >
                    {createEmployeeMutation.isPending || updateEmployeeMutation.isPending
                      ? 'در حال ذخیره...'
                      : editingEmployee
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

export default EmployeeManagement;
