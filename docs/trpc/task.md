# Task Router (`taskRouter`)

This router handles all task-related procedures.

## Table of Contents

1. [Task Router (`taskRouter`)](#task-router-taskrouter)
2. [Procedures](#procedures)
   - [getTaskById](#gettaskbyid)
     - [Type](#type-query)
     - [Description](#description-retrieve-a-single-task-by-its-unique-id-along-with-the-creators-display-name)
     - [Example Input](#example-input)
     - [Output](#output)
   - [createTask](#createtask)
     - [Type](#type-mutation)
     - [Description](#description-create-a-new-task-only-users-with-the-creator-role-are-authorized-to-perform-this-action)
     - [Example Input](#example-input-1)
     - [Output](#output-1)
     - [Note](#note)
   - [findTasks](#findtasks)
     - [Type](#type-mutation-1)
     - [Description](#description-retrieve-a-paginated-list-of-active-tasks-with-optional-filtering-by-category-minimum-reward-and-sorting)
     - [Example Input](#example-input-2)
     - [Example Output](#example-output)
     - [Notes](#notes)
   - [claimTask](#claimtask)
     - [Type](#type-mutation-2)
     - [Description](#description-allows-a-user-with-the-completer-role-to-claim-a-spot-to-complete-an-active-task-if-there-are-available-slots)
     - [Example Input](#example-input-3)
     - [Example Output](#example-output-1)
     - [Notes](#notesnotes)
   - [rejectSubmission](#rejectsubmission)
     - [Type](#type-mutation-3)
     - [Description](#description-allows-a-user-with-the-creator-role-to-reject-a-submission-associated-with-one-of-their-tasks-providing-a-reason-for-the-rejection)
     - [Example Input](#example-input-4)
     - [Example Output](#example-output-2)
     - [Notes](#notes-1)
   - [submitTask](#submittask)
     - [Type](#type-mutation-4)
     - [Description](#description-allows-a-user-to-submit-their-completed-work-for-a-task-they-have-claimed)
     - [Example Input](#example-input-5)
     - [Example Output](#example-output-3)
     - [Notes](#notes-2)
     - [Possible Errors](#possible-errors)
   - [getDisputes](#getdisputes)
     - [Type](#type-mutation-5)
     - [Description](#description-allows-an-admin-user-to-retrieve-a-paginated-list-of-disputes)
     - [Example Input](#example-input-6)
     - [Example Output](#example-output-4)
     - [Notes](#notes-3)
     - [Possible Errors](#possible-errors-1)
   - [initiateDispute](#initiatedispute)
     - [Type](#type-mutation-6)
     - [Description](#description-allows-a-user-to-initiate-a-dispute-for-a-rejected-submission)
     - [Example Input](#example-input-7)
     - [Example Output](#example-output-5)
     - [Notes](#notes-4)
   - [approveSubmission](#approvesubmission)
     - [Type](#type-mutation-7)
     - [Description](#description-allows-a-task-creator-to-approve-a-pending_review-submission)
     - [Example Input](#example-input-8)
     - [Example Output](#example-output-6)
     - [Notes](#notes-5)
   - [getRecommendedTasks](#getRecommendedTasks)
     - [Type](#type-1)
     - [Called As](#called-as-2)
     - [Description](#description-2)
     - [Example Input](#example-input-2)
     - [Example Output](#example-output-2)
     - [Notes](#notes-2)
   - [getTasksByStatus](#getTasksByStatus)
     - [Type](#type-2)
     - [Called As](#called-as-2)
     - [Description](#description-2)
     - [Example Input](#example-input-2)
     - [Example Output](#example-output-2)
     - [Notes](#notes-2)
   - [cancelTask](#cancelTask)
     - [Type](#type-2)
     - [Called As](#called-as-2)
     - [Description](#description-2)
     - [Example Input](#example-input-2)
     - [Example Output](#example-output-2)
     - [Notes](#notes-2)
   - [getTaskCategories](#getTaskCategories)
     - [Type](#type-2)
     - [Called As](#called-as-2)
     - [Description](#description-2)
     - [Example Input](#example-input-2)
     - [Example Output](#example-output-2)
     - [Notes](#notes-2)
   - [getUserClaimedTasks](#getUserClaimedTasks)
     - [Type](#type-2)
     - [Called As](#called-as-2)
     - [Description](#description-2)
     - [Example Input](#example-input-2)
     - [Example Output](#example-output-2)
     - [Notes](#notes-2)
   - [editTask](#editTask)
     - [Type](#type-2)
     - [Called As](#called-as-2)
     - [Description](#description-2)
     - [Example Input](#example-input-2)
     - [Example Output](#example-output-2)
     - [Notes](#notes-2)
   - [updateTaskStatus](#updateTaskStatus)
     - [Type](#type-2)
     - [Called As](#called-as-2)
     - [Description](#description-2)
     - [Example Input](#example-input-2)
     - [Example Output](#example-output-2)
     - [Notes](#notes-2)

---

## StarkNet Transaction Handling

> ⚠️ **Important Note**  
> All StarkNet blockchain transactions (e.g., approving submissions, initiating disputes) are handled **exclusively on the frontend** using **[Chipisdk](https://www.npmjs.com/package/chipisdk)**.  
> This router does **not** broadcast or sign any on-chain transactions. it only stores metadata (such as wallet addresses and transaction hashes) for auditability and consistency.

---

## Procedures

### `getTaskById`

**Type**: `query`  
**Description**: Retrieve a single task by its unique ID along with the creator's display name.

---

#### Example Input

```json
{
  "taskId": "3fa85f64-5717-4562-b3fc-2c963f66afa6" // Required
}
```

#### Output

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "title": "Translate a YouTube video",
  "description": "Translate a tech video from English to Spanish",
  "status": "PUBLISHED",
  "createdAt": "2025-08-06T14:23:00Z",
  "updatedAt": null,
  "creatorId": "user_23a3a",
  "creatorDisplayName": "Ibrahim A."
}
```

---

### `createTask`

**Type**: `mutation`  
**Description**: Create a new task. Only users with the `CREATOR` role are authorized to perform this action.

---

#### Example Input

```json
{
  "title": "Translate a YouTube video",
  "description": "Translate a tech video from English to Spanish",
  "instructions": "Use accurate technical terms. Submit a subtitle file in .srt format.",
  "category": "Translation",
  "rewardAmount": 50,
  "rewardTokenAddress": "0x123456789abcdef123456789abcdef123456789a",
  "platformFee": 5,
  "approvedCompletions": 0,
  "inProgressCompletions": 0,
  "requiredCompletions": 10,
  "deadline": "2025-09-01T23:59:59Z",
  "image": "https://example.com/task-thumbnail.png",
  "status": "DRAFT",
  "fundingTxHash": "0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abcd",
  "maxCompletions": 20
}
```

#### Output

```json
{
  "success": true,
  "task": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "creatorUserId": "user_23a3a",
    "title": "Translate a YouTube video",
    "description": "Translate a tech video from English to Spanish",
    "instructions": "Use accurate technical terms. Submit a subtitle file in .srt format.",
    "category": "Translation",
    "rewardAmount": 50,
    "rewardTokenAddress": "0x123456789abcdef123456789abcdef123456789a",
    "platformFee": 5,
    "approvedCompletions": 0,
    "inProgressCompletions": 0,
    "requiredCompletions": 10,
    "deadline": "2025-09-01T23:59:59Z",
    "image": "https://example.com/task-thumbnail.png",
    "status": "DRAFT",
    "fundingTxHash": "0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abcd",
    "createdAt": "2025-08-07T12:00:00Z",
    "updatedAt": "2025-08-07T12:00:00Z",
    "maxCompletions": 20
  }
}
```

#### Note

- If the user does not have the CREATOR role, a FORBIDDEN error is returned
- createdAt and updatedAt are automatically set on creation

---

### `findTasks`

**Type**: `mutation`  
**Description**: Retrieve a paginated list of active tasks with optional filtering by category, minimum reward, and sorting.

---

#### Example Input

```json
{
  "category": "Translation", // Optional: filter by category
  "min_reward": 25, // Optional: filter by minimum reward
  "sort_by": "reward", // Optional: "reward" or "created_at" (default: created_at)
  "order": "desc", // Optional: "asc" or "desc" (default: desc)
  "limit": 10, // Optional: number of results per page (max: 30, default: 10)
  "page": 1 // Optional: page number (default: 1)
}
```

#### Example Output

```json
{
  "success": true,
  "tasks": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "creatorUserId": "user_23a3a",
      "title": "Translate a YouTube video",
      "description": "Translate a tech video from English to Spanish",
      "instructions": "Use accurate technical terms. Submit a subtitle file in .srt format.",
      "category": "Translation",
      "rewardAmount": 50,
      "rewardTokenAddress": "0x123456789abcdef123456789abcdef123456789a",
      "platformFee": 5,
      "approvedCompletions": 0,
      "inProgressCompletions": 0,
      "requiredCompletions": 10,
      "deadline": "2025-09-01T23:59:59Z",
      "image": "https://example.com/task-thumbnail.png",
      "status": "ACTIVE",
      "fundingTxHash": "0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abcd",
      "createdAt": "2025-08-07T12:00:00Z",
      "updatedAt": "2025-08-07T12:00:00Z",
      "maxCompletions": 20
    }
  ],
  "totalCount": 1
}
```

#### Notes

- Only tasks with status: "ACTIVE" are returned

- You can filter by category (case-insensitive), and by min_reward (inclusive)

- Supports pagination with limit and page

- Sorting can be applied using sort_by (reward or created_at) and order (asc or desc)

- Maximum allowed limit per page is 30

- If an error occurs during query execution, an INTERNAL_SERVER_ERROR is returned

---

### `claimTask`

**Type**: `mutation`  
**Description**: Allows a user with the `COMPLETER` role to claim a spot to complete an active task, if there are available slots

---

#### Example Input

```json
{
  "taskId": "3fa85f64-5717-4562-b3fc-2c963f66afa6" // Required: The ID of the task to claim
}
```

#### Exampke Output

```json
{
  "success": true,
  "message": "Task claimed successfully"
}
```

#### NotesNotes:

- Only users with the COMPLETER role can claim a task

- A task must exist and be in ACTIVE status to be claimable

The system calculates available slots as:

```json
maxCompletions - approvedCompletions - inProgressCompletions
```

- If no slots are available, a BAD_REQUEST error is returned with the message "No available slots"

- If the task is not found, a NOT_FOUND error is returned

- If the user is not authorized (!COMPLETER), a FORBIDDEN error is returned

- On success:
  - A new record is inserted into the task_claims table.

  - The inProgressCompletions field on the task is incremented by 1 using a transactional update.

---

### `rejectSubmission`

**Type**: `mutation`  
**Description**: Allows a user with the `CREATOR` role to reject a submission associated with one of their tasks, providing a reason for the rejection.

---

#### Example Input

```json
{
  "submissionId": "2abf8d12-b234-4e91-9cde-06f1ec11478f", // Required: UUID of the submission
  "reason": "The translated content does not match the original video context and tone." // Required: Reason (10–500 characters)
}
```

#### Example Output

```json
{
  "success": true
}
```

#### Notes

- Only users with the CREATOR role can reject submissions.

- The submission must:
  - Exist in the database

  - Be associated with a task created by the current user

  - Be in the PENDING_REVIEW status

- If any of the above checks fail, the procedure throws appropriate TRPC errors:
  - FORBIDDEN: If the user is not a creator or doesn't own the task.

  - NOT_FOUND: If the submission does not exist.

  - BAD_REQUEST: If the submission is not pending review.

- On success:
  - The submission’s status is updated to "REJECTED".

  - The reviewedAt timestamp is set to the current date.

  - The provided rejectionReason is saved

---

### `submitTask`

**Type**: `mutation`  
**Description**: Allows a user to submit their completed work for a task they have claimed. The task must be active and the user must have an active claim on it.

---

#### Example Input

```json
{
  "taskId": "3fa85f64-5717-4562-b3fc-2c963f66afa6", // Required: ID of the task
  "submissionType": "TEXT", // Required: Type of submission (e.g., TEXT, FILE, URL)
  "textContent": "Translated script attached below...", // Optional: Content for text-based submissions
  "submissionUrl": null, // Optional: URL pointing to the submitted work
  "fileMetadata": null, // Optional: File metadata if applicable
  "additionalNotes": "Let me know if you need a different format" // Optional: Any additional notes
}
```

#### Example Output

```json
{
  "success": true,
  "submissionId": "3d7c1b3b-891e-467a-bc7a-865c715dc3e1",
  "message": "Task submitted successfully and is pending review"
}
```

#### Notes

- The user must have the IN_PROGRESS claim on the task to submit

- Only tasks with status: "ACTIVE" can accept submissions

- Duplicate submissions are not allowed — if a submission already exists for the user-task pair, a BAD_REQUEST error is returned

- The submission is stored in the submissions table with:
  - status: PENDING_REVIEW

  - dataRef: JSON string containing submission details (type, content, URL, file metadata, notes, and timestamp)

  - submittedAt: current timestamp

- After submission:
  - The corresponding task claim is updated to COMPLETED

  - All operations are performed transactionally to ensure consistency

#### Possible Errors

- NOT_FOUND: Task does not exist.

- BAD_REQUEST: Task is not active or the user already submitted.

- FORBIDDEN: User has no active claim for the task.

---

### `getDisputes`

**Type**: `mutation`  
**Description**: Allows an `ADMIN` user to retrieve a paginated list of disputes, optionally filtered by status. The disputes include detailed information about the submission, task, task creator, and completer.

---

#### Example Input

```json
{
  "status": "OPEN", // Optional: Filter by status ('OPEN', 'RESOLVED_APPROVE', 'RESOLVED_REJECT')
  "limit": 10, // Optional: Number of disputes to return (default: 10, max: 100)
  "offset": 0 // Optional: Number of items to skip (default: 0)
}
```

#### Example Output

```json
{
  "success": true,
  "disputes": [
    {
      "id": "d1c7b7a0-45e4-49d6-a469-1f2c8f10c0b3",
      "status": "OPEN",
      "createdAt": "2025-08-07T16:00:00Z",
      "submission": {
        "submissionId": "3d7c1b3b-891e-467a-bc7a-865c715dc3e1",
        "task": {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "title": "Translate a YouTube video",
          "creator": {
            "id": "user_123",
            "username": "creatorUser",
            "email": "creator@example.com"
          }
        },
        "completer": {
          "id": "user_456",
          "username": "completerUser",
          "email": "completer@example.com"
        }
      }
    }
  ],
  "total": 1
}
```

#### Notes

- Authorization: Only users with the ADMIN role can access this endpoint. Others will receive a FORBIDDEN error

- Filtering:
  - You can filter disputes by their status:
    - "OPEN"

    - "RESOLVED_APPROVE"

    - "RESOLVED_REJECT"

  - If no status is provided, all disputes are returned

Pagination:

    - Uses limit and offset to paginate results

    - limit: minimum 1, maximum 100, default 10

    - offset: default 0

- Ordering: Results are ordered by createdAt in descending order (newest first)

Response Structure:

    - disputes: An array of dispute records, each including:

        - Associated submission

        - Related task details

        - Creator and completer information

    - total: Total number of disputes matching the filter (useful for pagination)

#### Possible Errors

FORBIDDEN: User is not an admin.

---

### `initiateDispute`

**Type**: `mutation`  
**Description**: Allows a user (submission completer) to initiate a dispute for a rejected submission. The dispute includes a claim statement and a transaction hash for auditability.

---

#### Example Input

```json
{
  "submissionId": "3d7c1b3b-891e-467a-bc7a-865c715dc3e1", // Required: UUID of the rejected submission
  "claim": "I followed all instructions exactly and even delivered ahead of time. I believe the rejection was unjustified.", // Required: Completer's claim (min. 10 characters)
  "txHash": "0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1" // Required: Blockchain transaction hash for dispute flag
}
```

#### Example Output

```json
{
  "success": true,
  "disputeId": "b572d6d5-ccbe-40f3-b6e4-582b3bd3e45a"
}
```

#### Notes

- Authorization:
  - The user must be authenticated and must own the submission being disputed.

- Validation:
  - The submission must exist

  - The submission must have status: "REJECTED" — only rejected submissions can be disputed

  - A user cannot dispute someone else's submission

- On Success:
  - A new record is created in the disputes table with:
    - submissionId

    - completerClaim

    - status: "OPEN"

    - flagTxHash

  The corresponding submission’s status is updated to "DISPUTED"

---

### `approveSubmission`

**Type**: `mutation`  
**Description**: Allows a task creator to **approve** a `PENDING_REVIEW` submission. This records the approval on-chain and updates the submission’s status to `APPROVED`.

---

#### Example Input

```json
{
  "submissionId": "3d7c1b3b-891e-467a-bc7a-865c715dc3e1", // Required: ID of the submission being approved
  "txHash": "0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1" // Required: On-chain approval transaction hash
}
```

#### Example Output

```json
{
  "success": true
}
```

#### Notes

- Authorization:
  - Only the creator of the task can approve a submission

- Validation:
  - Submission must exist

  - Submission must be in PENDING_REVIEW status

  - The completer must have an active wallet on record

- On Success:
  - The submission's status is updated to APPROVED

  - approvalTxHash is recorded for transparency/auditing

  - reviewedAt timestamp is set to the current time

#### Possible Errors

- NOT_FOUND: Submission does not exist or completer has no active wallet
- UNAUTHORIZED: The authenticated user is not the task creator
- BAD_REQUEST: The submission is not in a reviewable state (PENDING_REVIEW)

### `getRecommendedTasks`

**Type**: `query`  
**Called As**: `taskRouter.getRecommendedTasks()`  
**Description**: Retrieves a list of recommended tasks for the user. It filters out tasks that the user has already claimed or submitted and recommends tasks from categories related to the user's previous submissions. Pagination is supported.

#### Example Input

```json
{
  "limit": 8,
  "offset": 0
}
```

#### Example Output

```json
{
  "pageSize": 8,
  "offset": 0,
  "totalPages": 5,
  "totalRecords": 40,
  "data": [
    {
      "id": "task-uuid-1",
      "title": "Task 1",
      "category": "Category 1",
      "rewardAmount": 100,
      "status": "ACTIVE",
      "deadline": "2025-10-15T12:00:00.000Z",
      "createdAt": "2025-10-01T12:00:00.000Z"
    }
  ]
}
```

### Notes

- **Pagination**:
  - **`limit`**: Defines the number of tasks returned per page. The default value is `8`, and the maximum is `20`.
  - **`offset`**: Defines the starting point for pagination. The default value is `0`.

- **Exclusion Criteria**:
  - The procedure excludes tasks that the user has already claimed or submitted. It fetches these tasks from the `taskClaims` and `submissions` tables.

- **Category Matching**:
  - The recommended tasks are prioritized based on categories that the user has previously submitted tasks from.

- **Sorting**:
  - The tasks are sorted in descending order by:
    1. Whether the task's category matches the categories of the user's previously submitted tasks.
    2. The count of claims for the task.
    3. The reward amount of the task.
    4. The creation date of the task.

- **Data Aggregation**:
  - **Total Records**: The total number of tasks matching the conditions is returned as `totalRecords`.
  - **Total Pages**: The number of total pages is calculated based on the `totalRecords` and `limit`.

- **Error Handling**:
  - If no matching tasks are found, an empty list is returned, but no error is thrown.

- **Conditions**:
  - Only tasks that are active and have a deadline greater than or equal to the current date are included in the results.

### `getTasksByStatus`

**Type**: `query`  
**Called As**: `taskRouter.getTasksByStatus()`  
**Description**: Retrieves tasks for a creator based on the specified status (`DRAFT`, `ACTIVE`, `COMPLETED`), with pagination support. Only users with the `CREATOR` role are allowed to access this information.

#### Example Input

```json
{
  "status": "ACTIVE",
  "limit": 10,
  "offset": 0
}
```

#### Example Output

```json
{
  "pageSize": 10,
  "totalPages": 5,
  "totalRecords": 50,
  "data": [
    {
      "id": "task-uuid-1",
      "title": "Active Task 1",
      "description": "Description of active task 1",
      "status": "ACTIVE",
      "rewardAmount": 100,
      "deadline": "2025-10-01T12:00:00.000Z",
      "image": "image-url-1",
      "createdAt": "2025-09-01T12:00:00.000Z",
      "claimedBy": "user-uuid-1",
      "claimStatus": "PENDING",
      "claimedAt": "2025-09-02T12:00:00.000Z"
    }
  ]
}
```

### Notes

- **Status Values**:
  - **DRAFT**: Task is still in draft status.
  - **ACTIVE**: Task is active and available for claiming or submission.
  - **COMPLETED**: Task has been completed.

- **Error Handling**:
  - If the user is not a creator, a `FORBIDDEN` error is thrown with the message "Only creators can view their tasks".

- **Pagination**:
  - **`limit`**: Defines the number of tasks returned per page. The default value is `10`, and the maximum is `50`.
  - **`offset`**: Defines the starting point for pagination. The default value is `0`.

- **Exclusion**:
  - The procedure only returns tasks created by the current user (`creatorUserId`).

- **Data Aggregation**:
  - **Total Records**: The total number of tasks that match the given status is returned as `totalRecords`.
  - **Total Pages**: The number of pages is calculated by dividing the `totalRecords` by the `limit`.

- **Task Query**:
  - For tasks with status `ACTIVE` or `COMPLETED`, the results also include the claim status and the user who claimed the task.
  - If the status is `DRAFT`, only basic task information (without claims) is returned.

- **Sorting**:
  - Tasks are sorted by `createdAt` in descending order.

### `cancelTask`

**Type**: `mutation`  
**Called As**: `taskRouter.cancelTask()`  
**Description**: Allows a task creator to cancel an active task. Only tasks with the status `ACTIVE` can be cancelled. If the task is cancelled, all related claims are also cancelled.

#### Example Input

```json
{
  "taskId": "task-uuid-1"
}
```

### Example Output

```json
{
  "success": true
}
```

### Notes

- **Authorization**:
  - Only the task creator can cancel a task. If the user is not the creator of the task, a `FORBIDDEN` error is thrown.

- **Status Check**:
  - A task can only be cancelled if its status is `ACTIVE`. If the status is anything other than `ACTIVE`, a `BAD_REQUEST` error is thrown.

- **Cancellation Process**:
  - Once the task is cancelled, all related claims for the task are also cancelled, setting their status to `CANCELLED`.

- **Error Handling**:
  - If the task does not exist, a `NOT_FOUND` error is thrown.
  - If an error occurs during the cancellation process, an `INTERNAL_SERVER_ERROR` is thrown with a message indicating the failure.

- **Data Aggregation**:
  - The `taskId` is used to find the task and cancel it along with any related claims.

- **Logging**:
  - Errors are logged to the console for debugging purposes.

### `getTaskCategories`

**Type**: `query`  
**Called As**: `taskRouter.getTaskCategories()`  
**Description**: Retrieves a list of unique task categories from the database, ensuring that no empty or whitespace-only categories are included. The categories are returned sorted in alphabetical order.

#### Example Input

```json
{}
```

#### Example Otput

```json
{
  "success": true,
  "categories": ["Development", "Design", "Marketing"]
}
```

### Notes

- **Categories**:
  - Only distinct task categories are returned.
  - Empty or whitespace-only categories are excluded.
  - The list of categories is sorted alphabetically.

- **Error Handling**:
  - If an error occurs during the query, it will throw an `INTERNAL_SERVER_ERROR`.

- **Data Aggregation**:
  - The `category` field from the `tasks` table is used to gather the distinct categories.
  - The results are trimmed and filtered to ensure no empty or invalid categories are included.

- **Performance**:
  - The query uses `selectDistinct` to ensure that only unique categories are returned.

### `getUserClaimedTasks`

**Type**: `query`  
**Called As**: `taskRouter.getUserClaimedTasks()`  
**Description**: Retrieves a paginated list of tasks that a user has claimed, along with relevant task details such as the status and reward amount.

#### Example Input

```json
{
  "limit": 10,
  "offset": 0
}
```

#### Example Output

```json
{
  "pageSize": 10,
  "totalPages": 5,
  "totalRecords": 50,
  "data": [
    {
      "claimId": "claim-uuid-1",
      "claimStatus": "PENDING",
      "claimCreatedAt": "2025-10-01T12:00:00.000Z",
      "claimUpdatedAt": "2025-10-02T12:00:00.000Z",
      "taskId": "task-uuid-1",
      "title": "Task 1",
      "description": "Task description",
      "status": "ACTIVE",
      "rewardAmount": 100,
      "deadline": "2025-10-10T12:00:00.000Z",
      "image": "image-url-1",
      "createdAt": "2025-09-01T12:00:00.000Z"
    }
  ]
}
```

### Notes

- **Pagination**:
  - **`limit`**: Defines the number of claimed tasks returned per page. The default value is `10`, and the maximum is `50`.
  - **`offset`**: Defines the starting point for pagination. The default value is `0`.

- **Data Aggregation**:
  - **Total Records**: The total number of tasks the user has claimed is returned as `totalRecords`.
  - **Total Pages**: The number of total pages is calculated based on `totalRecords` and `limit`.

- **Sorting**:
  - The tasks are sorted by the `createdAt` field of `taskClaims` in descending order.

- **Task Details**:
  - For each claimed task, details such as `taskId`, `title`, `status`, `rewardAmount`, and `deadline` are included.
  - The claim information (e.g., `claimId`, `claimStatus`) is also returned.

- **Error Handling**:
  - If no tasks are found for the user, the `data` field will be an empty array.

### `editTask`

**Type**: `mutation`  
**Called As**: `taskRouter.editTask()`  
**Description**: Allows the creator of a task to edit the task details (e.g., title, description, category, reward amount, etc.) for tasks that are in `DRAFT` status. Only the owner of the task can perform this action.

#### Example Input

```json
{
  "taskId": "task-uuid-1",
  "title": "Updated Task Title",
  "description": "This is an updated description for the task.",
  "category": "Updated Category",
  "rewardAmount": "200",
  "requiredCompletions": 5,
  "deadline": "2025-12-01T12:00:00.000Z"
}
```

#### Example Output

```json
{
  "success": true,
  "task": {
    "id": "task-uuid-1",
    "title": "Updated Task Title",
    "description": "This is an updated description for the task.",
    "category": "Updated Category",
    "rewardAmount": "200",
    "requiredCompletions": 5,
    "deadline": "2025-12-01T12:00:00.000Z",
    "updatedAt": "2025-10-10T12:00:00.000Z",
    "createdAt": "2025-09-01T12:00:00.000Z"
  }
}
```

#### Notes

- **Authorization**:
  - Only the task creator can edit the task. If the user is not the creator, a `FORBIDDEN` error is thrown with the message "You are not the owner of this task".

- **Status Check**:
  - The task must be in `DRAFT` status to be editable. If the task status is anything other than `DRAFT`, a `BAD_REQUEST` error is thrown with the message "Only draft tasks can be edited".

- **Editing Fields**:
  - Users can edit the following fields:
    - **`title`**: The task's title (3 to 255 characters).
    - **`description`**: A brief description of the task (minimum 10 characters).
    - **`category`**: The category of the task (2 to 100 characters).
    - **`rewardAmount`**: The reward for completing the task.
    - **`requiredCompletions`**: The number of required completions.
    - **`deadline`**: The deadline for the task (datetime format).

- **Error Handling**:
  - If the task does not exist, a `NOT_FOUND` error is thrown.
  - If the user is not the creator of the task, a `FORBIDDEN` error is thrown.
  - If the task is not in `DRAFT` status, a `BAD_REQUEST` error is thrown.

- **Data Aggregation**:
  - The task's details are updated and the `updatedAt` field is set to the current time.

- **Logging**:
  - If there is an error in any part of the process (fetching or updating), it will be logged for debugging.

#### Error Handling

- **Task Not Found**: If the task does not exist, a `NOT_FOUND` error is returned.
- **Forbidden Access**: If the user is not the creator of the task, a `FORBIDDEN` error is returned.

- **Bad Request**: If the task is not in `DRAFT` status, a `BAD_REQUEST` error is returned.

### `updateTaskStatus`

**Type**: `mutation`  
**Called As**: `taskRouter.updateTaskStatus()`  
**Description**: Allows a task creator to update the status of their task. The status can be transitioned from `DRAFT` to `ACTIVE` and from `ACTIVE` to `COMPLETED`.

#### Example Input

```json
{
  "taskId": "task-uuid-1",
  "newStatus": "ACTIVE"
}
```

#### Example Output

```json
{
  "success": true,
  "message": "Task status updated to ACTIVE"
}
```

#### Notes

- **Authorization**:
  - Only the creator of the task can update its status. If the user is not the creator, a `FORBIDDEN` error is thrown with the message "You are not allowed to update the status of this task".

- **Status Transition**:
  - **Allowed Transitions**:
    - From `DRAFT` to `ACTIVE`
    - From `ACTIVE` to `COMPLETED`
  - If an invalid status transition is attempted, a `BAD_REQUEST` error is thrown with the message "Invalid status transition from [current status] to [new status]".
  - If the task is already in the specified status, a `BAD_REQUEST` error is thrown with the message "Task is already [new status]"

- **Error Handling**:
  - If the task does not exist, a `NOT_FOUND` error is thrown with the message "Task not found"
  - If the user is not the creator, a `FORBIDDEN` error is thrown
  - If an invalid status transition is attempted, a `BAD_REQUEST` error is thrown

- **Data Aggregation**:
  - The task's status is updated to the new status

- **Logging**:
  - If an error occurs during the process, it will be logged for debugging purposes

#### Error Handling

- **Task Not Found**: If the task does not exist, a `NOT_FOUND` error is returned.
- **Forbidden Access**: If the user is not the creator of the task, a `FORBIDDEN` error is returned.
- **Bad Request**: If the status is already the same or the transition is invalid, a `BAD_REQUEST` error is returned.
