# How Accounts Work Now - Simple Guide

## 🎯 Key Concept

**Account balance = Remaining Due Amount**

When you see a supplier account with **+700**, it means:
- ✅ You still owe them 700 AFN
- ✅ NOT that the total purchase was 700

---

## 📊 Purchase Examples

### Example 1: Buy Goods, Pay Nothing

```
Action: Purchase 1000 AFN goods, pay 0 AFN
├── Supplier Account: +1000 (you owe 1000)
└── Cashier Account: No change

Result: You owe supplier 1000 AFN
```

### Example 2: Buy Goods, Pay Partial

```
Action: Purchase 1000 AFN goods, pay 300 AFN
├── Supplier Account: +700 (you owe 700 remaining)
└── Cashier Account: -300 (cash paid)

Result: You still owe supplier 700 AFN ✅
```

### Example 3: Buy Goods, Pay Full

```
Action: Purchase 1000 AFN goods, pay 1000 AFN
├── Supplier Account: +0 (fully paid)
└── Cashier Account: -1000 (cash paid)

Result: No money owed to supplier ✅
```

---

## 📊 Sale Examples

### Example 1: Sell Goods, Receive Nothing

```
Action: Sell 1000 AFN goods, receive 0 AFN
├── Customer Account: +1000 (they owe 1000)
└── Cashier Account: No change

Result: Customer owes you 1000 AFN
```

### Example 2: Sell Goods, Receive Partial

```
Action: Sell 1000 AFN goods, receive 300 AFN
├── Customer Account: +700 (they owe 700 remaining)
└── Cashier Account: +300 (cash received)

Result: Customer still owes you 700 AFN ✅
```

### Example 3: Sell Goods, Receive Full

```
Action: Sell 1000 AFN goods, receive 1000 AFN
├── Customer Account: +0 (fully paid)
└── Cashier Account: +1000 (cash received)

Result: Customer paid fully ✅
```

---

## 🔍 Understanding Balance Signs

### Supplier Account Balance

| Balance | Meaning |
|---------|---------|
| **+5000** | You owe supplier 5000 AFN |
| **+0** | Fully paid, no debt |
| **-2000** | Supplier owes YOU 2000 AFN (unusual) |

### Customer Account Balance

| Balance | Meaning |
|---------|---------|
| **+5000** | Customer owes you 5000 AFN |
| **+0** | Fully paid, no debt |
| **-2000** | You owe customer 2000 AFN (unusual) |

### Cashier Account Balance

| Balance | Meaning |
|---------|---------|
| **+5000** | You have 5000 AFN cash |
| **+0** | No cash available |
| **-2000** | ❌ NOT ALLOWED (system will reject) |

---

## 💡 Real-World Scenarios

### Scenario 1: Daily Purchase

```
Day 1: Buy dates worth 1000 AFN
- Supplier Account: +1000

Day 2: Pay supplier 500 AFN
- Supplier Account: +500
- Cashier Account: -500

Day 3: Pay supplier remaining 500 AFN
- Supplier Account: +0 ✅
- Cashier Account: -500 (total: -1000)
```

### Scenario 2: Multiple Customers

```
Customer A:
- Sell 1000 AFN goods, receive 0
- Account: +1000 (they owe 1000)

Customer B:
- Sell 500 AFN goods, receive 500
- Account: +0 (they paid fully)

Customer C:
- Sell 2000 AFN goods, receive 1500
- Account: +500 (they owe 500)

Total Money Owed: 1000 + 0 + 500 = 1500 AFN
```

### Scenario 3: Dakhal (Cashier) Account

```
Initial: Dakhal account has 10000 AFN
├── Receive payment from customer: +3000
├── Dakhal Account: 13000 AFN

Later: Pay supplier: -5000
├── Dakhal Account: 8000 AFN ✅
```

---

## 🔄 Transaction Flow Diagram

### Purchase Flow

```
CREATE PURCHASE
    ↓
[Supplier] +1000 (total debt)
    ↓
PAY 300 AFN
    ↓
[Cashier] -300 (cash out)
[Supplier] -300 (debt reduced)
    ↓
FINAL BALANCE
[Supplier] +700 (remaining due) ✅
```

### Sale Flow

```
CREATE SALE
    ↓
[Customer] +1000 (total debt)
    ↓
RECEIVE 300 AFN
    ↓
[Cashier] +300 (cash in)
[Customer] -300 (debt reduced)
    ↓
FINAL BALANCE
[Customer] +700 (remaining due) ✅
```

---

## ✅ How to Check Remaining Due

### Method 1: Look at Account Balance

```
Supplier Account: +700
Meaning: You owe them 700 AFN ✅
```

### Method 2: Check Purchase Record

```
Purchase Record:
├── Total Amount: 1000 AFN
├── Paid Amount: 300 AFN
└── Due Amount: 700 AFN ✅
```

### Method 3: Check Transactions

```
Supplier Transactions:
├── Purchase: +1000
├── Payment: -300
└── Balance: +700 ✅
```

---

## 🎓 Important Rules

### Rule 1: Positive vs Negative

- **Supplier balance (+)** = You owe them
- **Customer balance (+)** = They owe you
- **Cashier balance (+)** = Cash available

### Rule 2: Partial Payments

- Paying reduces both cashier AND supplier/customer balance
- Balance always shows remaining due
- Full payment history is tracked

### Rule 3: Dakhal (Cashier) Account

- Only receive money OR pay money
- Cannot go negative
- Must have enough balance before paying

---

## 🚨 Common Mistakes to Avoid

### ❌ Mistake 1: Confusing Total with Remaining

```
Wrong: "Supplier balance is +1000, so I paid 1000"
Correct: "Supplier balance is +1000, so I still owe 1000"
```

### ❌ Mistake 2: Negative Supplier Balance

```
Wrong: "Supplier balance is -500, so I paid 500"
Correct: "Supplier balance is -500, THEY owe ME 500"
```

### ❌ Mistake 3: Ignoring Partial Payments

```
Wrong: "I paid 300, but balance shows 700, system is wrong"
Correct: "You paid 300, still owe 700. Total was 1000"
```

---

## 📝 Quick Reference

| Action | Supplier Balance | Customer Balance | Cashier Balance |
|--------|-----------------|------------------|-----------------|
| Purchase 1000, pay 0 | +1000 | - | - |
| Purchase 1000, pay 300 | +700 | - | -300 |
| Purchase 1000, pay 1000 | +0 | - | -1000 |
| Sell 1000, receive 0 | - | +1000 | - |
| Sell 1000, receive 300 | - | +700 | +300 |
| Sell 1000, receive 1000 | - | +0 | +1000 |

---

## 💬 Summary

✅ **Account balance = Remaining due amount**

✅ **Positive supplier balance = You owe them**

✅ **Positive customer balance = They owe you**

✅ **Partial payments reduce the balance automatically**

✅ **System is now synced and clear!**

