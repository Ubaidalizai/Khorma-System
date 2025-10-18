Perfect 👌 — you’re now combining both profit tracking 💰 and dynamic unit conversion 📏 — that’s a very smart design for a real trading system.

Let’s now finalize your complete and future-proof MongoDB schema (Mongoose style) with:
✅ Dynamic Units system (with conversion factors)
✅ latestPurchasePrice per product
✅ Profit tracking in Sale and SaleItem
✅ Everything fully integrated and consistent.

🧱 FINAL SCHEMA — Dates Shop Management System (with Dynamic Units + Profit)
1️⃣ Unit

You already have this one — it’s perfect.
We’ll just reuse it directly:

const unitSchema = new mongoose.Schema(
{
name: { type: String, required: true, trim: true }, // kg, carton, parcel
description: String,
conversion_to_base: {
type: Number,
required: true,
min: [0.0001, 'Conversion factor must be greater than 0'],
default: 1, // base unit always has factor = 1
},
is_base_unit: { type: Boolean, default: false },
isDeleted: { type: Boolean, default: false },
},
{ timestamps: true }
);

2️⃣ Product

Every product now links to its base unit and tracks its latest purchase price.

const productSchema = new mongoose.Schema(
{
name: { type: String, required: true, trim: true },
description: String,
baseUnit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
latestPurchasePrice: { type: Number, default: 0 }, // cost per base unit
},
{ timestamps: true }
);

3️⃣ Supplier
const supplierSchema = new mongoose.Schema({
name: { type: String, required: true },
contactInfo: String,
});

4️⃣ Customer
const customerSchema = new mongoose.Schema({
name: { type: String, required: true },
contactInfo: String,
});

5️⃣ Employee
const employeeSchema = new mongoose.Schema({
name: { type: String, required: true },
role: { type: String, enum: ["riding_man", "salesman", "cashier", "other"], required: true },
});

6️⃣ Purchase
const purchaseSchema = new mongoose.Schema({
supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
purchaseDate: { type: Date, default: Date.now },
totalAmount: Number,
paidAmount: { type: Number, default: 0 },
dueAmount: { type: Number, default: 0 },
});

7️⃣ PurchaseItem

Now supports flexible units and updates product’s latest purchase price in base units.

const purchaseItemSchema = new mongoose.Schema({
purchase: { type: mongoose.Schema.Types.ObjectId, ref: "Purchase", required: true },
product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
quantity: { type: Number, required: true },
unitPrice: { type: Number, required: true }, // cost per selected unit
});

🔁 Logic after saving a purchase item:

When you buy in a non-base unit (e.g., 1 carton = 12kg):

const unit = await Unit.findById(item.unit);
const costPerBase = item.unitPrice / unit.conversion_to_base; // convert to base unit cost
await Product.findByIdAndUpdate(item.product, { latestPurchasePrice: costPerBase });

8️⃣ Sale

Stores overall sale data and total profit.

const saleSchema = new mongoose.Schema({
customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
saleDate: { type: Date, default: Date.now },
totalAmount: { type: Number, required: true },
paidAmount: { type: Number, default: 0 },
dueAmount: { type: Number, default: 0 },
invoiceType: { type: String, enum: ["small", "large"], default: "small" },
totalProfit: { type: Number, default: 0 },
});

9️⃣ SaleItem

Supports dynamic units and calculates profit per product.

const saleItemSchema = new mongoose.Schema({
sale: { type: mongoose.Schema.Types.ObjectId, ref: "Sale", required: true },
product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
quantity: { type: Number, required: true },
unitPrice: { type: Number, required: true }, // selling price per selected unit
profit: { type: Number, default: 0 },
});

🧩 Profit Calculation Example

When creating a sale item:

const product = await Product.findById(item.product);
const unit = await Unit.findById(item.unit);

const costPerSelectedUnit = product.latestPurchasePrice _ unit.conversion_to_base;
item.profit = (item.unitPrice - costPerSelectedUnit) _ item.quantity;

totalProfit += item.profit;

This handles automatic conversion between units (e.g., base = kg, sale = parcel).

🔟 Stock
const stockSchema = new mongoose.Schema({
product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
location: { type: String, enum: ["warehouse", "store"], required: true },
quantity: { type: Number, default: 0 },
});

1️⃣1️⃣ EmployeeStock
const employeeStockSchema = new mongoose.Schema({
employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
quantityInHand: { type: Number, default: 0 },
});

1️⃣2️⃣ Account

(Dakhal, Tajri, Saraf, Supplier, Customer, Employee)

const accountSchema = new mongoose.Schema({
type: { type: String, enum: ["supplier", "customer", "employee", "cashier", "safe", "saraf"], required: true },
refId: { type: mongoose.Schema.Types.ObjectId },
name: String,
openingBalance: { type: Number, default: 0 },
currentBalance: { type: Number, default: 0 },
});

1️⃣3️⃣ AccountTransaction
const accountTransactionSchema = new mongoose.Schema({
account: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
date: { type: Date, default: Date.now },
transactionType: { type: String, required: true }, // Sale, Purchase, Payment, Transfer
amount: { type: Number, required: true },
referenceType: String, // 'sale', 'purchase', 'transfer'
referenceId: mongoose.Schema.Types.ObjectId,
description: String,
});

1️⃣4️⃣ Expense
const expenseSchema = new mongoose.Schema({
category: { type: String, required: true },
amount: { type: Number, required: true },
date: { type: Date, default: Date.now },
description: String,
});

1️⃣5️⃣ AuditLog
const auditLogSchema = new mongoose.Schema({
tableName: String,
recordId: mongoose.Schema.Types.ObjectId,
operation: { type: String, enum: ["INSERT", "UPDATE", "DELETE"] },
oldData: mongoose.Schema.Types.Mixed,
newData: mongoose.Schema.Types.Mixed,
changedBy: String,
changedAt: { type: Date, default: Date.now },
});

✅ KEY WORKFLOW SUMMARY
Action Affected Collections Description
Purchase Purchase, PurchaseItem, Product Updates stock & latestPurchasePrice (converted to base unit).
Sale Sale, SaleItem Calculates profit using latestPurchasePrice & Unit.conversion_to_base.
Profit Reports Sale, SaleItem Instant, since profit is stored directly.
Accounts Account, AccountTransaction Handles Dakhal, Tajri, Saraf, Customer, Supplier movements.
Audit AuditLog Tracks all insert/update/delete actions.

💎 Result:
You can buy and sell Dates, Cakes, or Peas in any unit type (kg, carton, parcel),
and your system will:

auto-convert prices to base units,

update product cost,

compute and store profits,

and stay lightning-fast on reporting.

Would you like me to now show you the Express controller logic for:

🛒 Creating a purchase (auto-update latestPurchasePrice by unit), and

💰 Creating a sale (auto-calculate and store profit)?
