��# Frontend Pages & Components Specification
## Trading & Distribution Management System

<div dir="rtl" align="right">

# مشخصات صفحات و کامپوننت‌های فرانت‌اند
## سیستم مدیریت تجارت و توزیع

</div>

---

## 1. Core Pages

### 1.1 Dashboard Page (`/dashboard`)
**Purpose:** Main overview showing business metrics and recent activities

**Layout:**
- Header with date range picker
- 6 stat cards in 3x2 grid
- Recent transactions table
- Quick action buttons
- Sales and inventory charts

**Components:**
- StatCard (6 instances)
- DataTable (recent transactions)
- QuickActionButton (4 instances)
- LineChart (sales trend)
- BarChart (inventory levels)
- DateRangePicker

### 1.2 Inventory Management Page (`/inventory`)
**Purpose:** Manage warehouse and store inventory with real-time tracking

**Layout:**
- Page header with action buttons
- Filter section (category, location, search)
- Main content area with table and sidebar
- Product details panel

**Components:**
- ProductTable
- ProductCard
- StockLevelIndicator
- CategoryFilter
- LocationFilter
- SearchInput
- ProductModal

### 1.3 Sales Management Page (`/sales`)
**Purpose:** Track sales transactions, customer accounts, and employee performance

**Layout:**
- Page header with action buttons
- Tab navigation (All Sales, Customer Accounts, Employee Performance, Returns)
- Filter section
- Sales data table

**Components:**
- SalesTable
- CustomerAccountCard
- EmployeePerformanceCard
- SalesModal
- CustomerModal
- TabNavigation

### 1.4 Purchase Management Page (`/purchases`)
**Purpose:** Manage supplier purchases, track payments, and monitor supplier accounts

**Layout:**
- Page header with action buttons
- Summary cards section
- Main content with purchases table and supplier accounts

**Components:**
- PurchaseTable
- SupplierAccountCard
- PurchaseModal
- SupplierModal
- PaymentModal

### 1.5 Reports Page (`/reports`)
**Purpose:** Generate and view various business reports and analytics

**Layout:**
- Page header with export buttons
- Filter section (report type, date range, format)
- Grid of report cards

**Components:**
- ReportCard
- ChartComponent
- ExportButton
- ReportModal
- FilterDropdown

---

## 2. Reusable Components

### 2.1 Navigation Components

#### Sidebar Navigation (`SidebarNav`)
```html
<nav class="sidebar-nav">
  <div class="nav-header">
    <h2>Khorma Trading</h2>
  </div>
  <ul class="nav-menu">
    <li class="nav-item">
      <a href="/dashboard" class="nav-link active">
        <svg class="nav-icon">...</svg>
        <span>Dashboard</span>
      </a>
    </li>
    <!-- More nav items -->
  </ul>
</nav>
```

**Props:**
- `activeItem`: Currently active navigation item
- `collapsed`: Boolean for mobile collapsed state
- `onItemClick`: Callback for navigation item clicks

#### Top Navigation Bar (`TopNav`)
```html
<header class="top-nav">
  <div class="nav-left">
    <button class="menu-toggle">
      <svg class="icon">...</svg>
    </button>
    <div class="breadcrumb">
      <span>Dashboard</span>
      <span class="separator">/</span>
      <span>Inventory</span>
    </div>
  </div>
  <div class="nav-right">
    <div class="search-box">
      <input type="text" placeholder="Search...">
    </div>
    <div class="user-menu">
      <button class="user-button">
        <img src="avatar.jpg" alt="User">
        <span>Admin</span>
      </button>
    </div>
  </div>
</header>
```

### 2.2 Data Display Components

#### Stat Card (`StatCard`)
```html
<div class="stat-card">
  <div class="stat-icon">
    <svg class="icon">...</svg>
  </div>
  <div class="stat-content">
    <h3 class="stat-value">1,234</h3>
    <p class="stat-label">Total Sales</p>
    <div class="stat-change positive">
      <svg class="change-icon">...</svg>
      <span>+12.5%</span>
    </div>
  </div>
</div>
```

**Props:**
- `title`: Card title
- `value`: Main numeric value
- `change`: Percentage change
- `changeType`: 'positive', 'negative', 'neutral'
- `icon`: Icon component
- `color`: Card color theme

#### Data Table (`DataTable`)
```html
<div class="data-table-container">
  <div class="table-header">
    <h3>Recent Transactions</h3>
    <div class="table-actions">
      <button class="btn-secondary">Export</button>
      <button class="btn-primary">Add New</button>
    </div>
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>Customer</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <!-- Table rows -->
    </tbody>
  </table>
  <div class="table-pagination">
    <!-- Pagination controls -->
  </div>
</div>
```

**Props:**
- `data`: Array of table data
- `columns`: Column configuration
- `sortable`: Boolean for sortable columns
- `filterable`: Boolean for filterable table
- `pagination`: Pagination configuration
- `onRowClick`: Row click handler

### 2.3 Form Components

#### Product Form (`ProductForm`)
```html
<form class="product-form">
  <div class="form-section">
    <h3>Basic Information</h3>
    <div class="form-row">
      <div class="form-group">
        <label>Product Name</label>
        <input type="text" class="form-input" required>
      </div>
      <div class="form-group">
        <label>Category</label>
        <select class="form-select" required>
          <option>Dates</option>
          <option>Chickpeas</option>
          <option>Cakes</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>SKU</label>
        <input type="text" class="form-input">
      </div>
      <div class="form-group">
        <label>Barcode</label>
        <input type="text" class="form-input">
      </div>
    </div>
  </div>
  
  <div class="form-section">
    <h3>Pricing</h3>
    <div class="form-row">
      <div class="form-group">
        <label>Purchase Price</label>
        <input type="number" class="form-input" step="0.01">
      </div>
      <div class="form-group">
        <label>Selling Price</label>
        <input type="number" class="form-input" step="0.01">
      </div>
    </div>
  </div>
  
  <div class="form-actions">
    <button type="button" class="btn-secondary">Cancel</button>
    <button type="submit" class="btn-primary">Save Product</button>
  </div>
</form>
```

#### Search Input (`SearchInput`)
```html
<div class="search-input">
  <div class="search-icon">
    <svg class="icon">...</svg>
  </div>
  <input type="text" placeholder="Search..." class="form-input">
  <button class="clear-button">
    <svg class="icon">...</svg>
  </button>
</div>
```

### 2.4 Modal Components

#### Product Modal (`ProductModal`)
```html
<div class="modal-overlay">
  <div class="modal-container">
    <div class="modal-header">
      <h2>Add New Product</h2>
      <button class="modal-close">
        <svg class="icon">...</svg>
      </button>
    </div>
    <div class="modal-content">
      <ProductForm />
    </div>
    <div class="modal-footer">
      <button class="btn-secondary">Cancel</button>
      <button class="btn-primary">Save</button>
    </div>
  </div>
</div>
```

#### Confirmation Modal (`ConfirmModal`)
```html
<div class="modal-overlay">
  <div class="modal-container small">
    <div class="modal-header">
      <h2>Confirm Action</h2>
    </div>
    <div class="modal-content">
      <p>Are you sure you want to delete this product?</p>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary">Cancel</button>
      <button class="btn-danger">Delete</button>
    </div>
  </div>
</div>
```

### 2.5 Chart Components

#### Line Chart (`LineChart`)
```html
<div class="chart-container">
  <div class="chart-header">
    <h3>Sales Trend</h3>
    <div class="chart-controls">
      <select class="form-select">
        <option>Last 7 days</option>
        <option>Last 30 days</option>
        <option>Last 3 months</option>
      </select>
    </div>
  </div>
  <div class="chart-content">
    <canvas id="sales-chart"></canvas>
  </div>
</div>
```

#### Bar Chart (`BarChart`)
```html
<div class="chart-container">
  <div class="chart-header">
    <h3>Inventory Levels</h3>
  </div>
  <div class="chart-content">
    <canvas id="inventory-chart"></canvas>
  </div>
</div>
```

### 2.6 Status & Indicator Components

#### Status Badge (`StatusBadge`)
```html
<span class="status-badge in-stock">In Stock</span>
<span class="status-badge low-stock">Low Stock</span>
<span class="status-badge out-of-stock">Out of Stock</span>
```

#### Progress Bar (`ProgressBar`)
```html
<div class="progress-bar">
  <div class="progress-fill" style="width: 75%"></div>
  <span class="progress-text">75% Complete</span>
</div>
```

#### Stock Level Indicator (`StockIndicator`)
```html
<div class="stock-indicator">
  <div class="stock-bar">
    <div class="stock-fill high" style="width: 80%"></div>
  </div>
  <span class="stock-text">45 units remaining</span>
</div>
```

---

## 3. Page-Specific Components

### 3.1 Dashboard Components

#### Quick Actions (`QuickActions`)
```html
<div class="quick-actions">
  <button class="quick-action-btn">
    <svg class="icon">...</svg>
    <span>New Sale</span>
  </button>
  <button class="quick-action-btn">
    <svg class="icon">...</svg>
    <span>Add Product</span>
  </button>
  <button class="quick-action-btn">
    <svg class="icon">...</svg>
    <span>New Purchase</span>
  </button>
  <button class="quick-action-btn">
    <svg class="icon">...</svg>
    <span>Generate Report</span>
  </button>
</div>
```

#### Recent Activity (`RecentActivity`)
```html
<div class="recent-activity">
  <h3>Recent Activity</h3>
  <div class="activity-list">
    <div class="activity-item">
      <div class="activity-icon">
        <svg class="icon">...</svg>
      </div>
      <div class="activity-content">
        <p>New sale recorded: $150.00</p>
        <span class="activity-time">2 minutes ago</span>
      </div>
    </div>
    <!-- More activity items -->
  </div>
</div>
```

### 3.2 Inventory Components

#### Product Card (`ProductCard`)
```html
<div class="product-card">
  <div class="product-image">
    <img src="product.jpg" alt="Product">
    <div class="product-badge">New</div>
  </div>
  <div class="product-info">
    <h4 class="product-name">Fresh Dates</h4>
    <p class="product-category">Fruits</p>
    <div class="product-price">
      <span class="current-price">$15.99</span>
      <span class="old-price">$19.99</span>
    </div>
    <div class="product-stock">
      <StockIndicator level="high" quantity="45" />
    </div>
    <div class="product-actions">
      <button class="btn-sm btn-primary">Edit</button>
      <button class="btn-sm btn-secondary">View</button>
    </div>
  </div>
</div>
```

#### Category Filter (`CategoryFilter`)
```html
<div class="category-filter">
  <h4>Categories</h4>
  <div class="filter-options">
    <label class="filter-option">
      <input type="checkbox" checked>
      <span>All Products</span>
      <span class="count">(125)</span>
    </label>
    <label class="filter-option">
      <input type="checkbox">
      <span>Dates</span>
      <span class="count">(45)</span>
    </label>
    <label class="filter-option">
      <input type="checkbox">
      <span>Chickpeas</span>
      <span class="count">(30)</span>
    </label>
    <label class="filter-option">
      <input type="checkbox">
      <span>Cakes</span>
      <span class="count">(50)</span>
    </label>
  </div>
</div>
```

### 3.3 Sales Components

#### Sales Transaction Card (`SalesCard`)
```html
<div class="sales-card">
  <div class="sales-header">
    <div class="sales-id">#S-001234</div>
    <div class="sales-date">Dec 15, 2023</div>
  </div>
  <div class="sales-content">
    <div class="customer-info">
      <h4>Ahmed Hassan</h4>
      <p>Regular Customer</p>
    </div>
    <div class="sales-details">
      <div class="detail-row">
        <span>Items:</span>
        <span>5 products</span>
      </div>
      <div class="detail-row">
        <span>Total:</span>
        <span class="amount">$245.50</span>
      </div>
      <div class="detail-row">
        <span>Status:</span>
        <StatusBadge status="completed" />
      </div>
    </div>
  </div>
  <div class="sales-actions">
    <button class="btn-sm btn-primary">View Details</button>
    <button class="btn-sm btn-secondary">Print Receipt</button>
  </div>
</div>
```

#### Customer Account Card (`CustomerAccountCard`)
```html
<div class="customer-account-card">
  <div class="customer-header">
    <div class="customer-avatar">
      <img src="customer.jpg" alt="Customer">
    </div>
    <div class="customer-info">
      <h4>Ahmed Hassan</h4>
      <p>ahmed@email.com</p>
      <p>+93 70 123 4567</p>
    </div>
  </div>
  <div class="account-summary">
    <div class="summary-item">
      <span class="label">Total Purchases:</span>
      <span class="value">$2,450.00</span>
    </div>
    <div class="summary-item">
      <span class="label">Outstanding Balance:</span>
      <span class="value outstanding">$150.00</span>
    </div>
    <div class="summary-item">
      <span class="label">Last Purchase:</span>
      <span class="value">Dec 10, 2023</span>
    </div>
  </div>
  <div class="account-actions">
    <button class="btn-sm btn-primary">View History</button>
    <button class="btn-sm btn-secondary">Add Payment</button>
  </div>
</div>
```

---

## 4. Responsive Design Specifications

### 4.1 Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 640px{ /* sm */ }
@media (min-width: 768px{ /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px{ /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### 4.2 Mobile Layout
- Collapsible sidebar
- Stacked card layout
- Touch-friendly buttons (min 44px)
- Swipe gestures for navigation

### 4.3 Tablet Layout
- Sidebar overlay
- 2-column grid for cards
- Larger touch targets
- Optimized form layouts

### 4.4 Desktop Layout
- Fixed sidebar
- 3-column grid for cards
- Hover effects
- Keyboard shortcuts

---

## 5. Component States

### 5.1 Loading States
```html
<div class="loading-skeleton">
  <div class="skeleton-header"></div>
  <div class="skeleton-content">
    <div class="skeleton-line"></div>
    <div class="skeleton-line short"></div>
    <div class="skeleton-line"></div>
  </div>
</div>
```

### 5.2 Empty States
```html
<div class="empty-state">
  <div class="empty-icon">
    <svg class="icon">...</svg>
  </div>
  <h3>No products found</h3>
  <p>Start by adding your first product to the inventory.</p>
  <button class="btn-primary">Add Product</button>
</div>
```

### 5.3 Error States
```html
<div class="error-state">
  <div class="error-icon">
    <svg class="icon">...</svg>
  </div>
  <h3>Something went wrong</h3>
  <p>We couldn't load the data. Please try again.</p>
  <button class="btn-primary">Retry</button>
</div>
```

---

## 6. Accessibility Features

### 6.1 Keyboard Navigation
- Tab order for all interactive elements
- Enter/Space for button activation
- Arrow keys for menu navigation
- Escape to close modals

### 6.2 Screen Reader Support
- Proper ARIA labels
- Semantic HTML structure
- Alt text for images
- Live regions for dynamic content

### 6.3 Focus Management
- Visible focus indicators
- Focus trapping in modals
- Focus restoration after modal close
- Skip links for main content

---

## 7. Performance Considerations

### 7.1 Lazy Loading
- Images loaded on demand
- Components loaded when needed
- Charts rendered when visible

### 7.2 Virtual Scrolling
- Large tables with virtual scrolling
- Infinite scroll for lists
- Pagination for better performance

### 7.3 Caching
- Component-level caching
- API response caching
- Local storage for user preferences

---

*This specification provides a comprehensive guide for implementing all frontend pages and components for the Trading & Distribution Management System with a focus on usability, accessibility, and performance.*
