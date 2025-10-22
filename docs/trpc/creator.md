# Creator Router (`creatorRouter`)

This router contains procedures related to the creator's dashboard, tasks, and analytics. It provides functionalities such as fetching dashboard stats, viewing tasks, and getting analytics based on periods like 7, 30, or 90 days.

---

# Table of Contents

1. [getCreatorDashboard](#getcreatordashboard)
   - [Type](#type)
   - [Called As](#called-as)
   - [Description](#description)
   - [Example Input](#example-input)
   - [Example Output](#example-output)
   - [Notes](#notes)
2. [getCreatorTasks](#getcreatortasks)
   - [Type](#type-1)
   - [Called As](#called-as-1)
   - [Description](#description-1)
   - [Example Input](#example-input-1)
   - [Example Output](#example-output-1)
   - [Notes](#notes-1)
3. [getCreatorAnalytics](#getcreatoranalytics)
   - [Type](#type-2)
   - [Called As](#called-as-2)
   - [Description](#description-2)
   - [Example Input](#example-input-2)
   - [Example Output](#example-output-2)
   - [Notes](#notes-2)

---

## `getCreatorDashboard`

**Type**: `query`  
**Called As**: `creatorRouter.getCreatorDashboard()`  
**Description**: Retrieves a dashboard overview for the creator, including total tasks, active tasks, completed tasks, and total earnings.

#### Example Input

```json
{}
```

#### Example Output

```json
{
  "totalTasks": 50,
  "activeTasks": 30,
  "completedTasks": 20,
  "totalEarnings": 1200
}
```

### Notes

- **Total Tasks**: The total number of tasks created by the creator.
- **Active Tasks**: The number of tasks with the status `ACTIVE`.
- **Completed Tasks**: The number of tasks with the status `COMPLETED`.
- **Total Earnings**: The total earnings of the creator from the `userStats` table.

### `getCreatorTasks`

**Type**: `query`  
**Called As**: `creatorRouter.getCreatorTasks()`  
**Description**: Retrieves a list of tasks created by the creator, with optional filtering by task status, pagination, and sorting.

#### Example Input

```json
{
  "status": "ACTIVE",
  "limit": 20,
  "offset": 0
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
      "createdAt": "2025-10-01T12:00:00.000Z"
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

- **Error Handling**:
  - If no tasks match the given filters, an empty list is returned, but no error is thrown.

- **Pagination**:
  - **`limit`**: Defines the number of tasks returned per page. The default value is `20` and the maximum is `50`.
  - **`offset`**: Defines the starting point for pagination. The default value is `0`.

- **Filters**:
  - **Status Filter**: Filters tasks by their status (`DRAFT`, `ACTIVE`, `COMPLETED`, `CANCELLED`).

- **Sorting**:
  - Tasks are sorted by the `createdAt` field in ascending order.

- **Data Aggregation**:
  - The total number of tasks that match the filters is calculated and returned in the `total` field.

- **Pagination**:
  - This procedure uses the `limit` and `offset` parameters for pagination, making it efficient for retrieving subsets of tasks.

### `getCreatorAnalytics`

**Type**: `query`  
**Called As**: `creatorRouter.getCreatorAnalytics()`  
**Description**: Retrieves analytics for the creator's tasks, submissions, and earnings over a specified period (`7d`, `30d`, `90d`).

#### Example Input

```json
{
  "period": "30d"
}
```

#### Example Output

```json
{
  "tasksCreated": 15,
  "submissionsReceived": 25,
  "totalEarnings": 500
}
```

### Notes

- **Period Values**:
  - `7d`: Data from the last 7 days.
  - `30d`: Data from the last 30 days.
  - `90d`: Data from the last 90 days.

- **Tasks Created**: The number of tasks created by the creator in the specified period.

- **Submissions Received**: The number of submissions received for the creator's tasks in the specified period.

- **Total Earnings**: The total earnings of the creator from the `userStats` table, calculated over the specified period.

- **Data Aggregation**:
  - **Tasks Created**: Calculated based on tasks created within the period.
  - **Submissions Received**: Calculated based on submissions for the creator's tasks within the period.
  - **Total Earnings**: Aggregated from the `userStats` table.

- **Error Handling**:
  - If no data matches the given period, it returns `0` for tasks created, submissions received, and earnings.
