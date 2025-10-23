# Admin Router (`adminRouter`)

This router handles administrative operations such as managing user status, resolving disputes, viewing statistics, and content management for courses, tutorials, and tasks.

---

# Table of Contents

1. [Admin Router (`adminRouter`)](#admin-router-adminrouter)
2. [Overview](#overview)
3. [Procedures](#procedures)
   - [findUsers](#findusers)
     - [Type](#type)
     - [Called As](#called-as)
     - [Description](#description)
     - [Example Input](#example-input)
     - [Example Output](#example-output)
     - [Notes](#notes)
   - [updateUserStatus](#updateuserstatus)
     - [Type](#type-1)
     - [Called As](#called-as-1)
     - [Description](#description-1)
     - [Example Input](#example-input-1)
     - [Example Output](#example-output-1)
     - [Notes](#notes-1)
   - [resolveDispute](#resolvedispute)
     - [Type](#type-2)
     - [Called As](#called-as-2)
     - [Description](#description-2)
     - [Example Input](#example-input-2)
     - [Example Output](#example-output-2)
     - [Notes](#notes-2)
   - [getDashboardStats](#getdashboardstats)
     - [Type](#type-3)
     - [Called As](#called-as-3)
     - [Description](#description-3)
     - [Example Input](#example-input-3)
     - [Example Output](#example-output-3)
     - [Notes](#notes-3)
   - [getAnalytics](#getanalytics)
     - [Type](#type-4)
     - [Called As](#called-as-4)
     - [Description](#description-4)
     - [Example Input](#example-input-4)
     - [Example Output](#example-output-4)
     - [Notes](#notes-4)
   - [getAllUsers](#getallusers)
     - [Type](#type-5)
     - [Called As](#called-as-5)
     - [Description](#description-5)
     - [Example Input](#example-input-5)
     - [Example Output](#example-output-5)
     - [Notes](#notes-5)
   - [getAllTasksAdmin](#getalltasksadmin)
     - [Type](#type-6)
     - [Called As](#called-as-6)
     - [Description](#description-6)
     - [Example Input](#example-input-6)
     - [Example Output](#example-output-6)
     - [Notes](#notes-6)
   - [getContentManagement](#getcontentmanagement)
     - [Type](#type-7)
     - [Called As](#called-as-7)
     - [Description](#description-7)
     - [Example Input](#example-input-7)
     - [Example Output](#example-output-7)
     - [Notes](#notes-7)

---

## Overview

The `adminRouter` provides several administrative procedures to manage users, resolve disputes, retrieve dashboard statistics, fetch content management data, and analyze platform activity over different periods.

---

## Procedures

### `findUsers`

**Type**: `query`  
**Called As**: `adminRouter.findUsers()`  
**Description**: Searches for users based on various criteria such as email, ID, or status (active, suspended, banned). It supports pagination via `limit` and `page`.

#### Example Input

```json
{
  "search": "example@domain.com",
  "status": "ACTIVE",
  "page": 1,
  "limit": 20
}
```

#### Example Output

```json
{
  "success": true,
  "data": [
    {
      "id": "user-uuid-1",
      "email": "example@domain.com",
      "status": "ACTIVE"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### Notes

- **Status Values**:
  - `ACTIVE`: The user is active.
  - `SUSPENDED`: The user is suspended.
  - `BANNED`: The user is banned.

- **Pagination**: The `limit` defines the number of results per page, and `page` specifies the current page number.

### `updateUserStatus`

**Type**: `mutation`  
**Called As**: `adminRouter.updateUserStatus()`  
**Description**: Updates the status of a user, such as making them active, suspended, or banned. It also logs the status change for administrative purposes.

#### Example Input

```json
{
  "userId": "user-uuid-1",
  "status": "SUSPENDED",
  "reason": "Violation of terms"
}
```

#### Example Output

```json
{
  "success": true,
  "message": "User status updated to SUSPENDED",
  "user": {
    "id": "user-uuid-1",
    "status": "SUSPENDED"
  }
}
```

### Notes

- **Status Values**:
  - `ACTIVE`: The user is active.
  - `SUSPENDED`: The user is suspended.
  - `BANNED`: The user is banned.

- **Error Handling**:
  - If the user is not found, a `NOT_FOUND` error is thrown.
  - If the status update fails, an `INTERNAL_SERVER_ERROR` is thrown.

- **Logging**: The action is logged in the `adminLogs` table, capturing the admin ID, action, target, and reason.

### `resolveDispute`

**Type**: `mutation`  
**Called As**: `adminRouter.resolveDispute()`  
**Description**: Resolves a dispute by either approving or rejecting it. The procedure ensures only admins can resolve disputes and logs the action. It also updates the dispute status and resolution in the database.

#### Example Input

```json
{
  "disputeId": "dispute-uuid-1",
  "outcome": "APPROVE",
  "adminNotes": "The task was completed satisfactorily."
}
```

#### Example Output

```json
{
  "success": true
}
```

### Notes

- **Outcome Values**:
  - `APPROVE`: The dispute is approved.
  - `REJECT`: The dispute is rejected.

- **Error Handling**:
  - If the user is not an admin, a `FORBIDDEN` error is thrown.
  - If the dispute is not found, a `NOT_FOUND` error is thrown.
  - If the dispute is not open, a `BAD_REQUEST` error is thrown.

- **Logging**: The action is logged in the `adminLogs` table, capturing the admin ID, action, target, and reason.

- **Status Update**:
  - The dispute status is updated to `RESOLVED_APPROVE` if the outcome is `APPROVE`, or `RESOLVED_REJECT` if the outcome is `REJECT`.
  - The resolution is recorded as either `APPROVED` or `REJECTED`.

- **Starknet Integration**: Calls the Starknet contract to finalize the resolution based on the outcome.

- **Admin Notes**: Admin can add notes that explain the reasoning behind the resolution.

### `getDashboardStats`

**Type**: `query`  
**Called As**: `adminRouter.getDashboardStats()`  
**Description**: Retrieves various platform statistics, including the total number of users, active tasks, completed tasks, open disputes, total earnings, and platform revenue.

#### Example Input

```json
{}
```

#### Example Output

```json
{
  "totalUsers": 1200,
  "activeTasks": 100,
  "completedTasks": 800,
  "openDisputes": 5,
  "totalEarnings": 12500.5,
  "platformRevenue": 3000.75
}
```

### Notes

- **Error Handling**: If the query fails, an `INTERNAL_SERVER_ERROR` is thrown with the message 'Failed to fetch dashboard stats'.

- **Data Aggregation**:
  - **Total Users**: The total number of users in the platform.
  - **Active Tasks**: The number of tasks with the status `ACTIVE`.
  - **Completed Tasks**: The number of tasks with the status `COMPLETED`.
  - **Open Disputes**: The number of disputes with the status `OPEN`.
  - **Total Earnings**: The sum of earnings across all users, derived from the `userStats` table.
  - **Platform Revenue**: The sum of platform fees across all tasks, derived from the `tasks` table.

- **Calculations**: Earnings and platform revenue are calculated by summing respective values from the database records.

### `getAnalytics`

**Type**: `query`  
**Called As**: `adminRouter.getAnalytics()`  
**Description**: Retrieves analytics data for various platform metrics over a specific period. The available metrics include users, tasks, earnings, and disputes. The period can be one of `7d`, `30d`, `90d`, or `1y`.

#### Example Input

```json
{
  "period": "30d",
  "metric": "tasks"
}
```

#### Example Output

```json
[
  {
    "date": "2025-10-01",
    "count": 10
  },
  {
    "date": "2025-10-02",
    "count": 12
  }
]
```

### Notes

- **Period Values**:
  - `7d`: Data from the last 7 days.
  - `30d`: Data from the last 30 days.
  - `90d`: Data from the last 90 days.
  - `1y`: Data from the last 1 year.

- **Metric Values**:
  - `users`: Number of new users created in the specified period.
  - `tasks`: Number of tasks created in the specified period.
  - `earnings`: Total earnings generated in the specified period.
  - `disputes`: Number of disputes created in the specified period.

- **Error Handling**:
  - If an unsupported metric type is provided, a `BAD_REQUEST` error is thrown.
  - If the query fails, an `INTERNAL_SERVER_ERROR` is thrown with the message 'Failed to fetch analytics data'.

- **Data Aggregation**:
  - The data is grouped by date, and the count or total is calculated for each day.
  - For the `earnings` metric, the total earnings per day are aggregated.

### `getAllUsers`

**Type**: `query`  
**Called As**: `adminRouter.getAllUsers()`  
**Description**: Retrieves a list of users based on various filters such as status, role, search term, and pagination. Supports filtering by user status, role, and search term for name or email.

#### Example Input

```json
{
  "limit": 20,
  "offset": 0,
  "status": "ACTIVE",
  "role": "CREATOR",
  "search": "john.doe"
}
```

#### Example Output

```json
{
  "users": [
    {
      "id": "user-uuid-1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "CREATOR",
      "status": "ACTIVE",
      "createdAt": "2025-10-10T12:00:00.000Z"
    }
  ],
  "total": 150
}
```

### Notes

- **Status Values**:
  - `ACTIVE`: The user is active.
  - `SUSPENDED`: The user is suspended.
  - `BANNED`: The user is banned.

- **Role Values**:
  - `CREATOR`: The user is a creator.
  - `COMPLETER`: The user is a completer.
  - `ADMIN`: The user is an admin.

- **Error Handling**:
  - If no users match the given filters, an empty list is returned, but no error is thrown.

- **Pagination**:
  - **`limit`**: Defines the number of users returned per page. The default value is `20` and the maximum is `100`.
  - **`offset`**: Defines the starting point for the pagination. The default value is `0`.

- **Search**:
  - The `search` parameter allows filtering users by their name or email using a case-insensitive partial match.

- **Sorting**:
  - Users are sorted by their `createdAt` field in descending order.

- **Data Aggregation**:
  - The total number of users that match the filters is calculated and returned in the `total` field.

- **Pagination**:
  - This procedure uses the `limit` and `offset` parameters for pagination, making it efficient for retrieving subsets of users.

### `getAllTasksAdmin`

**Type**: `query`  
**Called As**: `adminRouter.getAllTasksAdmin()`  
**Description**: Retrieves a list of tasks based on various filters such as status, creator ID, and pagination. Supports filtering by task status and task creator, and includes pagination options.

#### Example Input

```json
{
  "limit": 20,
  "offset": 0,
  "status": "ACTIVE",
  "creatorId": "creator-uuid-1"
}
```

#### Example Output

```json
{
  "tasks": [
    {
      "id": "task-uuid-1",
      "title": "Task 1",
      "status": "ACTIVE",
      "rewardAmount": 100,
      "requiredCompletions": 5,
      "approvedCompletions": 3,
      "deadline": "2025-10-15T12:00:00.000Z",
      "creatorUserId": "creator-uuid-1",
      "createdAt": "2025-10-10T12:00:00.000Z"
    }
  ],
  "total": 50
}
```

### Notes

- **Status Values**:
  - `DRAFT`: The task is in draft status.
  - `ACTIVE`: The task is active and open for completion.
  - `COMPLETED`: The task has been completed.
  - `CANCELLED`: The task has been cancelled.
  - `DISPUTED`: The task is under dispute.

- **Error Handling**:
  - If no tasks match the given filters, an empty list is returned, but no error is thrown.

- **Pagination**:
  - **`limit`**: Defines the number of tasks returned per page. The default value is `20` and the maximum is `100`.
  - **`offset`**: Defines the starting point for the pagination. The default value is `0`.

- **Filters**:
  - **Status Filter**: Filters tasks by their status (`DRAFT`, `ACTIVE`, `COMPLETED`, `CANCELLED`, `DISPUTED`).
  - **Creator Filter**: Filters tasks by the creator's user ID.

- **Sorting**:
  - Tasks are sorted by their `createdAt` field in descending order.

- **Data Aggregation**:
  - The total number of tasks that match the filters is calculated and returned in the `total` field.

- **Pagination**:
  - This procedure uses the `limit` and `offset` parameters for pagination, making it efficient for retrieving subsets of tasks.

### `getContentManagement`

**Type**: `query`  
**Called As**: `adminRouter.getContentManagement()`  
**Description**: Retrieves content based on the specified type, which can be `courses`, `tutorials`, or `tasks`. If no type is specified, all types of content (courses, tutorials, and tasks) are returned.

#### Example Input

```json
{
  "type": "tasks"
}
```

#### Example Output

```json
{
  "type": "tasks",
  "data": [
    {
      "id": "task-uuid-1",
      "title": "Task 1",
      "status": "ACTIVE",
      "category": "Category 1",
      "rewardAmount": 100,
      "creatorUserId": "creator-uuid-1",
      "createdAt": "2025-10-10T12:00:00.000Z"
    }
  ]
}
```

### Notes

- **Type Values**:
  - `courses`: Retrieves a list of courses.
  - `tutorials`: Retrieves a list of tutorials.
  - `tasks`: Retrieves a list of tasks.
  - **Default**: If no `type` is specified, returns data for `courses`, `tutorials`, and `tasks` together under the `type: 'all'` category.

- **Sorting**:
  - Content is sorted by the `createdAt` field in descending order for all types (`courses`, `tutorials`, `tasks`).

- **Columns**:
  - For `tasks`, the procedure returns the following columns:
    - `id`, `title`, `status`, `category`, `rewardAmount`, `creatorUserId`, `createdAt`

- **Data Aggregation**:
  - The procedure fetches the content from the database and groups them by their respective types (`courses`, `tutorials`, `tasks`).

- **Error Handling**:
  - If no content matches the specified type, an empty list is returned for that content type, but no error is thrown.

- **Pagination**: This procedure does not include pagination, as it returns all available content of the specified type.

- **Content Categories**:
  - The `type` field will specify whether the content is related to `courses`, `tutorials`, or `tasks`.
