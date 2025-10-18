Products:

product_id (PK)

name

description

unit

Suppliers:

supplier_id (PK)

name

contact_info

Customers:

customer_id (PK)

name

contact_info

Employees:

employee_id (PK)

name

role (salesman, riding_man, cashier, etc.)

Purchases:

purchase_id (PK)

supplier_id (FK → Suppliers)

purchase_date

total_amount

paid_amount

due_amount

Purchase_Items:

purchase_item_id (PK)

purchase_id (FK → Purchases)

product_id (FK → Products)

quantity

unit_price

Sales:

sale_id (PK)

customer_id (FK → Customers, nullable for walk-in cash sales)

employee_id (FK → Employees, nullable if direct sale)

sale_date

total_amount

paid_amount

due_amount

invoice_type (small | large)

Sale_Items:

sale_item_id (PK)

sale_id (FK → Sales)

product_id (FK → Products)

quantity

unit_price

Stock:

stock_id (PK)

product_id (FK → Products)

location (warehouse | store)

quantity

Stock_Transfers:

transfer_id (PK)

product_id (FK → Products)

from_location

to_location

quantity

date

Employee_Stock:

id (PK)

employee_id (FK → Employees)

product_id (FK → Products)

quantity_in_hand

Accounts:

account_id (PK)

type (supplier | customer | employee | cashier | safe | saraf)

ref_id (nullable, FK depending on type)

name

opening_balance

current_balance

Account_Transactions (Ledger):

transaction_id (PK)

account_id (FK → Accounts)

date

transaction_type (Sale, Purchase, Payment, Transfer, etc.)

amount (positive = credit, negative = debit)

reference_type (sale | purchase | transfer | expense)

reference_id (FK to respective table)

description

Expenses:

expense_id (PK)

category (fuel, salary, transport, packaging, etc.)

amount

date

description

Audit_Logs (for Update/Delete tracking):

log_id (PK)

table_name (e.g., Sales, Purchases)

record_id (PK value of the affected row)

operation (INSERT | UPDATE | DELETE)

old_data (JSON / snapshot before change)

new_data (JSON / snapshot after change)

changed_by (user/admin)

changed_at (timestamp)

✅ This is the clean and final design:

Covers inventory, purchases, sales, employee stock, expenses, accounts, and ledger.

Supports Dakhal, Tajri, Saraf as accounts.

Keeps full audit trail via Audit_Logs.
