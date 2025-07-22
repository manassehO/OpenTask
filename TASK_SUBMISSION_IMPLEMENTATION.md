# Task Submission System Implementation

This document describes the implementation of the task submission procedure with file handling for the OpenTask platform.

## Overview

The task submission system allows users with the `COMPLETER` role to submit their completed work for tasks they have claimed. The system supports multiple submission types including text, files, URLs, and mixed submissions.

## Features Implemented

### 1. **Role-Based Access Control**

- Created `completerProcedure` in tRPC middleware
- Restricts task submission to users with `COMPLETER` role
- Validates user authentication and permissions

### 2. **File Handling System**

- **Storage Service** (`src/services/storageService.ts`)
  - MinIO/S3 compatible storage
  - File validation (size, type restrictions)
  - Unique file naming to prevent collisions
  - Presigned URL generation for secure access

- **File Upload API Route** (`src/app/api/upload/route.ts`)
  - Handles multipart form data
  - Validates file types and sizes (max 10MB)
  - Processes uploads through Next.js API

### 3. **Submission Validation**

- **Zod Schema** (`src/server/api/schemas/submission.ts`)
  - Validates submission data structure
  - Ensures at least one submission method is provided
  - Type-safe input validation

### 4. **Database Integration**

- Creates records in the `submissions` table
- Links task, completer, and submission data
- Sets initial status to `PENDING_REVIEW`
- Updates task claim status to `COMPLETED`

## API Endpoints

### 1. Task Submission tRPC Procedure

```typescript
api.task.submitTask.mutate({
  taskId: "uuid",
  submissionType: "text" | "file" | "url" | "mixed",
  textContent?: "string",
  submissionUrl?: "string",
  fileMetadata?: {
    fileName: "string",
    fileSize: number,
    contentType: "string",
    storageKey: "string"
  },
  additionalNotes?: "string"
})
```

### 2. File Upload API Route

```
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: File
- taskId: string
```

## Usage Examples

### Text Submission

```typescript
await api.task.submitTask.mutate({
  taskId: 'task-uuid-here',
  submissionType: 'text',
  textContent: 'Here is my completed work description...',
  additionalNotes: 'Additional context or notes',
});
```

### File Submission

```typescript
// 1. First upload the file
const formData = new FormData();
formData.append('file', selectedFile);
formData.append('taskId', taskId);

const uploadResponse = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const { fileMetadata } = await uploadResponse.json();

// 2. Then submit the task
await api.task.submitTask.mutate({
  taskId: 'task-uuid-here',
  submissionType: 'file',
  fileMetadata: fileMetadata,
});
```

### Mixed Submission

```typescript
await api.task.submitTask.mutate({
  taskId: 'task-uuid-here',
  submissionType: 'mixed',
  textContent: 'Description of the work',
  submissionUrl: 'https://github.com/user/repo',
  fileMetadata: uploadedFileMetadata,
  additionalNotes: 'Additional information',
});
```

## Environment Configuration

Add the following variables to your `.env` file:

```bash
# Storage Service Configuration (MinIO/S3)
S3_ENDPOINT=localhost
S3_PORT=9000
S3_USE_SSL=false
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET_NAME=opentask-submissions
```

## File Type Restrictions

The system accepts the following file types:

- PDF documents (`.pdf`)
- Word documents (`.doc`, `.docx`)
- Plain text files (`.txt`)
- Images (`.jpg`, `.jpeg`, `.png`, `.gif`)
- ZIP archives (`.zip`)

Maximum file size: **10MB**

## Validation Rules

### Task Submission Requirements

1. User must have `COMPLETER` role
2. Task must exist and be in `ACTIVE` status
3. User must have an active claim (`IN_PROGRESS`) for the task
4. User cannot submit multiple times for the same task
5. At least one submission method must be provided (text, file, or URL)

### File Upload Requirements

1. File size must be ≤ 10MB
2. File type must be in allowed list
3. Valid task ID must be provided
4. User must be authenticated with `COMPLETER` role

## Database Schema

### Submissions Table

```sql
CREATE TABLE submissions (
  submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id),
  completer_user_id UUID REFERENCES user(id),
  status submission_status NOT NULL, -- PENDING_REVIEW, APPROVED, REJECTED, DISPUTED
  data_ref TEXT, -- JSON string containing submission data
  rejection_reason TEXT NOT NULL DEFAULT '',
  approval_tx_hash VARCHAR(255),
  reviewed_at TIMESTAMP,
  submitted_at TIMESTAMP NOT NULL
);
```

## Security Considerations

1. **Authentication & Authorization**
   - All endpoints require valid authentication
   - Role-based access control enforced
   - User claims validated before submission

2. **File Security**
   - File type validation prevents malicious uploads
   - File size limits prevent abuse
   - Unique file naming prevents overwrites
   - Presigned URLs with expiration for access

3. **Data Validation**
   - Comprehensive Zod schema validation
   - SQL injection prevention through Drizzle ORM
   - Input sanitization and type checking

## Error Handling

The system provides comprehensive error handling for:

- Invalid file types or sizes
- Missing authentication/authorization
- Invalid task states
- Duplicate submissions
- Storage service failures
- Database transaction failures

## React Component

A complete React component (`TaskSubmissionForm`) is provided to demonstrate integration:

```tsx
<TaskSubmissionForm
  taskId="task-uuid"
  onSuccess={(submissionId) => {
    console.log('Submitted:', submissionId);
  }}
  onCancel={() => {
    // Handle cancel
  }}
/>
```

## Testing

To test the implementation:

1. **Setup Storage Service**
   - Start MinIO server or configure S3
   - Update environment variables

2. **Create Test User**
   - Ensure user has `COMPLETER` role
   - User must have claimed an active task

3. **Test Submission Types**
   - Text-only submissions
   - File uploads
   - URL submissions
   - Mixed submissions

4. **Verify Database**
   - Check submissions table for new records
   - Verify task claim status updates
   - Confirm data integrity

## Future Enhancements

Potential improvements for the system:

- File virus scanning integration
- Image thumbnail generation
- Submission versioning
- Bulk file uploads
- Progress tracking for large uploads
- File compression for large submissions
- Integration with external storage providers (AWS S3, Google Cloud Storage)

## Troubleshooting

### Common Issues

1. **File Upload Fails**
   - Check file size (max 10MB)
   - Verify file type is allowed
   - Ensure MinIO/S3 is running
   - Check environment variables

2. **Submission Validation Errors**
   - Verify user has active claim
   - Check task is in ACTIVE status
   - Ensure required fields are provided

3. **Permission Denied**
   - Verify user has COMPLETER role
   - Check authentication token validity
   - Ensure user hasn't already submitted

For additional support, refer to the error messages returned by the API endpoints which provide specific details about validation failures or system errors.
