🏷️ Scenario:

You buy 50kg Ajwa dates from Supplier A.

You assign Riding Man Ali to take 30kg to sell in the market.

He sells 20kg (cash sales), returns 10kg unsold.

Cash is placed into Saraf account.

🔄 Step-by-Step Flow
1️⃣ Purchase from Supplier

Purchases

purchase_id = 1 → Supplier A, total 5000 AFN.

Purchase_Items

50kg Ajwa × 100 AFN/kg = 5000 AFN.

Stock

Warehouse Ajwa +50kg.

Accounts

Supplier A’s account: Debit +5000 (we owe him).

Account_Transactions

Transaction #1: Supplier Debit 5000.

If we paid 2000 now from Tajri →

Transaction #2: Tajri −2000

Transaction #3: Supplier Credit 2000

Audit_Logs

INSERT Purchases, Purchase_Items, Stock changes recorded.

2️⃣ Assign 30kg to Riding Man Ali

Stock

Warehouse Ajwa −30kg (now 20kg left in warehouse).

Employee_Stock

Ali Ajwa +30kg.

Accounts

Ali’s account (employee): Debit +3000 (he is responsible for 30kg).

Account_Transactions

Transaction #4: Debit Ali 3000.

Audit_Logs

Stock transfer + employee_stock record logged.

3️⃣ Riding Man Sells 20kg

Sales

Sale #1: Ali sold 20kg = 2000 AFN.

Sale_Items

Ajwa 20kg × 100 AFN/kg = 2000.

Employee_Stock

Ajwa −20kg (Ali now has 10kg in hand).

Accounts

Ali’s account: Credit 2000 (his debt reduces from 3000 → 1000).

Customer account (walk-in cash) → not needed since it’s direct cash.

Saraf account: Credit 2000 (cash placed with money exchange man).

Account_Transactions

Transaction #5: Ali Credit 2000.

Transaction #6: Saraf Credit 2000.

Audit_Logs

Sales + Account changes recorded.

4️⃣ Riding Man Returns 10kg Unsold

Employee_Stock

Ajwa −10kg (Ali now has 0 left).

Stock

Warehouse Ajwa +10kg (back to storage).

Accounts

Ali’s account: Credit 1000 (remaining debt cleared).

Account_Transactions

Transaction #7: Ali Credit 1000.

Audit_Logs

Employee_Stock change + Stock return recorded.

📊 Final State After Flow

Stock

Warehouse: 20kg (initial) − 30kg (to Ali) + 10kg (returned) = 30kg Ajwa left.

Supplier Account

Balance = 3000 AFN still owed (if only 2000 was paid).

Employee Ali

Balance = 0 (he cleared all parcels).

Saraf Account

+2000 AFN (cash collected from market sales).

Audit Logs

Every insert, update, delete fully logged with before/after data.

✅ This end-to-end scenario shows how:

Goods move from Supplier → Warehouse → Riding Man → Customers → back to Warehouse (if unsold).

Money moves from Customer → Saraf → Accounts Ledger.

Balances stay accurate for Supplier, Employee, Cashier/Safe/Saraf.

Audit keeps full traceability.
