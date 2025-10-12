import { useState, useEffect } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingStorefrontIcon,
  BuildingOffice2Icon,
  ArrowPathIcon,
  ChartBarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Inventory = () => {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Selected product and transfer state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [transferQuantity, setTransferQuantity] = useState("");

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    sku: "",
    warehouseStock: 0,
    storeStock: 0,
    unitPrice: 0,
    minStockLevel: 10,
    expiryDate: "",
    description: "",
  });

  // Products data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Fresh Dates - Medjool",
      category: "Dates",
      sku: "FD001",
      warehouseStock: 150,
      storeStock: 45,
      unitPrice: 15.99,
      minStockLevel: 30,
      status: "In Stock",
      expiryDate: "2025-12-31",
      lastUpdated: new Date().toISOString(),
      description: "Premium quality Medjool dates",
    },
    {
      id: 2,
      name: "Chickpeas - Organic",
      category: "Grains",
      sku: "CP002",
      warehouseStock: 200,
      storeStock: 80,
      unitPrice: 8.5,
      minStockLevel: 50,
      status: "In Stock",
      expiryDate: "2026-06-30",
      lastUpdated: new Date().toISOString(),
      description: "Organic chickpeas from local farms",
    },
    {
      id: 3,
      name: "Cake Mix - Chocolate",
      category: "Bakery",
      sku: "CM003",
      warehouseStock: 25,
      storeStock: 5,
      unitPrice: 12.99,
      minStockLevel: 40,
      status: "Low Stock",
      expiryDate: "2025-08-15",
      lastUpdated: new Date().toISOString(),
      description: "Premium chocolate cake mix",
    },
    {
      id: 4,
      name: "Sugar - White Granulated",
      category: "Baking",
      sku: "SG004",
      warehouseStock: 100,
      storeStock: 30,
      unitPrice: 4.5,
      minStockLevel: 20,
      status: "In Stock",
      expiryDate: "2027-01-01",
      lastUpdated: new Date().toISOString(),
      description: "Fine white granulated sugar",
    },
    {
      id: 5,
      name: "Dates - Deglet Noor",
      category: "Dates",
      sku: "FD005",
      warehouseStock: 0,
      storeStock: 0,
      unitPrice: 10.99,
      minStockLevel: 30,
      status: "Out of Stock",
      expiryDate: "2025-11-30",
      lastUpdated: new Date().toISOString(),
      description: "Sweet Deglet Noor dates",
    },
  ]);

  // Stock transfer history
  const [transferHistory, setTransferHistory] = useState([
    {
      id: 1,
      productName: "Fresh Dates - Medjool",
      quantity: 20,
      from: "Warehouse",
      to: "Store",
      date: new Date().toISOString(),
      performedBy: "Admin",
    },
  ]);

  // Calculate stock status
  const calculateStockStatus = (product) => {
    const totalStock = product.warehouseStock + product.storeStock;
    if (totalStock === 0) return "Out of Stock";
    if (totalStock <= product.minStockLevel) return "Low Stock";
    return "In Stock";
  };

  // Update product status on mount
  useEffect(() => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        status: calculateStockStatus(product),
      }))
    );
  }, []);

  // Real-time stock tracking simulation (updates every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setProducts((prevProducts) =>
        prevProducts.map((product) => ({
          ...product,
          lastUpdated: new Date().toISOString(),
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Get alerts
  const getLowStockAlerts = () => {
    return products.filter((p) => {
      const total = p.warehouseStock + p.storeStock;
      return total > 0 && total <= p.minStockLevel;
    });
  };

  const getOutOfStockItems = () => {
    return products.filter((p) => p.warehouseStock === 0 && p.storeStock === 0);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      product.status.toLowerCase().includes(filterType.toLowerCase());

    let matchesTab = true;
    if (activeTab === "warehouse") {
      matchesTab = product.warehouseStock > 0;
    } else if (activeTab === "store") {
      matchesTab = product.storeStock > 0;
    }

    return matchesSearch && matchesFilter && matchesTab;
  });

  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    totalWarehouseStock: products.reduce((sum, p) => sum + p.warehouseStock, 0),
    totalStoreStock: products.reduce((sum, p) => sum + p.storeStock, 0),
    totalValue: products.reduce(
      (sum, p) => sum + (p.warehouseStock + p.storeStock) * p.unitPrice,
      0
    ),
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Out of Stock":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Handle product addition
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.sku) {
      alert("Please fill in all required fields");
      return;
    }

    const product = {
      id: products.length + 1,
      ...newProduct,
      warehouseStock: Number(newProduct.warehouseStock),
      storeStock: Number(newProduct.storeStock),
      unitPrice: Number(newProduct.unitPrice),
      minStockLevel: Number(newProduct.minStockLevel),
      status: calculateStockStatus({
        warehouseStock: Number(newProduct.warehouseStock),
        storeStock: Number(newProduct.storeStock),
        minStockLevel: Number(newProduct.minStockLevel),
      }),
      lastUpdated: new Date().toISOString(),
    };

    setProducts([...products, product]);
    setShowAddModal(false);
    setNewProduct({
      name: "",
      category: "",
      sku: "",
      warehouseStock: 0,
      storeStock: 0,
      unitPrice: 0,
      minStockLevel: 10,
      expiryDate: "",
      description: "",
    });
  };

  // Handle stock transfer
  const handleStockTransfer = () => {
    if (!selectedProduct || !transferQuantity) {
      alert("Please enter a transfer quantity");
      return;
    }

    const quantity = Number(transferQuantity);
    if (quantity <= 0 || quantity > selectedProduct.warehouseStock) {
      alert("Invalid transfer quantity");
      return;
    }

    setProducts(
      products.map((p) =>
        p.id === selectedProduct.id
          ? {
              ...p,
              warehouseStock: p.warehouseStock - quantity,
              storeStock: p.storeStock + quantity,
              status: calculateStockStatus({
                ...p,
                warehouseStock: p.warehouseStock - quantity,
                storeStock: p.storeStock + quantity,
              }),
              lastUpdated: new Date().toISOString(),
            }
          : p
      )
    );

    setTransferHistory([
      {
        id: transferHistory.length + 1,
        productName: selectedProduct.name,
        quantity: quantity,
        from: "Warehouse",
        to: "Store",
        date: new Date().toISOString(),
        performedBy: "Admin",
      },
      ...transferHistory,
    ]);

    setShowTransferModal(false);
    setSelectedProduct(null);
    setTransferQuantity("");
  };

  // Handle product deletion
  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  // Handle product update
  const handleUpdateProduct = () => {
    if (!selectedProduct) return;

    setProducts(
      products.map((p) =>
        p.id === selectedProduct.id
          ? {
              ...selectedProduct,
              status: calculateStockStatus(selectedProduct),
              lastUpdated: new Date().toISOString(),
            }
          : p
      )
    );

    setShowEditModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className='space-y-6 w-full max-w-full overflow-x-hidden'>
      {/* Page header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Inventory Management
          </h1>
          <p className='text-gray-600 mt-2'>
            Manage warehouse and store inventory with real-time tracking
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className='bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2'
        >
          <PlusIcon className='h-5 w-5' />
          Add Product
        </button>
      </div>

      {/* Stock Alerts Section */}
      {(getLowStockAlerts().length > 0 || getOutOfStockItems().length > 0) && (
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
            <ExclamationTriangleIcon className='h-6 w-6 text-amber-600' />
            Stock Alerts
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {getLowStockAlerts().length > 0 && (
              <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                <h4 className='font-semibold text-yellow-800 mb-2 flex items-center gap-2'>
                  <ExclamationTriangleIcon className='h-5 w-5' />
                  Low Stock Items ({getLowStockAlerts().length})
                </h4>
                <ul className='space-y-2'>
                  {getLowStockAlerts().map((product) => (
                    <li
                      key={product.id}
                      className='text-sm text-yellow-700 flex justify-between'
                    >
                      <span>{product.name}</span>
                      <span className='font-semibold'>
                        {product.warehouseStock + product.storeStock} units
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {getOutOfStockItems().length > 0 && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                <h4 className='font-semibold text-red-800 mb-2 flex items-center gap-2'>
                  <XCircleIcon className='h-5 w-5' />
                  Out of Stock ({getOutOfStockItems().length})
                </h4>
                <ul className='space-y-2'>
                  {getOutOfStockItems().map((product) => (
                    <li key={product.id} className='text-sm text-red-700'>
                      {product.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Total Products</p>
              <p className='text-2xl font-bold text-gray-900 mt-1'>
                {stats.totalProducts}
              </p>
            </div>
            <div className='bg-blue-100 p-3 rounded-lg'>
              <ChartBarIcon className='h-6 w-6 text-blue-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Warehouse Stock</p>
              <p className='text-2xl font-bold text-gray-900 mt-1'>
                {stats.totalWarehouseStock}
              </p>
            </div>
            <div className='bg-purple-100 p-3 rounded-lg'>
              <BuildingOffice2Icon className='h-6 w-6 text-purple-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Store Stock</p>
              <p className='text-2xl font-bold text-gray-900 mt-1'>
                {stats.totalStoreStock}
              </p>
            </div>
            <div className='bg-green-100 p-3 rounded-lg'>
              <BuildingStorefrontIcon className='h-6 w-6 text-green-600' />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Total Value</p>
              <p className='text-2xl font-bold text-gray-900 mt-1'>
                ${stats.totalValue.toFixed(2)}
              </p>
            </div>
            <div className='bg-amber-100 p-3 rounded-lg'>
              <CheckCircleIcon className='h-6 w-6 text-amber-600' />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Table */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        <div className='border-b border-gray-200'>
          <nav className='flex -mb-px'>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "all"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveTab("warehouse")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "warehouse"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BuildingOffice2Icon className='h-5 w-5' />
              Warehouse
            </button>
            <button
              onClick={() => setActiveTab("store")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "store"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BuildingStorefrontIcon className='h-5 w-5' />
              Store
            </button>
          </nav>
        </div>

        {/* Filters and search */}
        <div className='p-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <MagnifyingGlassIcon className='absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search products by name, SKU, or category...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                />
              </div>
            </div>
            <div className='flex gap-4'>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
              >
                <option value='all'>All Status</option>
                <option value='in stock'>In Stock</option>
                <option value='low stock'>Low Stock</option>
                <option value='out of stock'>Out of Stock</option>
              </select>
              <button
                onClick={() =>
                  setProducts(
                    products.map((p) => ({
                      ...p,
                      lastUpdated: new Date().toISOString(),
                    }))
                  )
                }
                className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2'
              >
                <ArrowPathIcon className='h-5 w-5' />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Products table */}
        <div className='overflow-x-auto -mx-6 px-6'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Product
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  SKU
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Category
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Warehouse
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Store
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Total
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Price
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
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan='9'
                    className='px-6 py-12 text-center text-gray-500'
                  >
                    <div className='flex flex-col items-center'>
                      <BuildingStorefrontIcon className='h-12 w-12 text-gray-400 mb-3' />
                      <p className='text-lg font-medium'>No products found</p>
                      <p className='text-sm'>
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {product.name}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {product.sku}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {product.category}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600'>
                      {product.warehouseStock}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600'>
                      {product.storeStock}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900'>
                      {product.warehouseStock + product.storeStock}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      ${product.unitPrice}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          product.status
                        )}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex space-x-2'>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowDetailsModal(true);
                          }}
                          className='text-blue-600 hover:text-blue-900'
                          title='View Details'
                        >
                          <EyeIcon className='h-5 w-5' />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowEditModal(true);
                          }}
                          className='text-amber-600 hover:text-amber-900'
                          title='Edit Product'
                        >
                          <PencilIcon className='h-5 w-5' />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowTransferModal(true);
                          }}
                          className='text-green-600 hover:text-green-900'
                          title='Transfer Stock'
                          disabled={product.warehouseStock === 0}
                        >
                          <ArrowRightIcon className='h-5 w-5' />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className='text-red-600 hover:text-red-900'
                          title='Delete Product'
                        >
                          <TrashIcon className='h-5 w-5' />
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

      {/* Stock Transfer History */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
          <ArrowPathIcon className='h-6 w-6 text-amber-600' />
          Recent Stock Transfers
        </h3>
        <div className='overflow-x-auto -mx-6 px-6'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                  Product
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                  Quantity
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                  From
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                  To
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                  Date & Time
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                  Performed By
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {transferHistory.slice(0, 5).map((transfer) => (
                <tr key={transfer.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {transfer.productName}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {transfer.quantity} units
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    <span className='inline-flex items-center gap-1'>
                      <BuildingOffice2Icon className='h-4 w-4' />
                      {transfer.from}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    <span className='inline-flex items-center gap-1'>
                      <BuildingStorefrontIcon className='h-4 w-4' />
                      {transfer.to}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {new Date(transfer.date).toLocaleString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {transfer.performedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-gray-200 flex justify-between items-center'>
              <h2 className='text-2xl font-bold text-gray-900'>
                Add New Product
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                <XMarkIcon className='h-6 w-6' />
              </button>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Product Name *
                  </label>
                  <input
                    type='text'
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    placeholder='Enter product name'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  >
                    <option value=''>Select category</option>
                    <option value='Dates'>Dates</option>
                    <option value='Grains'>Grains</option>
                    <option value='Bakery'>Bakery</option>
                    <option value='Baking'>Baking</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    SKU *
                  </label>
                  <input
                    type='text'
                    value={newProduct.sku}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, sku: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    placeholder='e.g., FD001'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Unit Price ($) *
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    value={newProduct.unitPrice}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        unitPrice: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    placeholder='0.00'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Warehouse Stock *
                  </label>
                  <input
                    type='number'
                    value={newProduct.warehouseStock}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        warehouseStock: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    placeholder='0'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Store Stock *
                  </label>
                  <input
                    type='number'
                    value={newProduct.storeStock}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        storeStock: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    placeholder='0'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Minimum Stock Level *
                  </label>
                  <input
                    type='number'
                    value={newProduct.minStockLevel}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        minStockLevel: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    placeholder='10'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Expiry Date
                  </label>
                  <input
                    type='date'
                    value={newProduct.expiryDate}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        expiryDate: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    rows='3'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                    placeholder='Enter product description'
                  ></textarea>
                </div>
              </div>
            </div>
            <div className='p-6 border-t border-gray-200 flex justify-end gap-4'>
              <button
                onClick={() => setShowAddModal(false)}
                className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className='px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700'
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Stock Modal */}
      {showTransferModal && selectedProduct && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full'>
            <div className='p-6 border-b border-gray-200 flex justify-between items-center'>
              <h2 className='text-2xl font-bold text-gray-900'>
                Transfer Stock
              </h2>
              <button
                onClick={() => setShowTransferModal(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                <XMarkIcon className='h-6 w-6' />
              </button>
            </div>
            <div className='p-6 space-y-4'>
              <div>
                <p className='text-sm text-gray-600'>Product</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {selectedProduct.name}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Available in Warehouse</p>
                <p className='text-2xl font-bold text-purple-600'>
                  {selectedProduct.warehouseStock} units
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Quantity to Transfer *
                </label>
                <input
                  type='number'
                  min='1'
                  max={selectedProduct.warehouseStock}
                  value={transferQuantity}
                  onChange={(e) => setTransferQuantity(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  placeholder='Enter quantity'
                />
              </div>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <p className='text-sm text-blue-800'>
                  <strong>Transfer Direction:</strong> Warehouse → Store
                </p>
              </div>
            </div>
            <div className='p-6 border-t border-gray-200 flex justify-end gap-4'>
              <button
                onClick={() => {
                  setShowTransferModal(false);
                  setSelectedProduct(null);
                  setTransferQuantity("");
                }}
                className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleStockTransfer}
                disabled={
                  !transferQuantity ||
                  transferQuantity <= 0 ||
                  transferQuantity > selectedProduct.warehouseStock
                }
                className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                Transfer Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-gray-200 flex justify-between items-center'>
              <h2 className='text-2xl font-bold text-gray-900'>Edit Product</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                <XMarkIcon className='h-6 w-6' />
              </button>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Product Name
                  </label>
                  <input
                    type='text'
                    value={selectedProduct.name}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        name: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Category
                  </label>
                  <select
                    value={selectedProduct.category}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        category: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  >
                    <option value='Dates'>Dates</option>
                    <option value='Grains'>Grains</option>
                    <option value='Bakery'>Bakery</option>
                    <option value='Baking'>Baking</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    SKU
                  </label>
                  <input
                    type='text'
                    value={selectedProduct.sku}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        sku: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Unit Price ($)
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    value={selectedProduct.unitPrice}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        unitPrice: parseFloat(e.target.value),
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Warehouse Stock
                  </label>
                  <input
                    type='number'
                    value={selectedProduct.warehouseStock}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        warehouseStock: parseInt(e.target.value),
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Store Stock
                  </label>
                  <input
                    type='number'
                    value={selectedProduct.storeStock}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        storeStock: parseInt(e.target.value),
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Minimum Stock Level
                  </label>
                  <input
                    type='number'
                    value={selectedProduct.minStockLevel}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        minStockLevel: parseInt(e.target.value),
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Expiry Date
                  </label>
                  <input
                    type='date'
                    value={selectedProduct.expiryDate}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        expiryDate: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Description
                  </label>
                  <textarea
                    value={selectedProduct.description}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        description: e.target.value,
                      })
                    }
                    rows='3'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                  ></textarea>
                </div>
              </div>
            </div>
            <div className='p-6 border-t border-gray-200 flex justify-end gap-4'>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProduct(null);
                }}
                className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className='px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700'
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showDetailsModal && selectedProduct && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-gray-200 flex justify-between items-center'>
              <h2 className='text-2xl font-bold text-gray-900'>
                Product Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                <XMarkIcon className='h-6 w-6' />
              </button>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-sm font-medium text-gray-500 mb-1'>
                    Product Name
                  </h3>
                  <p className='text-lg font-semibold text-gray-900'>
                    {selectedProduct.name}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500 mb-1'>
                    SKU
                  </h3>
                  <p className='text-lg font-semibold text-gray-900'>
                    {selectedProduct.sku}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500 mb-1'>
                    Category
                  </h3>
                  <p className='text-lg font-semibold text-gray-900'>
                    {selectedProduct.category}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500 mb-1'>
                    Unit Price
                  </h3>
                  <p className='text-lg font-semibold text-gray-900'>
                    ${selectedProduct.unitPrice}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500 mb-1'>
                    Warehouse Stock
                  </h3>
                  <p className='text-2xl font-bold text-purple-600'>
                    {selectedProduct.warehouseStock} units
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500 mb-1'>
                    Store Stock
                  </h3>
                  <p className='text-2xl font-bold text-green-600'>
                    {selectedProduct.storeStock} units
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500 mb-1'>
                    Total Stock
                  </h3>
                  <p className='text-2xl font-bold text-gray-900'>
                    {selectedProduct.warehouseStock +
                      selectedProduct.storeStock}{" "}
                    units
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500 mb-1'>
                    Status
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedProduct.status
                    )}`}
                  >
                    {selectedProduct.status}
                  </span>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500 mb-1'>
                    Minimum Stock Level
                  </h3>
                  <p className='text-lg font-semibold text-gray-900'>
                    {selectedProduct.minStockLevel} units
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500 mb-1'>
                    Expiry Date
                  </h3>
                  <p className='text-lg font-semibold text-gray-900'>
                    {selectedProduct.expiryDate || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500 mb-1'>
                    Total Value
                  </h3>
                  <p className='text-lg font-semibold text-amber-600'>
                    $
                    {(
                      (selectedProduct.warehouseStock +
                        selectedProduct.storeStock) *
                      selectedProduct.unitPrice
                    ).toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500 mb-1'>
                    Last Updated
                  </h3>
                  <p className='text-sm text-gray-700'>
                    {new Date(selectedProduct.lastUpdated).toLocaleString()}
                  </p>
                </div>
                <div className='md:col-span-2'>
                  <h3 className='text-sm font-medium text-gray-500 mb-1'>
                    Description
                  </h3>
                  <p className='text-gray-900'>
                    {selectedProduct.description || "No description available"}
                  </p>
                </div>
              </div>
            </div>
            <div className='p-6 border-t border-gray-200 flex justify-end'>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedProduct(null);
                }}
                className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
