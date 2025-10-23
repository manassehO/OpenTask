# Notification Router (`notificationRouter`)

This router handles all operations related to user notifications and preferences within the OpenTask app, including fetching, marking as read, updating, and creating notifications, as well as managing user notification preferences.

---

# Table of Contents

1. [Notification Router (`notificationRouter`)](#notification-router-notificationrouter)
2. [Overview](#overview)
3. [Procedures](#procedures)
   - [getNotifications](#getnotifications)
     - [Type](#type)
     - [Called As](#called-as)
     - [Description](#description)
     - [Example Input](#example-input)
     - [Example Output](#example-output)
     - [Notes](#notes)
   - [markAsRead](#markasread)
     - [Type](#type-1)
     - [Called As](#called-as-1)
     - [Description](#description-1)
     - [Example Input](#example-input-1)
     - [Example Output](#example-output-1)
     - [Notes](#notes-1)
   - [getNotificationPreferences](#getnotificationpreferences)
     - [Type](#type-2)
     - [Called As](#called-as-2)
     - [Description](#description-2)
     - [Example Input](#example-input-2)
     - [Example Output](#example-output-2)
     - [Notes](#notes-2)
   - [createNotification](#createnotification)
     - [Type](#type-3)
     - [Called As](#called-as-3)
     - [Description](#description-3)
     - [Example Input](#example-input-3)
     - [Example Output](#example-output-3)
     - [Notes](#notes-3)
   - [updateNotificationPreferences](#updatenotificationpreferences)
     - [Type](#type-4)
     - [Called As](#called-as-4)
     - [Description](#description-4)
     - [Example Input](#example-input-4)
     - [Example Output](#example-output-4)
     - [Notes](#notes-4)
   - [getUnreadCount](#getunreadcount)
     - [Type](#type-5)
     - [Called As](#called-as-5)
     - [Description](#description-5)
     - [Example Input](#example-input-5)
     - [Example Output](#example-output-5)
     - [Notes](#notes-5)

---

## Overview

The `notificationRouter` handles all operations related to user notifications and preferences within the OpenTask app. It includes functionality for fetching, marking as read, updating, and creating notifications, as well as managing user notification preferences.

---

## Procedures

### `getNotifications`

**Type**: `query`  
**Called As**: `notification.getNotifications()`  
**Description**: Retrieves a paginated list of notifications for the currently authenticated user. Notifications can be filtered by status (UNREAD, READ, ARCHIVED).

#### Example Input

```json
{
  "status": "UNREAD", // Optional: Filter notifications by status
  "limit": 20, // Optional: Limit the number of notifications returned (default is 20)
  "offset": 0 // Optional: Offset for pagination
}
```

#### Example Output

```json
{
  "success": true,
  "notifications": [
    {
      "notificationId": "evt-uuid-1",
      "title": "Test Notification",
      "message": "This is a test notification.",
      "status": "UNREAD",
      "createdAt": "2025-08-07T12:00:00.000Z",
      "updatedAt": "2025-08-07T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 20,
    "offset": 0
  }
}
```

### Notes

- **Supports optional filters by status.**
- **Pagination is controlled via** `limit` **and** `offset`.
- **Only notifications for active users** (`ctx.user.status === 'ACTIVE'`) **are returned.**

### `markAsRead`

**Type**: `mutation`  
**Called As**: `notification.markAsRead()`  
**Description**: Marks the specified notifications as "READ" for the authenticated user. This is a bulk operation, allowing multiple notifications to be marked at once

#### Example Input

```json
{
  "notificationIds": ["evt-uuid-1", "evt-uuid-2"]
}
```

#### Example Output

```json
{
  "success": true,
  "updatedCount": 2,
  "skippedCount": 0,
  "updatedIds": ["evt-uuid-1", "evt-uuid-2"],
  "message": "2 notifications marked as read"
}
```

### Notes

- **Only** `unread notifications` **can be marked as read**
- **If no notifications are found, or they are already marked as read, the mutation gracefully handles it**

### `getNotificationPreferences`

**Type**: `query`  
**Called As**: `notification.getNotificationPreferences()`  
**Description**: Retrieves the current notification preferences of the authenticated user. If no preferences exist, default preferences are created

#### Example Input

None (the procedure does not require input).

#### Example Output

```json
{
  "success": true,
  "preferences": {
    "emailNotifications": true,
    "pushNotifications": true,
    "taskUpdates": true,
    "paymentNotifications": true,
    "disputeNotifications": true,
    "learningNotifications": true,
    "marketingEmails": false
  },
  "message": "Preferences fetched successfully"
}
```

### Notes

- **If no preferences are found for the user, a default set is created automatically**

### `createNotification`

**Type**: `mutation`  
**Called As**: `notification.createNotification()`  
**Description**: Creates a new notification for a specified user. This is an admin-only procedure and requires an admin role for execution

#### Example Input

```json
{
  "userId": "EsgafpiPG4In239RvITHEdarIcIYaxnC",
  "type": "TASK_APPROVED",
  "title": "Task Approved",
  "message": "Your task has been approved.",
  "relatedTaskId": "task-uuid-12345",
  "metadata": "Additional information here"
}
```

#### Example Output

```json
{
  "success": true,
  "notification": {
    "notificationId": "evt-uuid-3",
    "userId": "EsgafpiPG4In239RvITHEdarIcIYaxnC",
    "type": "TASK_APPROVED",
    "title": "Task Approved",
    "message": "Your task has been approved.",
    "status": "UNREAD",
    "createdAt": "2025-08-07T12:00:00.000Z",
    "updatedAt": "2025-08-07T12:00:00.000Z"
  },
  "message": "Notification successfully created."
}
```

### Notes

- **This operation is only available to users with** `admin` **privileges**
- **Notifications are automatically marked as** `UNREAD` **when created**

### `updateNotificationPreferences`

**Type**: `mutation`  
**Called As**: `notification.updateNotificationPreferences()`  
**Description**: Updates the notification preferences for the authenticated user. Any fields not specified will remain unchanged

#### Example Input

```json
{
  "emailNotifications": false,
  "pushNotifications": true,
  "taskUpdates": false
}
```

#### Example Output

```json
{
  "success": true,
  "message": "Notification preferences updated successfully",
  "preferences": {
    "emailNotifications": false,
    "pushNotifications": true,
    "taskUpdates": false,
    "paymentNotifications": true,
    "disputeNotifications": true,
    "learningNotifications": true,
    "marketingEmails": false
  }
}
```

### Notes

- **If no preferences exist, new preferences are created using the provided values**
- **Ensures that only the provided fields are updated**.

### `getUnreadCount`

**Type**: `query`  
**Called As**: `notification.getUnreadCount()`  
**Description**: Retrieves the count of unread notifications for the authenticated user

#### Example Input

None (no input required).

#### Example Output

```json
{
  "success": true,
  "count": 5
}
```

### Notes

- **Only unread notifications (status === 'UNREAD') are counted**

### `markAllAsRead`

**Type**: `mutation`  
**Called As**: `notification.markAllAsRead()`  
**Description**: Marks all unread notifications as "READ" for the authenticated user. This is a bulk operation that updates all unread notifications for the user.

#### Example Input

None (no input required).

#### Example Output

```json
{
  "success": true,
  "updatedCount": 5,
  "message": "5 notifications marked as read"
}
```

### Notes

-- **Ensures that the user is active (ctx.user.status === 'ACTIVE')**
-- **Updates all unread notifications (status === 'UNREAD') to "READ"**
-- **If no unread notifications are found, it handles the case gracefully**

### `deleteNotification`

**Type**: `mutation`  
**Called As**: `notification.deleteNotification()`  
**Description**: Deletes a specific notification for the authenticated user by its `notificationId`. The notification is only deleted if it belongs to the user and exists.

#### Example Input

```json
{
  "notificationId": "evt-uuid-1"
}
```

#### Example Output

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

### Notes

-- **Ensures that the user is active (ctx.user.status === 'ACTIVE')**
-- **The notification is deleted if it belongs to the authenticated user and has the given notificationId**
-- **If the notification is not found or has already been deleted, it throws a NOT_FOUND error**

### `clearAllNotifications`

**Type**: `mutation`  
**Called As**: `notification.clearAllNotifications()`  
**Description**: Deletes all notifications for the authenticated user. This operation removes all notifications from the database that belong to the user.

#### Example Input

None (this procedure does not require any input).

#### Example Output

```json
{
  "success": true,
  "message": "Deleted 10 notifications successfully"
}
```

### Notes

-- **Ensures that the user is active (ctx.user.status === 'ACTIVE')**
-- **Deletes all notifications belonging to the authenticated user from the database**
-- **Returns the total number of deleted notifications**
