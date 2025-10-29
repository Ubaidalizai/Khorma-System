import { useState, useEffect, useMemo } from "react";
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useSalesReports } from "../services/useApi";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("sales");
  const [dateRange, setDateRange] = useState("month");

  const reportTypes = [
    { id: "sales", name: "Sales Reports", icon: ChartBarIcon },
    { id: "inventory", name: "Inventory Reports", icon: ChartBarIcon },
    { id: "purchases", name: "Purchase Reports", icon: ChartBarIcon },
    { id: "accounts", name: "Account Reports", icon: ChartBarIcon },
    { id: "expenses", name: "Expense Reports", icon: ChartBarIcon },
    { id: "profit", name: "Profit & Loss", icon: ChartBarIcon },
  ];

  // Calculate date range based on selected period
  const getDateRange = (range) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (range) {
      case "daily":
        startDate.setDate(now.getDate() - 7); // Last 7 days
        break;
      case "weekly":
        startDate.setDate(now.getDate() - 30); // Last 30 days
        break;
      case "monthly":
        startDate.setMonth(now.getMonth() - 6); // Last 6 months
        break;
      default:
        startDate.setMonth(now.getMonth() - 6);
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
    };
  };

  const dateParams = getDateRange(dateRange);
  
  // Map UI range to backend groupBy values
  const groupByMap = {
    daily: 'day',
    weekly: 'week',
    monthly: 'month',
  };

  // Fetch sales reports data
  const { data: salesReportsData, isLoading: salesReportsLoading } = useSalesReports({
    startDate: dateParams.startDate,
    endDate: dateParams.endDate,
    groupBy: groupByMap[dateRange] || 'day',
  });

  const inventoryData = [
    { product: "Fresh Dates", currentStock: 150, minStock: 50, status: "Good" },
    { product: "Chickpeas", currentStock: 200, minStock: 100, status: "Good" },
    { product: "Cake Mix", currentStock: 25, minStock: 30, status: "Low" },
    { product: "Sugar", currentStock: 100, minStock: 50, status: "Good" },
  ];

  // Get current data based on selected report
  const getCurrentData = () => {
    switch (selectedReport) {
      case "sales":
        return salesReportsData?.data?.summary || [];
      case "inventory":
        return inventoryData;
      default:
        return [];
    }
  };

  // Chart data for sales reports
  const chartData = useMemo(() => {
    const data = getCurrentData();
    return data.map(item => ({
      ...item,
      sales: item.sales || 0,
      paid: item.paid || 0,
      due: item.due || 0,
    }));
  }, [salesReportsData, selectedReport]);

  // System colors for charts
  const chartColors = {
    sales: '#10B981', // green-500
    paid: '#3B82F6', // blue-500
    due: '#EF4444', // red-500
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Good":
        return "bg-green-100 text-green-800";
      case "Low":
        return "bg-yellow-100 text-yellow-800";
      case "Critical":
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
            Reports & Analytics
          </h1>
          <p className='text-gray-600 mt-2'>
            Generate and view business reports
          </p>
        </div>
        <div className='flex space-x-3'>
          <button className='bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center'>
            <PrinterIcon className='h-5 w-5 ml-2' />
            Print
          </button>
          <button className='bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center'>
            <DocumentArrowDownIcon className='h-5 w-5 ml-2' />
            Export
          </button>
        </div>
      </div>

      {/* Report type selector */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Select Report Type
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedReport === report.id
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <Icon className='h-8 w-8 mx-auto mb-2' />
                <p className='text-sm font-medium'>{report.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date range selector */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Select Date Range
        </h3>
        <div className='flex space-x-4'>
          <button
            onClick={() => setDateRange("daily")}
            className={`px-4 py-2 rounded-lg border ${
              dateRange === "daily"
                ? "border-amber-500 bg-amber-50 text-amber-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setDateRange("weekly")}
            className={`px-4 py-2 rounded-lg border ${
              dateRange === "weekly"
                ? "border-amber-500 bg-amber-50 text-amber-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setDateRange("monthly")}
            className={`px-4 py-2 rounded-lg border ${
              dateRange === "monthly"
                ? "border-amber-500 bg-amber-50 text-amber-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Report content */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-semibold text-gray-900'>
            {reportTypes.find((r) => r.id === selectedReport)?.name} -{" "}
            {dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}
          </h3>
        </div>

        <div className='p-6'>
          {selectedReport === "sales" && (
            <div className='space-y-6'>
              {salesReportsLoading ? (
                <div className='text-center text-gray-500'>Loading sales data...</div>
              ) : chartData.length === 0 ? (
                <div className='text-center text-gray-500'>No sales data found for the selected period.</div>
              ) : (
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  {/* Sales Trend Chart */}
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <h4 className='text-lg font-semibold text-gray-900 mb-4'>Sales Trend</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          formatter={(value, name) => [
                            `$${value.toLocaleString()}`, 
                            name === 'sales' ? 'Sales' : name
                          ]}
                          labelStyle={{ color: '#374151' }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="sales"
                          stroke={chartColors.sales}
                          fill={chartColors.sales}
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Paid vs Due Chart */}
                  <div className='bg-gray-50 p-4 rounded-lg'>
                    <h4 className='text-lg font-semibold text-gray-900 mb-4'>Paid vs Due</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          formatter={(value, name) => [
                            `$${value.toLocaleString()}`, 
                            name === 'paid' ? 'Paid' : 'Due'
                          ]}
                          labelStyle={{ color: '#374151' }}
                        />
                        <Legend />
                        <Bar dataKey="paid" fill={chartColors.paid} />
                        <Bar dataKey="due" fill={chartColors.due} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedReport === "inventory" && (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Product
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Current Stock
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Minimum Stock
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
                  {getCurrentData().map((item, index) => (
                    <tr key={index} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {item.product}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {item.currentStock}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {item.minStock}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <button className='text-blue-600 hover:text-blue-900'>
                          <EyeIcon className='h-4 w-4' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!["sales", "inventory"].includes(selectedReport) && (
            <div className='text-center py-12'>
              <ChartBarIcon className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {reportTypes.find((r) => r.id === selectedReport)?.name} Coming
                Soon
              </h3>
              <p className='text-gray-600'>
                This report type is under development and will be available
                soon.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Summary cards */}
      {selectedReport === "sales" && salesReportsData?.data?.totals && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-green-500'>
                <ChartBarIcon className='h-6 w-6 text-white' />
              </div>
              <div className='mr-4'>
                <p className='text-sm font-medium text-gray-600'>Total Sales</p>
                <p className='text-2xl font-bold text-gray-900'>
                  ${salesReportsData.data.totals.totalSales.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-blue-500'>
                <ChartBarIcon className='h-6 w-6 text-white' />
              </div>
              <div className='mr-4'>
                <p className='text-sm font-medium text-gray-600'>Total Paid</p>
                <p className='text-2xl font-bold text-gray-900'>
                  ${salesReportsData.data.totals.totalPaid.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-amber-500'>
                <ChartBarIcon className='h-6 w-6 text-white' />
              </div>
              <div className='mr-4'>
                <p className='text-sm font-medium text-gray-600'>Total Due</p>
                <p className='text-2xl font-bold text-gray-900'>
                  ${salesReportsData.data.totals.totalDue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
