# Net Profit Calculation Plan

## Overview
This document outlines how Net Profit is calculated in the Khorma System and addresses questions about income, expenses, and cash accounts.

## Understanding Profit Components

### 1. Gross Profit (from Sales)
- **Source**: Already calculated and stored in `saleItem.profit` field
- **Calculation**: `profit = (unitPrice × quantity) - totalCost`
- **Where**: Every time a sale is created, profit is calculated per item and saved
- **Formula**: Sum of all `saleItem.profit` where `isDeleted = false`

### 2. Other Income (Dakhal - Income Records)
- **Source**: `Income` model records
- **Description**: Additional income beyond sales (e.g., interest, rental income, grants, etc.)
- **Note**: These are NOT the cash accounts (cashier/safe/saraf), but income category records
- **Formula**: Sum of all `Income.amount` where `isDeleted = false`

### 3. Expenses (Tajri/Saraf - Expense Records)
- **Source**: `Expense` model records
- **Description**: Business expenses (e.g., rent, utilities, salaries, etc.)
- **Note**: Expenses can be paid from cashier/safe/saraf accounts, but the account type doesn't matter for profit calculation
- **Formula**: Sum of all `Expense.amount` where `isDeleted = false`

## Net Profit Formula

```
Net Profit = Gross Profit (from Sales) + Other Income - Expenses

Where:
- Gross Profit = Σ(saleItem.profit) for all non-deleted sales
- Other Income = Σ(Income.amount) for all non-deleted income records
- Expenses = Σ(Expense.amount) for all non-deleted expense records
```

## Important Clarifications

### About Dakhal, Tajri, and Saraf Accounts

**❌ These are NOT counted in profit calculation:**
- `cashier` (Dakhal) - Cash register account
- `safe` (Tajri) - Safe/vault account  
- `saraf` (Saraf) - Credit/credit account

**Why?**
- These are **storage accounts** where money is held, not income or expense categories
- They represent **where money goes** (cash flow), not **what the money is for** (revenue/expense)
- Moving money between accounts (e.g., from cashier to safe) doesn't create profit or loss

**Example:**
- Sale of 1000 AFN → Money goes to "cashier" account
  - ✅ This contributes to profit (through the sale's profit calculation)
  - ❌ The "cashier" account itself is NOT income
  
- Expense of 200 AFN → Money comes from "cashier" account
  - ✅ This reduces profit (through expense calculation)
  - ❌ The "cashier" account itself is NOT an expense

### What IS Counted in Profit?

✅ **Counted in Net Profit:**
1. **Sale Items Profit**: Already calculated per sale item
2. **Income Records**: All records in the `Income` collection
3. **Expense Records**: All records in the `Expense` collection

❌ **NOT Counted:**
- Account balances (cashier/safe/saraf)
- Money transfers between accounts
- Customer/Supplier account balances
- Employee account balances

## Implementation

### API Endpoints

1. **GET /api/v1/profit/net**
   - Calculate net profit for a date range
   - Returns: gross profit, other income, expenses, net profit
   - Query params: `startDate`, `endDate` (optional)

2. **GET /api/v1/profit/stats**
   - Detailed profit statistics
   - Breakdown by category, month, etc.
   - Query params: `startDate`, `endDate` (optional)

3. **GET /api/v1/profit/summary**
   - Summary grouped by day/week/month
   - Query params: `startDate`, `endDate`, `groupBy`

## Date Filtering

All calculations support date range filtering:
- `startDate`: ISO date string (e.g., "2024-01-01")
- `endDate`: ISO date string (e.g., "2024-12-31")
- If not provided, calculates for all time

## Example Calculation

```
Period: January 2024

Sales:
  - Sale Item 1: Profit = 500 AFN
  - Sale Item 2: Profit = 300 AFN
  - Sale Item 3: Profit = 200 AFN
  Gross Profit = 1000 AFN

Income:
  - Interest Income: 50 AFN
  - Rental Income: 100 AFN
  Other Income = 150 AFN

Expenses:
  - Rent: 200 AFN
  - Utilities: 100 AFN
  - Salaries: 300 AFN
  Expenses = 600 AFN

Net Profit = 1000 + 150 - 600 = 550 AFN
```

## Notes

- All calculations exclude soft-deleted records (`isDeleted = false`)
- Dates are based on sale date, income date, and expense date fields
- Profit calculations are done using MongoDB aggregation for performance
- Historical data can be recalculated anytime (no stored aggregated values)

