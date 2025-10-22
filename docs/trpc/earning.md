# Earnings Router (`earningsRouter`)

This router handles all operations related to user earnings, withdrawal methods, and transaction history. It includes features for fetching user earnings, creating crypto or bank withdrawals, and viewing withdrawal options.

---

# Table of Contents

1. [Earnings Router (`earningsRouter`)](#earnings-router-earningsrouter)
2. [Overview](#overview)
3. [Procedures](#procedures)
   - [getUserEarnings](#getuserearnings)
     - [Type](#type)
     - [Called As](#called-as)
     - [Description](#description)
     - [Example Input](#example-input)
     - [Example Output](#example-output)
     - [Notes](#notes)
   - [getEarningSummary](#getearningsummary)
     - [Type](#type-1)
     - [Called As](#called-as-1)
     - [Description](#description-1)
     - [Example Input](#example-input-1)
     - [Example Output](#example-output-1)
     - [Notes](#notes-1)
   - [getTransactionHistory](#gettransactionhistory)
     - [Type](#type-2)
     - [Called As](#called-as-2)
     - [Description](#description-2)
     - [Example Input](#example-input-2)
     - [Example Output](#example-output-2)
     - [Notes](#notes-2)
   - [getWithdrawalOptions](#getwithdrawaloptions)
     - [Type](#type-3)
     - [Called As](#called-as-3)
     - [Description](#description-3)
     - [Example Input](#example-input-3)
     - [Example Output](#example-output-3)
     - [Notes](#notes-3)
   - [createCryptoWithdrawal](#createcryptowithdrawal)
     - [Type](#type-4)
     - [Called As](#called-as-4)
     - [Description](#description-4)
     - [Example Input](#example-input-4)
     - [Example Output](#example-output-4)
     - [Notes](#notes-4)
   - [createBankWithdrawal](#createbankwithdrawal)
     - [Type](#type-5)
     - [Called As](#called-as-5)
     - [Description](#description-5)
     - [Example Input](#example-input-5)
     - [Example Output](#example-output-5)
     - [Notes](#notes-5)

---

## Overview

The `earningsRouter` provides several procedures related to user earnings, transactions, and withdrawal methods. It supports fetching earnings stats, viewing withdrawal options, creating crypto or bank withdrawals, and retrieving transaction history.

---

## Procedures

### `getUserEarnings`

**Type**: `query`  
**Called As**: `earnings.getUserEarnings()`  
**Description**: Retrieves detailed earnings information for the authenticated user, including total earnings, tasks completed, streaks, and more.

#### Example Input

None (no input required).

#### Example Output

```json
{
  "totalEarnings": "1000.50",
  "totalEarningsUsd": 1000.5,
  "totalTasksCompleted": 150,
  "currentStreak": 10,
  "longestStreak": 20,
  "totalTimeSpent": 3000,
  "averageRating": "4.5",
  "totalCoursesCompleted": 5,
  "lastActivityAt": "2025-10-10T12:00:00.000Z"
}
```

### Notes

-- **Returns earnings-related statistics for the user**
-- **All fields are derived from the userStats table**
-- **If no stats exist for the user, a NOT_FOUND error is returned**

### `getEarningSummary`

**Type**: `query`  
**Called As**: `earnings.getEarningSummary()`  
**Description**: Retrieves a summary of the user's earnings, including total earnings, fiat value, tasks completed, and time spent.

#### Example Input

None (no input required).

#### Example Output

```json
{
  "totalEarned": "1000.50",
  "fiatValue": "1000.50",
  "tasksCompleted": 150,
  "timeSpent": "3000 mins"
}
```

### Notes

-- **Converts the total earnings to USD for fiat value (can be customized for other currencies)**
-- **The totalEarned and fiatValue are derived from the user's totalEarnings in the userStats table**
-- **The tasksCompleted and timeSpent are also fetched from the userStats table**
-- **If no stats are found for the user, a NOT_FOUND error is returned**

### `getTransactionHistory`

**Type**: `query`  
**Called As**: `earnings.getTransactionHistory()`  
**Description**: Retrieves a list of the user's transaction history (either earning or withdrawal). This procedure can be filtered by transaction type (EARNING or WITHDRAWAL).

#### Example Input

```json
{
  "limit": 20,
  "offset": 0,
  "type": "EARNING"
}
```

#### Example Output

```json
{
  "withdrawals": [
    {
      "transactionId": "txn-uuid-1",
      "amount": "50.00",
      "currency": "USD",
      "timestamp": "2025-10-10T12:00:00.000Z"
    }
  ],
  "earnings": [
    {
      "transactionId": "txn-uuid-2",
      "amount": "100.00",
      "currency": "ETH",
      "timestamp": "2025-10-10T12:30:00.000Z"
    }
  ]
}
```

### Notes

-- **Filters**: `Supports filtering by transaction type (EARNING, WITHDRAWAL). By default, both types will be returned unless a filter is specified`
-- **Pagination:** `Pagination is controlled via limit and offset`
-- **Wallet Check:** `The procedure requires an active wallet (isActive = 1) for the user to fetch transactions. If no active wallet is found, a NOT_FOUND error is thrown`
-- **Transaction Types:** `Based on the type provided in the input, either withdrawals or earnings will be returned in the output. If type is not specified or if it is set to EARNING, the procedure fetches earnings from the user’s wallet address. If set to WITHDRAWAL, it fetches withdrawal data`
-- **Error Handling:** `If no transactions of the specified type are found, the corresponding list (either withdrawals or earnings) will be empty, but no error is thrown`

### `getWithdrawalOptions`

**Type**: `query`  
**Called As**: `earnings.getWithdrawalOptions()`  
**Description**: Retrieves all withdrawal methods available for the authenticated user. Each method represents a previously added withdrawal option (e.g., bank account or crypto wallet).

#### Example Input

None (no input required).

#### Example Output

```json
[
  {
    "methodId": "method-uuid-1",
    "userId": "user-uuid-123",
    "method": "CRYPTO_WALLET",
    "currency": "ETH",
    "address": "0xabc123...",
    "createdAt": "2025-10-10T12:00:00.000Z"
  },
  {
    "methodId": "method-uuid-2",
    "userId": "user-uuid-123",
    "method": "BANK_ACCOUNT",
    "currency": "USD",
    "accountNumber": "1234567890",
    "bankName": "Example Bank",
    "createdAt": "2025-10-09T10:30:00.000Z"
  }
]
```

#### Notes

- **No input is required** — the query automatically retrieves withdrawal methods for the currently authenticated user (`ctx.user.id`).
- **Supported methods include**:
  - `CRYPTO_WALLET` — for crypto withdrawals (e.g., ETH, BTC, USDT).
  - `BANK_ACCOUNT` — for fiat withdrawals.
- **Data source**: Retrieved from the `userWithdrawalMethods` table.
- If the user has not added any withdrawal methods, an **empty array** is returned instead of throwing an error.

### `createCryptoWithdrawal`

**Type**: `mutation`  
**Called As**: `earnings.createCryptoWithdrawal()`  
**Description**: Initiates a crypto withdrawal for the authenticated user. This procedure checks for sufficient balance in the user's wallet before processing the request.

#### Example Input

````json
{
  "amount": "100.00",
  "tokenAddress": "0x123abc...",
  "destinationAddress": "0xabc123...",
  "currency": "ETH"
}

#### Example Output

```json
{
  "success": true
}
````

#### Notes

- **Wallet Check**: Ensures the user has an active wallet (`isActive = 1`). If no active wallet is found, a `NOT_FOUND` error is thrown.
- **Balance Check**: Verifies that the user has sufficient balance for the requested withdrawal. If the balance is insufficient, a `BAD_REQUEST` error is returned.
- **Withdrawal Method**: The method for the withdrawal is `CRYPTO_WALLET`, and it supports withdrawals in various cryptocurrencies like `ETH`, `BTC`, and `USDT`.
- **Status**: The withdrawal request is initially set to `PENDING` status.
- **Error Handling**: If there is an issue during the insertion of the withdrawal into the database, an `INTERNAL_SERVER_ERROR` is thrown.
- **Amount Parsing**: The amount is parsed to a `BigInt` to ensure precision in the balance comparison.

### `createBankWithdrawal`

**Type**: `mutation`  
**Called As**: `earnings.createBankWithdrawal()`  
**Description**: Initiates a bank account withdrawal for the authenticated user. This procedure stores the withdrawal request and processes it by inserting it into the database.

#### Example Input

```json
{
  "amount": "200.00",
  "bankAccountDetails": {
    "accountNumber": "1234567890",
    "routingNumber": "987654321",
    "accountHolderName": "John Doe"
  }
}
```

#### Example Output

```json
{
  "success": true
}
```

#### Notes

- **Withdrawal Method**: The method for the withdrawal is `BANK_ACCOUNT`, indicating that the withdrawal will be made to a bank account.
- **Account Details**: The `bankAccountDetails` are stored as a JSON string, including the account number, routing number, and account holder's name.
- **Status**: The withdrawal request is initially set to `PENDING` status.
- **Error Handling**: If there is an issue during the insertion of the withdrawal into the database, an `INTERNAL_SERVER_ERROR` is thrown.
- **Amount Format**: The amount is provided as a string and is validated using a regular expression to ensure that it has up to two decimal places.
