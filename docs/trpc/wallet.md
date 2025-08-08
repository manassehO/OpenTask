# Wallet Router (`walletRouter`)

This router manages all wallet-related operations within the OpenTask app, specifically handling self-custody StarkNet wallet registration and transaction history retrieval for authenticated users.

---

# Table of Contents

1. [Wallet Router (`walletRouter`)](#wallet-router-walletrouter)
2. [Overview](#overview)
3. [Procedures](#procedures)
   - [saveWallet](#savewallet)
     - [Type](#type)
     - [Called As](#called-as)
     - [Description](#description)
     - [Example Input](#example-input)
     - [Example Output](#example-output)
     - [Notes](#notes)
   - [getTransactionHistory](#gettransactionhistory)
     - [Type](#type-1)
     - [Called As](#called-as-1)
     - [Description](#description-1)
     - [Example Input](#example-input-1)
     - [Example Output](#example-output-1)
     - [Notes](#notes-1)

---

## Overview

The `walletRouter` provides two protected procedures:

1. **saveWallet** – Allows a logged-in user to securely link or update their self-custody StarkNet wallet by submitting a valid address and private key.
2. **getTransactionHistory** – Fetches a paginated list of on-chain events for a user's registered wallets, optionally filtered by token.

Both procedures are protected and require user authentication (`protectedProcedure`).

---

## Procedures

### `saveWallet`

**Type**: `mutation`  
**Called As**: `wallet.saveWallet()`
**Description**: Saves or updates a user's StarkNet wallet. Validates the address format, ensures wallet uniqueness across users, and securely hashes the private key before storing.

#### Example Input

```json
{
  "starknetAddress": "0xabc123...456def", // Required: 64-char hex string, lowercase enforced
  "privateKey": "user-private-key" // Required: Non-empty string
}
```

#### Example Output

```json
{
  "success": true,
  "wallet": {
    "walletId": "abc123...",
    "userId": "user-id-here",
    "starknetAddress": "0x...",
    "walletType": "self_custody",
    "isActive": 1,
    "createdAt": "2025-08-07T12:00:00.000Z",
    "updatedAt": "2025-08-07T12:00:00.000Z"
  }
}
```

#### Notes

- If the wallet already exists and belongs to the user, it is updated with the new private key

- If it does not exist, a new wallet is created and marked as isActive = 1

- Private key is securely hashed using bcrypt before being saved

- Multiple wallets can’t share the same address unless owned by the same user

### `getTransactionHistory`

**Type**: `query`  
**Called As**: `wallet.getTransactionHistory()`
**Description**: Retrieves on-chain events associated with the user's active wallets. Events can be optionally filtered by token

#### Example Input

```json
{
  "limit": 10,
  "offset": 0,
  "token": "ETH" // Optional: Filter by token symbol
}
```

#### Example Output

```json
[
  {
    "eventId": "evt-uuid-1",
    "walletAddress": "0xabc...",
    "token": "ETH",
    "eventType": "TRANSFER",
    "amount": "2.5",
    "timestamp": "2025-08-07T11:00:00.000Z"
  },
  {
    "eventId": "evt-uuid-2",
    "walletAddress": "0xabc...",
    "token": "ETH",
    "eventType": "SWAP",
    "amount": "1.0",
    "timestamp": "2025-08-07T10:30:00.000Z"
  }
]
```

#### Notes

- Only events related to active wallets (isActive = 1) of the current user are returned

- Supports optional filtering by token (e.g., "ETH", "DAI")

- Results are ordered by timestamp in descending order (most recent first)

- Pagination is handled via limit and offset
