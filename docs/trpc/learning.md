# Learning Router (`learningRouter`)

This router handles all operations related to learning content, such as courses and tutorials. It includes functionality for fetching courses and tutorials, enrolling in courses, updating learning progress, and retrieving user progress.

---

# Table of Contents

1. [Learning Router (`learningRouter`)](#learning-router-learningrouter)
2. [Overview](#overview)
3. [Procedures](#procedures)
   - [getCourses](#getcourses)
     - [Type](#type)
     - [Called As](#called-as)
     - [Description](#description)
     - [Example Input](#example-input)
     - [Example Output](#example-output)
     - [Notes](#notes)
   - [getTutorials](#gettutorials)
     - [Type](#type-1)
     - [Called As](#called-as-1)
     - [Description](#description-1)
     - [Example Input](#example-input-1)
     - [Example Output](#example-output-1)
     - [Notes](#notes-1)
   - [getUserLearningProgress](#getuserlearningprogress)
     - [Type](#type-2)
     - [Called As](#called-as-2)
     - [Description](#description-2)
     - [Example Input](#example-input-2)
     - [Example Output](#example-output-2)
     - [Notes](#notes-2)
   - [enrollInCourse](#enrollincourse)
     - [Type](#type-3)
     - [Called As](#called-as-3)
     - [Description](#description-3)
     - [Example Input](#example-input-3)
     - [Example Output](#example-output-3)
     - [Notes](#notes-3)
   - [updateProgress](#updateprogress)
     - [Type](#type-4)
     - [Called As](#called-as-4)
     - [Description](#description-4)
     - [Example Input](#example-input-4)
     - [Example Output](#example-output-4)
     - [Notes](#notes-4)

---

## Overview

The `learningRouter` provides several procedures related to courses and tutorials, including:

- Fetching courses and tutorials.
- Enrolling in courses.
- Updating and retrieving user learning progress.

---

## Procedures

### `getCourses`

**Type**: `query`  
**Called As**: `learning.getCourses()`  
**Description**: Retrieves a list of courses for the authenticated user, with optional filtering by category, and supports pagination.

#### Example Input

```json
{
  "category": "Technology",
  "limit": 10,
  "offset": 0
}
```

#### Example Output

```json
{
  "courses": [
    {
      "courseId": "course-uuid-1",
      "title": "Learn JavaScript",
      "description": "A comprehensive guide to JavaScript.",
      "imageUrl": "https://example.com/image.jpg",
      "modules": 12,
      "duration": "20 hours",
      "rewardAmount": "100",
      "rewardInEth": "0.1",
      "rewardInUsd": 0,
      "category": "Technology",
      "difficulty": "Intermediate",
      "isActive": true
    }
  ],
  "total": 100
}
```

#### Notes

- **Category Filter**: Filters courses by category, if specified.
- **Pagination**: Controlled via `limit` and `offset`.
- **Status**: Only active courses (`isActive = true`) are returned.

### `getTutorials`

**Type**: `query`  
**Called As**: `learning.getTutorials()`  
**Description**: Retrieves a list of tutorials for the authenticated user, with optional filtering by category, and supports pagination.

#### Example Input

```json
{
  "category": "Design",
  "limit": 10,
  "offset": 0
}
```

#### Example Output

```json
{
  "tutorials": [
    {
      "tutorialId": "tutorial-uuid-1",
      "title": "Design Basics",
      "description": "An introduction to design principles.",
      "imageUrl": "https://example.com/image.jpg",
      "duration": "15 hours",
      "rewardAmount": "50",
      "rewardInEth": "0.05",
      "rewardInUsd": 0,
      "category": "Design",
      "isActive": true
    }
  ],
  "total": 50
}
```

#### Notes

- **Category Filter**: Filters tutorials by category, if specified.
- **Pagination**: Controlled via `limit` and `offset`.
- **Status**: Only active tutorials (`isActive = true`) are returned.
- **Reward Conversion**: The `rewardInUsd` field is currently set to 0, but it is intended to be converted from the reward token (e.g., ETH) to USD in the future.
- **Error Handling**: If no tutorials match the criteria, a `NOT_FOUND` error is thrown.

### `getUserLearningProgress`

**Type**: `query`  
**Called As**: `learning.getUserLearningProgress()`  
**Description**: Retrieves the learning progress for the authenticated user, filtered by course or tutorial.

#### Example Input

```json
{
  "type": "course"
}
```

#### Example output

```json
{
  "progress": [
    {
      "progressId": "progress-uuid-1",
      "courseId": "course-uuid-1",
      "progress": 50,
      "isCompleted": false,
      "enrolledAt": "2025-08-01T12:00:00.000Z",
      "completedAt": null,
      "lastAccessedAt": "2025-08-10T12:00:00.000Z"
    }
  ]
}
```

#### Notes

- **Filter**: Filters by `course` or `tutorial`, based on the `type` input.
- **Progress Clamp**: The progress is clamped between 0 and 100 using the `clampProgress` function.
- **Completion Status**: `isCompleted` indicates if the course/tutorial is completed, with `completedAt` being set if true.
- **Error Handling**: If no progress records are found for the user, a `NOT_FOUND` error is thrown.

### `enrollInCourse`

**Type**: `mutation`  
**Called As**: `learning.enrollInCourse()`  
**Description**: Enrolls the authenticated user in a course, creating a new progress record for that course.

#### Example Input

```json
{
  "courseId": "course-uuid-1"
}
```

#### Example Output

```json
{
  "success": true,
  "progressId": "progress-uuid-1",
  "enrolledAt": "2025-08-01T12:00:00.000Z"
}
```

#### Notes

- **Course Check**: Ensures the course exists and is active before enrolling the user.
- **Duplicate Enrollment**: Throws a `BAD_REQUEST` error if the user is already enrolled in the course.
- **Progress Creation**: Creates a new learning progress record with `progress` set to 0 and `isCompleted` set to `false`.
- **Error Handling**: If there’s an issue creating the progress record or enrolling the user, an `INTERNAL_SERVER_ERROR` is thrown.
- **Enrolled At**: The `enrolledAt` tim

### `updateProgress`

**Type**: `mutation`  
**Called As**: `learning.updateProgress()`  
**Description**: Updates the progress for a course or tutorial for the authenticated user. This procedure allows the user to update their learning progress, completion status, and the timestamp for when the content was last accessed or completed.

#### Example Input

```json
{
  "courseId": "course-uuid-1",
  "progress": 75,
  "isCompleted": true
}
```

#### Example Output

```json
{
  "success": true,
  "progress": 75,
  "isCompleted": true,
  "completedAt": "2025-08-10T12:00:00.000Z",
  "lastAccessedAt": "2025-08-10T12:00:00.000Z"
}
```

#### Notes

- **Progress Range**: The progress value is clamped between 0 and 100 using the `clampProgress` function.
- **Completion**: If `isCompleted` is set to `true`, the `completedAt` field is updated with the current timestamp; otherwise, it is set to `null`.
- **Update Conditions**: Either `courseId` or `tutorialId` must be provided to update progress. If neither is provided, a `BAD_REQUEST` error is thrown.
- **Error Handling**: If no progress record is found for the specified content, a `NOT_FOUND` error is thrown. If the update fails, an `INTERNAL_SERVER_ERROR` is thrown.
- **Last Accessed**: The `lastAccessedAt` timestamp is updated every time the progress is modified.
