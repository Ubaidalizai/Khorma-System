import { useState, useMemo } from 'react';
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import {
  useSalesReports,
  useNetProfit,
  useProfitStats,
  useProfitSummary,
  usePurchaseReports,
  useExpenseSummary,
  useCategoriesByType,
  useAccountBalances,
  useCashFlowReport,
  useStockReport,
} from '../services/useApi';
import { formatNumber, formatCurrency } from '../utilies/helper';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('monthly'); // monthly (days) or yearly (months)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    return new Date().getFullYear().toString();
  });
  const [profitChartType, setProfitChartType] = useState('net'); // "net" or "gross"
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState(''); // Empty string means "all categories"
  const [selectedStockLocation, setSelectedStockLocation] = useState('all'); // "all", "warehouse", or "store"
  const [selectedStockLevel, setSelectedStockLevel] = useState('low'); // "all", "low", "critical", or "out"

  const reportTypes = [
    { id: 'sales', name: 'گزارشات فروش', icon: ChartBarIcon },
    { id: 'inventory', name: 'گزارشات موجودی', icon: ChartBarIcon },
    { id: 'purchases', name: 'گزارشات خرید', icon: ChartBarIcon },
    { id: 'accounts', name: 'گزارشات حساب', icon: ChartBarIcon },
    { id: 'expenses', name: 'گزارشات هزینه', icon: ChartBarIcon },
    { id: 'profit', name: 'سود و زیان', icon: ChartBarIcon },
  ];

  // Calculate date range based on selected period
  const getDateRange = (range) => {
    let startDate, endDate;
    const now = new Date();

    if (range === 'monthly') {
      // Monthly view: Show days of selected month
      if (!selectedMonth || selectedMonth.trim() === '') {
        // Default to current month if empty
        const defaultMonth = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, '0')}`;
        setSelectedMonth(defaultMonth);
        const [year, month] = defaultMonth.split('-').map(Number);
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0);
      } else {
        const parts = selectedMonth.split('-');
        if (parts.length === 2 && parts[0] && parts[1]) {
          const [year, month] = parts.map(Number);
          if (!isNaN(year) && !isNaN(month) && month >= 1 && month <= 12) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0);
          } else {
            // Invalid date, use current month
            const defaultMonth = `${now.getFullYear()}-${String(
              now.getMonth() + 1
            ).padStart(2, '0')}`;
            setSelectedMonth(defaultMonth);
            const [y, m] = defaultMonth.split('-').map(Number);
            startDate = new Date(y, m - 1, 1);
            endDate = new Date(y, m, 0);
          }
        } else {
          // Invalid format, use current month
          const defaultMonth = `${now.getFullYear()}-${String(
            now.getMonth() + 1
          ).padStart(2, '0')}`;
          setSelectedMonth(defaultMonth);
          const [y, m] = defaultMonth.split('-').map(Number);
          startDate = new Date(y, m - 1, 1);
          endDate = new Date(y, m, 0);
        }
      }
    } else if (range === 'yearly') {
      // Yearly view: Show 12 months of selected year
      const year = parseInt(selectedYear);
      if (
        !selectedYear ||
        isNaN(year) ||
        year < 2020 ||
        year > now.getFullYear() + 1
      ) {
        // Invalid year, use current year
        const defaultYear = now.getFullYear().toString();
        setSelectedYear(defaultYear);
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
      } else {
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31);
      }
    } else {
      // Default to current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  };

  const dateParams = getDateRange(dateRange);

  // Map UI range to backend groupBy values
  const groupByMap = {
    monthly: 'day', // Monthly view shows days
    yearly: 'month', // Yearly view shows months
  };

  // Fetch sales reports data
  const { data: salesReportsData, isLoading: salesReportsLoading } =
    useSalesReports({
      startDate: dateParams.startDate,
      endDate: dateParams.endDate,
      groupBy: groupByMap[dateRange] || 'day',
    });

  // Fetch purchase reports data
  const { data: purchaseReportsData, isLoading: purchaseReportsLoading } =
    usePurchaseReports({
      startDate: dateParams.startDate,
      endDate: dateParams.endDate,
      groupBy: groupByMap[dateRange] || 'day',
    });

  // Fetch expense categories (for filter dropdown)
  const { data: expenseCategoriesData } = useCategoriesByType('expense');

  // Fetch account balances data
  const { data: accountBalancesData } = useAccountBalances();

  // Fetch cash flow report data
  const { data: cashFlowData, isLoading: cashFlowLoading } = useCashFlowReport({
    startDate: dateParams.startDate,
    endDate: dateParams.endDate,
    groupBy: groupByMap[dateRange] || 'day',
  });

  // Fetch stock report data
  const { data: stockReportData, isLoading: stockReportLoading } = useStockReport({
    location: selectedStockLocation === 'all' ? undefined : selectedStockLocation,
    stockLevel: selectedStockLevel === 'all' ? undefined : selectedStockLevel,
  });

  // Fetch expense summary data
  const { data: expenseSummaryData, isLoading: expenseSummaryLoading } =
    useExpenseSummary({
      startDate: dateParams.startDate,
      endDate: dateParams.endDate,
      groupBy: groupByMap[dateRange] || 'day',
      category: selectedExpenseCategory || undefined, // Only include if category is selected
    });

  // Fetch profit data
  const { data: netProfitData, isLoading: netProfitLoading } = useNetProfit({
    startDate: dateParams.startDate,
    endDate: dateParams.endDate,
  });

  const { isLoading: profitStatsLoading } = useProfitStats({
    startDate: dateParams.startDate,
    endDate: dateParams.endDate,
  });

  const { data: profitSummaryData, isLoading: profitSummaryLoading } =
    useProfitSummary({
      startDate: dateParams.startDate,
      endDate: dateParams.endDate,
      groupBy: groupByMap[dateRange] || 'day',
    });

  // Note: inventoryData will be fetched from API in future

  // Generate all periods in date range and merge with API data
  const chartData = useMemo(() => {
    if (selectedReport !== 'sales' || !salesReportsData?.data) return [];

    const { startDate, endDate } = dateParams;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get API data
    const apiData = salesReportsData.data.summary || [];

    // Create map of API data by date key
    const apiMap = new Map();
    apiData.forEach((item) => {
      const key = item.date || item.period || '';
      apiMap.set(key, {
        date: key,
        sales: parseFloat(item.sales) || 0,
        paid: parseFloat(item.paid) || 0,
        due: parseFloat(item.due) || 0,
        count: parseInt(item.count) || 0,
      });
    });

    // Generate all periods in range
    const allPeriods = [];

    if (dateRange === 'monthly') {
      // Monthly view: Generate all days of the selected month
      let current = new Date(start);
      while (current <= end) {
        const dateKey = `${current.getFullYear()}-${String(
          current.getMonth() + 1
        ).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
        allPeriods.push({
          date: `${current.getDate()}`, // Show day number
          fullDate: dateKey, // Keep for matching with API
          sales: apiMap.get(dateKey)?.sales || 0,
          paid: apiMap.get(dateKey)?.paid || 0,
          due: apiMap.get(dateKey)?.due || 0,
          count: apiMap.get(dateKey)?.count || 0,
        });
        current.setDate(current.getDate() + 1);
      }
    } else if (dateRange === 'yearly') {
      // Yearly view: Generate all 12 months
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const monthNamesPersian = [
        'جنوری',
        'فبروری',
        'مارچ',
        'اپریل',
        'می',
        'جون',
        'جولای',
        'آگست',
        'سپتامبر',
        'اکتبر',
        'نومبر',
        'دسمبر',
      ];

      for (let month = 0; month < 12; month++) {
        const monthKey = `${monthNames[month]} ${parseInt(selectedYear)}`;
        const apiItem = apiMap.get(monthKey);
        allPeriods.push({
          date: monthNamesPersian[month],
          fullDate: monthKey,
          sales: apiItem ? parseFloat(apiItem.sales) : 0,
          paid: apiItem ? parseFloat(apiItem.paid) : 0,
          due: apiItem ? parseFloat(apiItem.due) : 0,
          count: apiItem ? parseInt(apiItem.count) : 0,
        });
      }
    }

    return allPeriods;
  }, [salesReportsData, selectedReport, dateRange, dateParams, selectedYear]);

  // Chart data for profit reports - generate all periods like sales
  const profitChartData = useMemo(() => {
    if (selectedReport !== 'profit' || !profitSummaryData?.data) return [];

    const { startDate, endDate } = dateParams;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get API data
    const apiData = profitSummaryData.data.summary || [];

    // Create map of API data by period key
    const apiMap = new Map();
    apiData.forEach((item) => {
      const key = item.period || '';
      apiMap.set(key, {
        period: key,
        grossProfit: parseFloat(item.grossProfit) || 0,
        otherIncome: parseFloat(item.otherIncome) || 0,
        expenses: parseFloat(item.expenses) || 0,
        netProfit: parseFloat(item.netProfit) || 0,
      });
    });

    // Generate all periods in range
    const allPeriods = [];

    if (dateRange === 'monthly') {
      // Monthly view: Generate all days of the selected month
      let current = new Date(start);
      while (current <= end) {
        const dateKey = `${current.getFullYear()}-${String(
          current.getMonth() + 1
        ).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
        const apiItem = apiMap.get(dateKey);
        allPeriods.push({
          period: `${current.getDate()}`, // Show day number
          fullDate: dateKey,
          grossProfit: apiItem ? parseFloat(apiItem.grossProfit) : 0,
          otherIncome: apiItem ? parseFloat(apiItem.otherIncome) : 0,
          expenses: apiItem ? parseFloat(apiItem.expenses) : 0,
          netProfit: apiItem ? parseFloat(apiItem.netProfit) : 0,
        });
        current.setDate(current.getDate() + 1);
      }
    } else if (dateRange === 'yearly') {
      // Yearly view: Generate all 12 months
      // Profit API uses YYYY-MM format for monthly grouping
      const monthNamesPersian = [
        'جنوری',
        'فبروری',
        'مارچ',
        'اپریل',
        'می',
        'جون',
        'جولای',
        'آگست',
        'سپتامبر',
        'اکتبر',
        'نومبر',
        'دسمبر',
      ];

      const year = parseInt(selectedYear);
      for (let month = 1; month <= 12; month++) {
        const monthKey = `${year}-${String(month).padStart(2, '0')}`; // Format: YYYY-MM
        const apiItem = apiMap.get(monthKey);
        allPeriods.push({
          period: monthNamesPersian[month - 1],
          fullDate: monthKey,
          grossProfit: apiItem ? parseFloat(apiItem.grossProfit) : 0,
          otherIncome: apiItem ? parseFloat(apiItem.otherIncome) : 0,
          expenses: apiItem ? parseFloat(apiItem.expenses) : 0,
          netProfit: apiItem ? parseFloat(apiItem.netProfit) : 0,
        });
      }
    }

    return allPeriods;
  }, [profitSummaryData, selectedReport, dateRange, dateParams, selectedYear]);

  // Chart data for purchase reports - generate all periods like sales
  const purchaseChartData = useMemo(() => {
    if (selectedReport !== 'purchases' || !purchaseReportsData?.data) return [];

    const { startDate, endDate } = dateParams;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get API data
    const apiData = purchaseReportsData.data.summary || [];

    // Create map of API data by date key
    const apiMap = new Map();
    apiData.forEach((item) => {
      const key = item.date || item.period || '';
      apiMap.set(key, {
        date: key,
        purchases: parseFloat(item.purchases) || 0,
        paid: parseFloat(item.paid) || 0,
        due: parseFloat(item.due) || 0,
        count: parseInt(item.count) || 0,
      });
    });

    // Generate all periods in range
    const allPeriods = [];

    if (dateRange === 'monthly') {
      // Monthly view: Generate all days of the selected month
      let current = new Date(start);
      while (current <= end) {
        const dateKey = `${current.getFullYear()}-${String(
          current.getMonth() + 1
        ).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
        allPeriods.push({
          date: `${current.getDate()}`, // Show day number
          fullDate: dateKey, // Keep for matching with API
          purchases: apiMap.get(dateKey)?.purchases || 0,
          paid: apiMap.get(dateKey)?.paid || 0,
          due: apiMap.get(dateKey)?.due || 0,
          count: apiMap.get(dateKey)?.count || 0,
        });
        current.setDate(current.getDate() + 1);
      }
    } else if (dateRange === 'yearly') {
      // Yearly view: Generate all 12 months
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const monthNamesPersian = [
        'جنوری',
        'فبروری',
        'مارچ',
        'اپریل',
        'می',
        'جون',
        'جولای',
        'آگست',
        'سپتامبر',
        'اکتبر',
        'نومبر',
        'دسمبر',
      ];

      for (let month = 0; month < 12; month++) {
        const monthKey = `${monthNames[month]} ${parseInt(selectedYear)}`;
        const apiItem = apiMap.get(monthKey);
        allPeriods.push({
          date: monthNamesPersian[month],
          fullDate: monthKey,
          purchases: apiItem ? parseFloat(apiItem.purchases) : 0,
          paid: apiItem ? parseFloat(apiItem.paid) : 0,
          due: apiItem ? parseFloat(apiItem.due) : 0,
          count: apiItem ? parseInt(apiItem.count) : 0,
        });
      }
    }

    return allPeriods;
  }, [
    purchaseReportsData,
    selectedReport,
    dateRange,
    dateParams,
    selectedYear,
  ]);

  // Chart data for expense reports - generate all periods like sales
  const expenseChartData = useMemo(() => {
    if (selectedReport !== 'expenses' || !expenseSummaryData?.data) return [];

    const { startDate, endDate } = dateParams;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get API data
    const apiData = expenseSummaryData.data.summary || [];

    // Create map of API data by date key
    const apiMap = new Map();
    apiData.forEach((item) => {
      const key = item.date || item.period || '';
      apiMap.set(key, {
        date: key,
        expenses: parseFloat(item.expenses) || 0,
        count: parseInt(item.count) || 0,
      });
    });

    // Generate all periods in range
    const allPeriods = [];

    if (dateRange === 'monthly') {
      // Monthly view: Generate all days of the selected month
      let current = new Date(start);
      while (current <= end) {
        const dateKey = `${current.getFullYear()}-${String(
          current.getMonth() + 1
        ).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
        allPeriods.push({
          date: `${current.getDate()}`, // Show day number
          fullDate: dateKey, // Keep for matching with API
          expenses: apiMap.get(dateKey)?.expenses || 0,
          count: apiMap.get(dateKey)?.count || 0,
        });
        current.setDate(current.getDate() + 1);
      }
    } else if (dateRange === 'yearly') {
      // Yearly view: Generate all 12 months
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const monthNamesPersian = [
        'جنوری',
        'فبروری',
        'مارچ',
        'اپریل',
        'می',
        'جون',
        'جولای',
        'آگست',
        'سپتامبر',
        'اکتبر',
        'نومبر',
        'دسمبر',
      ];

      for (let month = 0; month < 12; month++) {
        const monthKey = `${monthNames[month]} ${parseInt(selectedYear)}`;
        const apiItem = apiMap.get(monthKey);
        allPeriods.push({
          date: monthNamesPersian[month],
          fullDate: monthKey,
          expenses: apiItem ? parseFloat(apiItem.expenses) : 0,
          count: apiItem ? parseInt(apiItem.count) : 0,
        });
      }
    }

    return allPeriods;
  }, [expenseSummaryData, selectedReport, dateRange, dateParams, selectedYear]);

  // Chart data for cash flow reports - generate all periods like sales
  const cashFlowChartData = useMemo(() => {
    if (selectedReport !== 'accounts' || !cashFlowData?.data) return [];
    
    const { startDate, endDate } = dateParams;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Get API data
    const apiData = cashFlowData.data.summary || [];
    
    // Create map of API data by date key
    const apiMap = new Map();
    apiData.forEach((item) => {
      const key = item.date || item.period || '';
      apiMap.set(key, {
        date: key,
        moneyIn: parseFloat(item.moneyIn) || 0,
        moneyOut: parseFloat(item.moneyOut) || 0,
        netFlow: parseFloat(item.netFlow) || 0,
        transactionCount: parseInt(item.transactionCount) || 0,
      });
    });
    
    // Generate all periods in range
    const allPeriods = [];
    
    if (dateRange === 'monthly') {
      // Monthly view: Generate all days of the selected month
      let current = new Date(start);
      while (current <= end) {
        const dateKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
        allPeriods.push({
          date: `${current.getDate()}`, // Show day number
          fullDate: dateKey, // Keep for matching with API
          moneyIn: apiMap.get(dateKey)?.moneyIn || 0,
          moneyOut: apiMap.get(dateKey)?.moneyOut || 0,
          netFlow: apiMap.get(dateKey)?.netFlow || 0,
          transactionCount: apiMap.get(dateKey)?.transactionCount || 0,
        });
        current.setDate(current.getDate() + 1);
      }
    } else if (dateRange === 'yearly') {
      // Yearly view: Generate all 12 months
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthNamesPersian = [
        'جنوری', 'فبروری', 'مارچ', 'اپریل', 'می', 'جون',
        'جولای', 'آگست', 'سپتامبر', 'اکتبر', 'نومبر', 'دسمبر'
      ];
      
      for (let month = 0; month < 12; month++) {
        const monthKey = `${monthNames[month]} ${parseInt(selectedYear)}`;
        const apiItem = apiMap.get(monthKey);
        allPeriods.push({
          date: monthNamesPersian[month],
          fullDate: monthKey,
          moneyIn: apiItem ? parseFloat(apiItem.moneyIn) : 0,
          moneyOut: apiItem ? parseFloat(apiItem.moneyOut) : 0,
          netFlow: apiItem ? parseFloat(apiItem.netFlow) : 0,
          transactionCount: apiItem ? parseInt(apiItem.transactionCount) : 0,
        });
      }
    }
    
    return allPeriods;
  }, [cashFlowData, selectedReport, dateRange, dateParams, selectedYear]);

  // System colors for charts
  const chartColors = {
    sales: '#10B981', // green-500
    purchases: '#F59E0B', // amber-500 (orange)
    expenses: '#EF4444', // red-500
    moneyIn: '#10B981', // green-500
    moneyOut: '#EF4444', // red-500
    paid: '#3B82F6', // blue-500
    due: '#EF4444', // red-500
  };

  // Note: getStatusColor was used for inventory report, but inventory is not yet implemented

  return (
    <div className='space-y-6'>
      {/* Page header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-xl font-bold text-gray-900'>گزارشات وتحلیل ها</h1>
          <p className='text-gray-600 mt-1'>
            گزارشات تجاری را تولید و مشاهده کنید
          </p>
        </div>
      </div>

      {/* Report type selector */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          نوع گزارش را انتخاب کنید
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => {
                  setSelectedReport(report.id);
                  // Reset filters when switching reports
                  if (report.id !== 'expenses') {
                    setSelectedExpenseCategory('');
                  }
                  if (report.id !== 'inventory') {
                    setSelectedStockLocation('all');
                    setSelectedStockLevel('low');
                  }
                }}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedReport === report.id
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Icon className='h-8 w-8 mx-auto mb-2' />
                <p className='text-sm font-medium'>{report.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary cards for Sales - Moved to top */}
      {selectedReport === 'sales' && salesReportsData?.data?.totals && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-green-500'>
                <ChartBarIcon className='h-6 w-6 text-white' />
              </div>
              <div className='mr-4'>
                <p className='text-sm font-medium text-gray-600'>مجموع فروش</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(salesReportsData.data.totals.totalSales || 0)}
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
                <p className='text-sm font-medium text-gray-600'>
                  مجموع پرداخت شده
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(salesReportsData.data.totals.totalPaid || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-red-500'>
                <ChartBarIcon className='h-6 w-6 text-white' />
              </div>
              <div className='mr-4'>
                <p className='text-sm font-medium text-gray-600'>مجموع بدهی</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(salesReportsData.data.totals.totalDue || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary cards for Purchases - Moved to top */}
      {selectedReport === 'purchases' && purchaseReportsData?.data?.totals && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-orange-500'>
                <ChartBarIcon className='h-6 w-6 text-white' />
              </div>
              <div className='mr-4'>
                <p className='text-sm font-medium text-gray-600'>
                  مجموع خریداری
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(
                    purchaseReportsData.data.totals.totalPurchases || 0
                  )}
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
                <p className='text-sm font-medium text-gray-600'>
                  مجموع پرداخت شده
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(
                    purchaseReportsData.data.totals.totalPaid || 0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-red-500'>
                <ChartBarIcon className='h-6 w-6 text-white' />
              </div>
              <div className='mr-4'>
                <p className='text-sm font-medium text-gray-600'>مجموع بدهی</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(
                    purchaseReportsData.data.totals.totalDue || 0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary cards for Expenses - Moved to top */}
      {selectedReport === 'expenses' && expenseSummaryData?.data?.totals && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-red-500'>
                <ChartBarIcon className='h-6 w-6 text-white' />
              </div>
              <div className='mr-4'>
                <p className='text-sm font-medium text-gray-600'>
                  مجموع هزینه ها
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(
                    expenseSummaryData.data.totals.totalExpenses || 0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-gray-500'>
                <ChartBarIcon className='h-6 w-6 text-white' />
              </div>
              <div className='mr-4'>
                <p className='text-sm font-medium text-gray-600'>
                  تعداد هزینه ها
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatNumber(expenseSummaryData.data.totals.totalCount || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary cards for Account Balances - Moved to top */}
      {selectedReport === 'accounts' && accountBalancesData?.data && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-green-500'>
                <ChartBarIcon className='h-6 w-6 text-white' />
              </div>
              <div className='mr-4'>
                <p className='text-sm font-medium text-gray-600'>مجموع حساب‌های نقدی</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(accountBalancesData.data.summary.totalCashAccounts || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-red-500'>
                <ChartBarIcon className='h-6 w-6 text-white' />
              </div>
              <div className='mr-4'>
                <p className='text-sm font-medium text-gray-600'>مجموع بدهی به تاجران</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(accountBalancesData.data.summary.totalSupplierDebt || 0)}
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
                <p className='text-sm font-medium text-gray-600'>مجموع طلب از مشتریان</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(accountBalancesData.data.summary.totalCustomerCredit || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className={`p-3 rounded-full ${
                (accountBalancesData.data.summary.netPosition || 0) >= 0
                  ? 'bg-emerald-500'
                  : 'bg-red-500'
              }`}>
                <ChartBarIcon className='h-6 w-6 text-white' />
              </div>
              <div className='mr-4'>
                <p className='text-sm font-medium text-gray-600'>موقعیت خالص</p>
                <p className={`text-2xl font-bold ${
                  (accountBalancesData.data.summary.netPosition || 0) >= 0
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}>
                  {formatCurrency(accountBalancesData.data.summary.netPosition || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary cards for Profit - Moved to top (above date selector, like sales) */}
      {selectedReport === 'profit' && netProfitData?.data && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-blue-500'>
                <ChartBarIcon className='h-6 w-6 text-white' />
              </div>
              <div className='mr-4'>
                <p className='text-sm font-medium text-gray-600'>سود ناخالص</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatNumber(netProfitData.data.grossProfit || 0)} افغانی
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-green-500'>
                <ChartBarIcon className='h-6 w-6 text-white' />
              </div>
              <div className='mr-4'>
                <p className='text-sm font-medium text-gray-600'>درآمد دیگر</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatNumber(netProfitData.data.otherIncome || 0)} افغانی
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 rounded-full bg-red-500'>
                <ChartBarIcon className='h-6 w-6 text-white' />
              </div>
              <div className='mr-4'>
                <p className='text-sm font-medium text-gray-600'>هزینه ها</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatNumber(netProfitData.data.expenses || 0)} افغانی
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div
                className={`p-3 rounded-full ${
                  (netProfitData.data.netProfit || 0) >= 0
                    ? 'bg-emerald-500'
                    : 'bg-red-500'
                }`}
              >
                <ChartBarIcon className='h-6 w-6 text-white' />
              </div>
              <div className='mr-4'>
                <p className='text-sm font-medium text-gray-600'>سود خالص</p>
                <p
                  className={`text-2xl font-bold ${
                    (netProfitData.data.netProfit || 0) >= 0
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  {formatNumber(netProfitData.data.netProfit || 0)} افغانی
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date range selector - Hide for inventory report */}
      {selectedReport !== 'inventory' && (
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            نوع گزارش و تاریخ را انتخاب کنید
          </h3>
        <div className='flex flex-wrap justify-between items-end gap-4'>
          <div className='flex flex-wrap items-end gap-4'>
            <div className='flex space-x-4'>
              <button
                onClick={() => setDateRange('monthly')}
                className={`px-4 py-2 rounded-lg border ${
                  dateRange === 'monthly'
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                ماهانه (روزها)
              </button>
              <button
                onClick={() => setDateRange('yearly')}
                className={`px-4 py-2 rounded-lg border ${
                  dateRange === 'yearly'
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                سالانه (ماه‌ها)
              </button>
            </div>

            {dateRange === 'monthly' && (
              <div>
                <label className='block mb-2 text-sm font-medium text-gray-700'>
                  انتخاب ماه
                </label>
                <input
                  type='month'
                  value={selectedMonth || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      setSelectedMonth(value);
                    } else {
                      // If cleared, reset to current month
                      const now = new Date();
                      setSelectedMonth(
                        `${now.getFullYear()}-${String(
                          now.getMonth() + 1
                        ).padStart(2, '0')}`
                      );
                    }
                  }}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      const now = new Date();
                      setSelectedMonth(
                        `${now.getFullYear()}-${String(
                          now.getMonth() + 1
                        ).padStart(2, '0')}`
                      );
                    }
                  }}
                  className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                  required
                />
              </div>
            )}

            {dateRange === 'yearly' && (
              <div>
                <label className='block mb-2 text-sm font-medium text-gray-700'>
                  انتخاب سال
                </label>
                <input
                  type='number'
                  min='2020'
                  max={new Date().getFullYear() + 1}
                  value={selectedYear || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value && !isNaN(parseInt(value))) {
                      setSelectedYear(value);
                    } else {
                      // If cleared or invalid, reset to current year
                      setSelectedYear(new Date().getFullYear().toString());
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (!value || isNaN(parseInt(value))) {
                      setSelectedYear(new Date().getFullYear().toString());
                    }
                  }}
                  className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 w-32'
                  placeholder='سال'
                  required
                />
              </div>
            )}
          </div>

          {/* Category filter for expenses - Only show when expenses report is selected, placed on left */}
          {selectedReport === 'expenses' && expenseCategoriesData?.data && (
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-700'>
                دسته بندی هزینه
              </label>
              <select
                value={selectedExpenseCategory}
                onChange={(e) => setSelectedExpenseCategory(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white min-w-[180px]'
              >
                <option value=''>همه دسته بندی‌ها</option>
                {expenseCategoriesData.data.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        </div>
      )}

      {/* Report content */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-semibold text-gray-900'>
            {reportTypes.find((r) => r.id === selectedReport)?.name}
            {selectedReport !== 'inventory' && (
              <>
                {' - '}
                {dateRange === 'monthly'
                  ? `ماهانه (${new Date(selectedMonth + '-01').toLocaleDateString(
                      'fa-IR',
                      { year: 'numeric', month: 'long' }
                    )})`
                  : `سالانه (${selectedYear})`}
              </>
            )}
          </h3>
        </div>

        <div className='p-6'>
          {selectedReport === 'sales' && (
            <div className='space-y-6'>
              {salesReportsLoading ? (
                <div className='text-center text-gray-500 py-12'>
                  در حال بارگذاری داده های فروش...
                </div>
              ) : !salesReportsData?.data ? (
                <div className='text-center text-gray-500 py-12'>
                  داده‌ای برای نمایش وجود ندارد
                </div>
              ) : chartData.length === 0 ? (
                <div className='text-center text-gray-500 py-12'>
                  هیچ داده فروشی برای دوره انتخاب شده یافت نشد.
                </div>
              ) : (
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h4 className='text-lg font-semibold text-gray-900 mb-4'>
                    روند فروش
                  </h4>
                  <ResponsiveContainer width='100%' height={400}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis
                        dataKey='date'
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor='end'
                        height={80}
                        interval={0}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => formatNumber(value)}
                      />
                      <Tooltip
                        formatter={(value) => [
                          `${formatNumber(parseFloat(value))} افغانی`,
                          'فروش',
                        ]}
                        labelStyle={{ color: '#374151' }}
                      />
                      <Legend />
                      <Bar
                        dataKey='sales'
                        fill={chartColors.sales}
                        name='فروش'
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {selectedReport === 'purchases' && (
            <div className='space-y-6'>
              {purchaseReportsLoading ? (
                <div className='text-center text-gray-500 py-12'>
                  در حال بارگذاری داده های خریداری...
                </div>
              ) : !purchaseReportsData?.data ? (
                <div className='text-center text-gray-500 py-12'>
                  داده‌ای برای نمایش وجود ندارد
                </div>
              ) : purchaseChartData.length === 0 ? (
                <div className='text-center text-gray-500 py-12'>
                  هیچ داده خریداری برای دوره انتخاب شده یافت نشد.
                </div>
              ) : (
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h4 className='text-lg font-semibold text-gray-900 mb-4'>
                    روند خریداری
                  </h4>
                  <ResponsiveContainer width='100%' height={400}>
                    <BarChart data={purchaseChartData}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis
                        dataKey='date'
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor='end'
                        height={80}
                        interval={0}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => formatNumber(value)}
                      />
                      <Tooltip
                        formatter={(value) => [
                          `${formatNumber(parseFloat(value))} افغانی`,
                          'خریداری',
                        ]}
                        labelStyle={{ color: '#374151' }}
                      />
                      <Legend />
                      <Bar
                        dataKey='purchases'
                        fill={chartColors.purchases}
                        name='خریداری'
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {selectedReport === 'expenses' && (
            <div className='space-y-6'>
              {expenseSummaryLoading ? (
                <div className='text-center text-gray-500 py-12'>
                  در حال بارگذاری داده های هزینه...
                </div>
              ) : !expenseSummaryData?.data ? (
                <div className='text-center text-gray-500 py-12'>
                  داده‌ای برای نمایش وجود ندارد
                </div>
              ) : expenseChartData.length === 0 ? (
                <div className='text-center text-gray-500 py-12'>
                  هیچ داده هزینه برای دوره انتخاب شده یافت نشد.
                </div>
              ) : (
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h4 className='text-lg font-semibold text-gray-900 mb-4'>
                    روند هزینه ها
                  </h4>
                  <ResponsiveContainer width='100%' height={400}>
                    <BarChart data={expenseChartData}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis
                        dataKey='date'
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor='end'
                        height={80}
                        interval={0}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          if (value === undefined || value === null) return '٠';
                          const num =
                            typeof value === 'number'
                              ? value
                              : parseFloat(String(value));
                          if (isNaN(num)) return '٠';
                          return formatNumber(num);
                        }}
                      />
                      <Tooltip
                        formatter={(value) => [
                          `${formatNumber(parseFloat(value))} افغانی`,
                          'هزینه',
                        ]}
                        labelStyle={{ color: '#374151' }}
                      />
                      <Legend />
                      <Bar
                        dataKey='expenses'
                        fill={chartColors.expenses}
                        name='هزینه'
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {selectedReport === 'accounts' && (
            <div className='space-y-6'>
              {cashFlowLoading ? (
                <div className='text-center text-gray-500 py-12'>
                  در حال بارگذاری داده های جریان نقدی...
                </div>
              ) : !cashFlowData?.data ? (
                <div className='text-center text-gray-500 py-12'>
                  داده‌ای برای نمایش وجود ندارد
                </div>
              ) : cashFlowChartData.length === 0 ? (
                <div className='text-center text-gray-500 py-12'>
                  هیچ داده جریان نقدی برای دوره انتخاب شده یافت نشد.
                </div>
              ) : (
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h4 className='text-lg font-semibold text-gray-900 mb-4'>
                    روند جریان نقدی (پول ورودی و خروجی)
                  </h4>
                  {cashFlowData.data.totals && (
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                      <div className='bg-white p-4 rounded-lg border border-gray-200'>
                        <p className='text-sm text-gray-600'>مجموع ورودی</p>
                        <p className='text-xl font-bold text-green-600'>
                          {formatCurrency(cashFlowData.data.totals.totalIn || 0)}
                        </p>
                      </div>
                      <div className='bg-white p-4 rounded-lg border border-gray-200'>
                        <p className='text-sm text-gray-600'>مجموع خروجی</p>
                        <p className='text-xl font-bold text-red-600'>
                          {formatCurrency(cashFlowData.data.totals.totalOut || 0)}
                        </p>
                      </div>
                      <div className='bg-white p-4 rounded-lg border border-gray-200'>
                        <p className='text-sm text-gray-600'>جریان خالص</p>
                        <p className={`text-xl font-bold ${
                          (cashFlowData.data.totals.netFlow || 0) >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {formatCurrency(cashFlowData.data.totals.netFlow || 0)}
                        </p>
                      </div>
                    </div>
                  )}
                  <ResponsiveContainer width='100%' height={400}>
                    <BarChart data={cashFlowChartData}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis
                        dataKey='date'
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor='end'
                        height={80}
                        interval={0}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          if (value === undefined || value === null) return '٠';
                          const num =
                            typeof value === 'number'
                              ? value
                              : parseFloat(String(value));
                          if (isNaN(num)) return '٠';
                          return formatNumber(num);
                        }}
                      />
                      <Tooltip
                        formatter={(value, name) => {
                          const num = typeof value === 'number' ? value : parseFloat(value);
                          return [
                            `${formatNumber(num)} افغانی`,
                            name === 'moneyIn' ? 'پول ورودی' : name === 'moneyOut' ? 'پول خروجی' : 'جریان خالص',
                          ];
                        }}
                        labelStyle={{ color: '#374151' }}
                      />
                      <Legend />
                      <Bar
                        dataKey='moneyIn'
                        fill={chartColors.moneyIn}
                        name='پول ورودی'
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey='moneyOut'
                        fill={chartColors.moneyOut}
                        name='پول خروجی'
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {selectedReport === 'inventory' && (
            <div className='space-y-6'>
              {/* Filter buttons */}
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  فیلترها
                </h3>
                
                {/* Location filter buttons */}
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    مکان
                  </label>
                  <div className='flex space-x-3'>
                    <button
                      onClick={() => setSelectedStockLocation('all')}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedStockLocation === 'all'
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      همه
                    </button>
                    <button
                      onClick={() => setSelectedStockLocation('store')}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedStockLocation === 'store'
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      فروشگاه
                    </button>
                    <button
                      onClick={() => setSelectedStockLocation('warehouse')}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedStockLocation === 'warehouse'
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      گدام
                    </button>
                  </div>
                </div>

                {/* Stock level filter buttons */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    سطح موجودی
                  </label>
                  <div className='flex space-x-3'>
                    <button
                      onClick={() => setSelectedStockLevel('all')}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedStockLevel === 'all'
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      همه
                    </button>
                    <button
                      onClick={() => setSelectedStockLevel('low')}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedStockLevel === 'low'
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      موجودی کم
                    </button>
                    <button
                      onClick={() => setSelectedStockLevel('critical')}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedStockLevel === 'critical'
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      بحرانی کم
                    </button>
                    <button
                      onClick={() => setSelectedStockLevel('out')}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedStockLevel === 'out'
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      تمام شده
                    </button>
                  </div>
                </div>
              </div>

              {/* Stock items list */}
              {stockReportLoading ? (
                <div className='text-center text-gray-500 py-12'>
                  در حال بارگذاری داده های موجودی...
                </div>
              ) : !stockReportData?.data ? (
                <div className='text-center text-gray-500 py-12'>
                  داده‌ای برای نمایش وجود ندارد
                </div>
              ) : stockReportData.data.stocks.length === 0 ? (
                <div className='text-center text-gray-500 py-12'>
                  هیچ موجودی برای فیلتر انتخاب شده یافت نشد.
                </div>
              ) : (
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            محصول
                          </th>
                          <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            مکان
                          </th>
                          <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            موجودی
                          </th>
                          <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            حداقل
                          </th>
                          <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            وضعیت
                          </th>
                          <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            ارزش
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {stockReportData.data.stocks.map((stock) => (
                          <tr key={stock._id} className='hover:bg-gray-50'>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-sm font-medium text-gray-900'>
                                {stock.product?.name || 'نامشخص'}
                              </div>
                              {stock.batchNumber && stock.batchNumber !== 'DEFAULT' && (
                                <div className='text-xs text-gray-500'>
                                  Batch: {stock.batchNumber}
                                </div>
                              )}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                stock.location === 'warehouse'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {stock.location === 'warehouse' ? 'گدام' : 'فروشگاه'}
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              {formatNumber(stock.quantity)} {stock.unit?.name || ''}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              {formatNumber(stock.minLevel || 0)} {stock.unit?.name || ''}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                stock.status === 'out'
                                  ? 'bg-red-100 text-red-800'
                                  : stock.status === 'critical'
                                  ? 'bg-orange-100 text-orange-800'
                                  : stock.status === 'low'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {stock.status === 'out'
                                  ? 'تمام شده'
                                  : stock.status === 'critical'
                                  ? 'بحرانی کم'
                                  : stock.status === 'low'
                                  ? 'موجودی کم'
                                  : 'عادی'}
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              {formatCurrency(stock.stockValue || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedReport === 'profit' && (
            <div className='space-y-6'>
              {profitSummaryLoading ||
              netProfitLoading ||
              profitStatsLoading ? (
                <div className='text-center text-gray-500 py-12'>
                  در حال بارگذاری داده های سود و زیان...
                </div>
              ) : !profitSummaryData?.data ? (
                <div className='text-center text-gray-500 py-12'>
                  داده‌ای برای نمایش وجود ندارد
                </div>
              ) : profitChartData.length === 0 ? (
                <div className='text-center text-gray-500 py-12'>
                  هیچ داده سود و زیانی برای دوره انتخاب شده یافت نشد.
                </div>
              ) : (
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <div className='flex justify-between items-center mb-4'>
                    <h4 className='text-lg font-semibold text-gray-900'>
                      {profitChartType === 'net'
                        ? 'روند سود خالص'
                        : 'روند سود ناخالص'}
                    </h4>
                    <div className='flex space-x-2'>
                      <button
                        onClick={() => setProfitChartType('gross')}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          profitChartType === 'gross'
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        سود ناخالص
                      </button>
                      <button
                        onClick={() => setProfitChartType('net')}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          profitChartType === 'net'
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        سود خالص
                      </button>
                    </div>
                  </div>
                  <ResponsiveContainer width='100%' height={400}>
                    <BarChart data={profitChartData}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis
                        dataKey='period'
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor='end'
                        height={80}
                        interval={0}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          if (value === undefined || value === null) return '٠';
                          const num =
                            typeof value === 'number'
                              ? value
                              : parseFloat(String(value));
                          if (isNaN(num)) return '٠';
                          return formatNumber(num);
                        }}
                      />
                      <Tooltip
                        formatter={(value) => {
                          const num =
                            typeof value === 'number'
                              ? value
                              : parseFloat(value);
                          return [
                            `${formatNumber(num)} افغانی`,
                            profitChartType === 'net'
                              ? 'سود خالص'
                              : 'سود ناخالص',
                          ];
                        }}
                        labelStyle={{ color: '#374151' }}
                      />
                      <Legend />
                      <Bar
                        dataKey={
                          profitChartType === 'net'
                            ? 'netProfit'
                            : 'grossProfit'
                        }
                        name={
                          profitChartType === 'net' ? 'سود خالص' : 'سود ناخالص'
                        }
                        radius={[4, 4, 0, 0]}
                      >
                        {profitChartData.map((entry, index) => {
                          const value =
                            profitChartType === 'net'
                              ? entry.netProfit
                              : entry.grossProfit;
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={value >= 0 ? '#10B981' : '#EF4444'}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {!['sales', 'inventory', 'profit', 'purchases', 'expenses', 'accounts'].includes(
            selectedReport
          ) && (
            <div className='text-center py-12'>
              <ChartBarIcon className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {reportTypes.find((r) => r.id === selectedReport)?.name} به زودی
              </h3>
              <p className='text-gray-600'>
                این نوع گزارش در حال توسعه است و به زودی در دسترس خواهد بود.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
