# Payment Recording Guide - Complete Solution

## 🎯 Problem Solved

You asked: "When customer later gives me partial payment, how do I find the specific sale record and update it?"

**Answer:** Use the new payment recording endpoints!

---

## 🚀 New Endpoints

### 1. Record Payment Against Purchase
**POST** `/api/v1/purchases/:id/payment`

### 2. Record Payment Against Sale
**POST** `/api/v1/sales/:id/payment`

---

## 📋 How It Works

### Scenario: Customer Pays Remaining Amount Later

#### Step 1: Create Sale with Partial Payment

```
Sale #123: Sell 1000 AFN goods, receive 300 AFN
├── Customer Account: +700 (they owe 700 remaining)
├── Cashier Account: +300 (cash received)
└── Sale Record:
    ├── Total Amount: 1000
    ├── Paid Amount: 300
    └── Due Amount: 700
```

#### Step 2: Customer Returns Later to Pay Remaining 700

**Option A: From Sale Details Page**
1. Open Sale #123 details
2. Click "Record Payment" button
3. Enter payment amount: 700
4. Select payment account (cashier)
5. Submit

**Option B: From Customer Account**
1. Open customer account
2. Find Sale #123 transaction
3. Click on it → goes to sale details
4. Click "Record Payment" button
5. Enter payment amount: 700
6. Submit

#### Step 3: System Automatically Updates

```
After payment recorded:
├── Customer Account: +0 (fully paid) ✅
├── Cashier Account: +1000 (total received)
└── Sale Record:
    ├── Total Amount: 1000
    ├── Paid Amount: 1000 ✅
    └── Due Amount: 0 ✅
```

---

## 🔧 API Usage

### Record Purchase Payment

**Endpoint:** `POST /api/v1/purchases/:id/payment`

**Request Body:**
```json
{
  "amount": 700,
  "paymentAccount": "cashier_account_id",
  "description": "Settling remaining balance"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment recorded successfully",
  "purchase": {
    "_id": "purchase_id",
    "totalAmount": 1000,
    "paidAmount": 1000,
    "dueAmount": 0
  },
  "paymentAmount": 700,
  "supplierBalance": 0
}
```

**What Happens:**
1. ✅ Finds the purchase
2. ✅ Validates payment doesn't exceed due amount
3. ✅ Creates payment transaction (reduces cashier balance)
4. ✅ Creates payment transaction (reduces supplier balance)
5. ✅ Updates purchase paidAmount
6. ✅ Updates supplier account balance

### Record Sale Payment

**Endpoint:** `POST /api/v1/sales/:id/payment`

**Request Body:**
```json
{
  "amount": 700,
  "paymentAccount": "cashier_account_id",
  "description": "Customer paid remaining balance"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment recorded successfully",
  "sale": {
    "_id": "sale_id",
    "totalAmount": 1000,
    "paidAmount": 1000,
    "dueAmount": 0
  },
  "paymentAmount": 700,
  "apiResponse": {
    "customerBalance": 0,
    "cashierBalance": 1000
  }
}
```

**What Happens:**
1. ✅ Finds the sale
2. ✅ Validates payment doesn't exceed due amount
3. ✅ Creates payment transaction (increases cashier balance)
4. ✅ Creates payment transaction (reduces customer balance)
5. ✅ Updates sale paidAmount
6. ✅ Updates customer account balance

---

## 🎯 Complete Workflow Examples

### Example 1: Purchase with Multiple Payments

**Day 1: Create Purchase**
```
Purchase goods worth 5000 AFN
Pay 2000 AFN cash

Supplier Account: +3000 (remaining due)
Cashier Account: -2000
Purchase Record: Paid 2000, Due 3000
```

**Day 5: Partial Payment**
```
Record Payment: 1500 AFN

Supplier Account: +1500 (remaining due)
Cashier Account: -3500 (total paid)
Purchase Record: Paid 3500, Due 1500
```

**Day 10: Final Payment**
```
Record Payment: 1500 AFN

Supplier Account: +0 (fully paid) ✅
Cashier Account: -5000 (total paid)
Purchase Record: Paid 5000, Due 0 ✅
```

### Example 2: Sale with Multiple Payments

**Day 1: Create Sale**
```
Sell goods worth 10000 AFN
Receive 4000 AFN cash

Customer Account: +6000 (remaining due)
Cashier Account: +4000
Sale Record: Paid 4000, Due 6000
```

**Day 7: Customer Pays More**
```
Record Payment: 3000 AFN

Customer Account: +3000 (remaining due)
Cashier Account: +7000 (total received)
Sale Record: Paid 7000, Due 3000
```

**Day 15: Final Payment**
```
Record Payment: 3000 AFN

Customer Account: +0 (fully paid) ✅
Cashier Account: +10000 (total received)
Sale Record: Paid 10000, Due 0 ✅
```

---

## 💡 Finding Transactions to Update

### Method 1: From Purchase/Sale List

1. Go to Purchases/Sales page
2. Find the purchase/sale
3. Click "View Details"
4. Click "Record Payment" button
5. Enter amount and submit

### Method 2: From Account Transactions

1. Go to Accounts page
2. Find supplier/customer account
3. Click "View Transactions"
4. Find the purchase/sale transaction
5. Click on it → goes to purchase/sale details
6. Click "Record Payment" button
7. Enter amount and submit

### Method 3: Search by Date/Amount

1. Go to Purchases/Sales page
2. Filter by date range
3. Filter by amount
4. Find the specific transaction
5. Click "Record Payment"

---

## ✅ Validation Rules

### Payment Amount Validation

✅ **Allowed:** Payment ≤ remaining due
❌ **Rejected:** Payment > remaining due

**Example:**
```
Purchase total: 1000
Already paid: 300
Remaining due: 700

✅ Can pay: 700 or less
❌ Cannot pay: 701 or more
```

### Account Balance Validation

For Cashier/Safe accounts:
✅ **Allowed:** Account has enough balance
❌ **Rejected:** Insufficient balance

**Example:**
```
Cashier balance: 5000
Payment amount: 3000
✅ Payment allowed

Cashier balance: 5000
Payment amount: 6000
❌ Payment rejected: "موجودی ناکافی!"
```

---

## 🔄 Transaction Linking

All payments are linked to the original purchase/sale via `referenceId`:

```javascript
// Purchase Payment Transaction
{
  account: "supplier_account_id",
  transactionType: "Payment",
  amount: -700,
  referenceType: "purchase",
  referenceId: "purchase_123",  // Links to purchase
  description: "Payment received for purchase"
}

// Sale Payment Transaction
{
  account: "customer_account_id",
  transactionType: "Payment",
  amount: -700,
  referenceType: "sale",
  referenceId: "sale_456",  // Links to sale
  description: "Payment made for sale"
}
```

This allows you to:
- ✅ View all payments for a specific purchase/sale
- ✅ Track payment history
- ✅ See linked transactions
- ✅ Navigate from account transaction to purchase/sale

---

## 📊 Account Balance After Payments

### Supplier Account Flow

```
Initial: +5000 (you owe them 5000)

Payment 1: Record 2000
├── Transaction: -2000
└── Balance: +3000

Payment 2: Record 1500
├── Transaction: -1500
└── Balance: +1500

Payment 3: Record 1500
├── Transaction: -1500
└── Balance: +0 ✅ (fully paid)
```

### Customer Account Flow

```
Initial: +8000 (they owe you 8000)

Payment 1: Record 3000
├── Transaction: -3000
└── Balance: +5000

Payment 2: Record 3000
├── Transaction: -3000
└── Balance: +2000

Payment 3: Record 2000
├── Transaction: -2000
└── Balance: +0 ✅ (fully paid)
```

---

## 🎓 Key Points

### ✅ What Gets Updated

1. **Purchase/Sale Record**
   - `paidAmount` increases
   - `dueAmount` decreases

2. **Account Balances**
   - Supplier/Customer balance decreases
   - Cashier balance increases/decreases

3. **Transaction History**
   - New payment transaction created
   - Linked to original purchase/sale

### ✅ Benefits

1. **Easy to Find:** Click on account transaction → goes to purchase/sale
2. **Always Synced:** Accounts update automatically
3. **Clear History:** All payments tracked and linked
4. **Validation:** Prevents over-payment
5. **Audit Trail:** All changes logged

### ✅ Best Practices

1. **Record payments immediately** when received/paid
2. **Use descriptive** payment descriptions
3. **Verify amounts** before submitting
4. **Check account balances** after payment
5. **Review transaction history** regularly

---

## 🚨 Error Handling

### Error: Payment Exceeds Due Amount

```json
{
  "status": "error",
  "message": "Payment amount (800) exceeds remaining due (700)"
}
```

**Solution:** Reduce payment amount to 700 or less

### Error: Insufficient Balance

```json
{
  "status": "error",
  "message": "موجودی ناکافی! در حساب صندوق موجودی: 500 افغانی، مبلغ مورد نیاز: 1000 افغانی"
}
```

**Solution:** Add money to cashier account or use different payment account

### Error: Purchase/Sale Not Found

```json
{
  "status": "error",
  "message": "Purchase not found"
}
```

**Solution:** Check purchase/sale ID is correct

---

## 📝 Summary

### Your Question Answered ✅

**Q:** How do I find and update a specific sale/purchase when customer pays later?

**A:** 
1. Find the purchase/sale (from list or account transactions)
2. Click "Record Payment" button
3. Enter payment amount
4. Submit → System automatically updates everything!

### What This Solves ✅

✅ **Easy to find** transactions  
✅ **Automatic updates** of accounts  
✅ **Payment history** tracking  
✅ **Transaction linking** for navigation  
✅ **Validation** prevents errors  
✅ **Always synced** across system  

The system now handles partial payments seamlessly!

