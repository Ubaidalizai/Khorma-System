# 📦 Inventory Management System - Quick Guide

## 🎯 Features Overview

### ✅ Completed JIRA Tasks (16 Story Points)

| Task ID | Feature | Status | Story Points |
|---------|---------|--------|--------------|
| TDMS-105 | Warehouse Management System | ✅ Complete | 5 SP |
| TDMS-106 | Store Management System | ✅ Complete | 5 SP |
| TDMS-107 | Stock Transfer (Warehouse → Store) | ✅ Complete | 3 SP |
| TDMS-108 | Real-time Stock Tracking | ✅ Complete | 3 SP |

---

## 🚀 How to Use

### Starting the Application
```bash
cd Frontend
npm install  # First time only
npm run dev  # Start development server
```
Then open http://localhost:5173 in your browser and navigate to Inventory.

---

## 📊 Main Features

### 1. **Dashboard Statistics**
At the top of the page, you'll see 4 cards:
- 📈 **Total Products** - Number of different products
- 🏢 **Warehouse Stock** - Total units in warehouse
- 🏪 **Store Stock** - Total units in store  
- 💰 **Total Value** - Combined inventory value

### 2. **Stock Alerts** (Auto-displays when needed)
- 🟡 **Low Stock Alert** - Items below minimum level
- 🔴 **Out of Stock Alert** - Items with zero stock

### 3. **Tab Navigation**
Switch between different views:
- **All Items** - Complete inventory
- **Warehouse** - Warehouse stock only
- **Store** - Store stock only

### 4. **Search & Filter**
- 🔍 **Search Bar** - Find products by name, SKU, or category
- 📋 **Status Filter** - Filter by In Stock / Low Stock / Out of Stock
- 🔄 **Refresh** - Manually refresh data

---

## 🛠️ Product Management

### ➕ Adding a New Product
1. Click **"Add Product"** button (top right)
2. Fill in the form:
   - Product Name *
   - Category *
   - SKU *
   - Unit Price *
   - Warehouse Stock
   - Store Stock
   - Minimum Stock Level
   - Expiry Date (optional)
   - Description (optional)
3. Click **"Add Product"**

### ✏️ Editing a Product
1. Click the **Edit icon** (✏️) in the Actions column
2. Modify any fields
3. Click **"Update Product"**

### 👁️ Viewing Product Details
1. Click the **Eye icon** (👁️) in the Actions column
2. View all product information
3. Click **"Close"** when done

### 🗑️ Deleting a Product
1. Click the **Delete icon** (🗑️) in the Actions column
2. Confirm deletion
3. Product is removed

---

## 🔄 Stock Transfer

### Transferring Stock from Warehouse to Store
1. Click the **Transfer icon** (➡️) in the Actions column
2. See available warehouse stock
3. Enter quantity to transfer
4. Click **"Transfer Stock"**

**Note:** Transfer button is disabled if warehouse stock is zero.

### Validation Rules
- ✅ Quantity must be positive
- ✅ Quantity cannot exceed available warehouse stock
- ✅ Transfer is logged with timestamp

### Transfer History
View recent transfers at the bottom of the page:
- Product name
- Quantity transferred
- From: Warehouse 🏢
- To: Store 🏪
- Date & Time
- Performed By (user)

---

## 🎨 Color Coding

### Stock Status
- 🟢 **Green Badge** = In Stock (above minimum level)
- 🟡 **Yellow Badge** = Low Stock (at or below minimum)
- 🔴 **Red Badge** = Out of Stock (zero units)

### Locations
- 🟣 **Purple Numbers** = Warehouse Stock
- 🟢 **Green Numbers** = Store Stock
- **Bold Black** = Total Stock

### Action Icons
- 🔵 **Blue** = View Details
- 🟡 **Amber** = Edit Product
- 🟢 **Green** = Transfer Stock
- 🔴 **Red** = Delete Product

---

## ⚡ Real-time Features

### Auto-Refresh
- **Background refresh** every 30 seconds
- **Last Updated** timestamp on each product
- Automatic status recalculation

### Live Alerts
- Alerts appear automatically when:
  - Stock drops below minimum level
  - Stock reaches zero
- Alert count updates in real-time

---

## 📋 Product Table Columns

| Column | Description |
|--------|-------------|
| **Product** | Product name |
| **SKU** | Stock Keeping Unit code |
| **Category** | Product category |
| **Warehouse** | Units in warehouse (purple) |
| **Store** | Units in store (green) |
| **Total** | Combined stock (bold) |
| **Price** | Unit price in dollars |
| **Status** | Color-coded status badge |
| **Actions** | View, Edit, Transfer, Delete |

---

## 🔍 Search & Filter Tips

### Search Examples
- Search by name: "Dates"
- Search by SKU: "FD001"
- Search by category: "Bakery"

### Filter Options
- **All Status** - Show everything
- **In Stock** - Only items in stock
- **Low Stock** - Only low stock items
- **Out of Stock** - Only empty items

### Combining Search & Filter
You can use search AND filter together:
- Example: Search "Dates" + Filter "Low Stock"

---

## 💡 Best Practices

### Stock Management
1. Set appropriate **Minimum Stock Levels**
2. Monitor **Low Stock Alerts** daily
3. Transfer stock **before** store runs out
4. Keep **Expiry Dates** updated

### Product Information
- Use consistent **SKU format** (e.g., FD001, CP002)
- Add detailed **Descriptions** for clarity
- Set realistic **Unit Prices**
- Choose appropriate **Categories**

### Transfer Strategy
- Transfer in batches to reduce frequency
- Don't transfer entire warehouse stock
- Keep safety stock in warehouse
- Check transfer history regularly

---

## 🎯 Quick Actions Reference

| Want to... | Do this... |
|------------|-----------|
| Add a new product | Click "Add Product" button |
| See low stock items | Check alert banners at top |
| View warehouse only | Click "Warehouse" tab |
| View store only | Click "Store" tab |
| Transfer stock | Click green arrow icon |
| Edit product | Click yellow pencil icon |
| View details | Click blue eye icon |
| Delete product | Click red trash icon |
| Search products | Type in search bar |
| Filter by status | Use status dropdown |
| Refresh data | Click refresh button |

---

## 📊 Understanding the Data

### Example Product Entry
```
Name: Fresh Dates - Medjool
SKU: FD001
Category: Dates
Warehouse Stock: 150 units
Store Stock: 45 units
Total Stock: 195 units
Unit Price: $15.99
Min Stock Level: 30 units
Status: In Stock ✅
```

### Stock Status Calculation
- **In Stock:** Total Stock > Minimum Level
- **Low Stock:** Total Stock ≤ Minimum Level (but > 0)
- **Out of Stock:** Total Stock = 0

---

## 🚨 Common Scenarios

### Scenario 1: Store Running Low
1. Check alert banner (yellow)
2. Click "Store" tab to see store stock
3. Find product and click transfer icon
4. Transfer appropriate quantity from warehouse

### Scenario 2: Adding New Product Line
1. Click "Add Product"
2. Enter all product details
3. Set warehouse stock (main inventory)
4. Set initial store stock (if any)
5. Set minimum level for alerts
6. Save product

### Scenario 3: Product Out of Stock
1. Check alert banner (red)
2. Review warehouse stock
3. If warehouse has stock, transfer to store
4. If warehouse empty, mark for reorder

### Scenario 4: Bulk Stock Check
1. Use "All Items" tab for complete view
2. Filter by "Low Stock" to see problems
3. Review each item's warehouse availability
4. Plan transfers or reorders

---

## 🔧 Troubleshooting

### Transfer Button Disabled?
- **Reason:** Warehouse stock is zero
- **Solution:** Cannot transfer without warehouse stock

### Can't See My Product?
- **Check search bar** - Clear any search terms
- **Check filter** - Set to "All Status"
- **Check tab** - Use "All Items" tab

### Status Not Updating?
- **Click Refresh button** manually
- **Wait** for auto-refresh (30 seconds)
- **Check minimum stock level** setting

---

## 📈 Key Metrics to Monitor

### Daily Checks
- [ ] Review low stock alerts
- [ ] Check out of stock items
- [ ] Monitor store stock levels
- [ ] Review transfer history

### Weekly Reviews
- [ ] Total inventory value
- [ ] Stock turnover patterns
- [ ] Warehouse vs Store distribution
- [ ] Product performance

---

## 🎓 Training Checklist

### Basic Skills
- [ ] Add a new product
- [ ] Edit product details
- [ ] View product information
- [ ] Delete a product
- [ ] Search for products
- [ ] Filter by status

### Intermediate Skills
- [ ] Transfer stock to store
- [ ] Monitor stock alerts
- [ ] Use tab navigation
- [ ] Review transfer history
- [ ] Manage stock levels

### Advanced Skills
- [ ] Optimize min stock levels
- [ ] Plan transfer strategies
- [ ] Analyze stock patterns
- [ ] Handle out-of-stock situations

---

## 📞 Quick Reference Card

```
╔═══════════════════════════════════════╗
║   INVENTORY SYSTEM QUICK REFERENCE    ║
╠═══════════════════════════════════════╣
║ ➕ Add Product     → Top right button ║
║ ✏️  Edit           → Yellow pencil    ║
║ 👁️  Details        → Blue eye         ║
║ ➡️  Transfer       → Green arrow      ║
║ 🗑️  Delete         → Red trash        ║
║ 🔍 Search          → Top search bar   ║
║ 📋 Filter          → Status dropdown  ║
║ 🔄 Refresh         → Refresh button   ║
║ 📊 Statistics      → Top cards        ║
║ 🚨 Alerts          → Yellow/Red boxes ║
╚═══════════════════════════════════════╝
```

---

## 🎉 System Capabilities

### What You Can Do
✅ Manage warehouse inventory
✅ Manage store inventory
✅ Transfer stock between locations
✅ Track real-time stock levels
✅ Get low stock alerts
✅ Search and filter products
✅ View complete product details
✅ Monitor transfer history
✅ See inventory statistics
✅ Auto-refresh data

### Coming in Future Updates
🔜 Backend API integration
🔜 Database persistence
🔜 Multi-user authentication
🔜 Export to Excel/PDF
🔜 Email notifications
🔜 Barcode scanning
🔜 Purchase orders
🔜 Sales integration

---

## 📝 Tips for Success

1. **Keep Data Current** - Update stock levels regularly
2. **Set Smart Minimums** - Adjust minimum levels based on sales
3. **Transfer Proactively** - Don't wait for alerts
4. **Use Categories** - Organize products logically
5. **Document Everything** - Use description fields
6. **Monitor Alerts** - Check alerts daily
7. **Review History** - Learn from transfer patterns
8. **Clean Data** - Remove obsolete products

---

**Need Help?**
- Check this guide
- Review INVENTORY_MODULE_IMPLEMENTATION.md for technical details
- Contact system administrator

**Version:** 1.0  
**Last Updated:** October 12, 2025  
**Status:** Production Ready ✅

