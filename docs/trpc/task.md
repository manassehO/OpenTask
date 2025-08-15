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
