# Profile Router (`profileRouter`)

This router handles operations related to the authenticated user’s profile. It provides procedures for retrieving and updating user profiles both for the user themselves and for administrators.

---

## Procedures

### 1. `getProfile`

- **Type:** `query`
- **Called As:** `profile.getProfile`
- **Description:**  
  Fetches the profile of the currently authenticated user.

#### Example Input

_No input required._

#### Example Output

```json
{
  "success": true,
  "user": {
    "id": "user_abc123",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "emailVerified": true,
    "displayName": "Jane",
    "status": "ACTIVE",
    "image": "https://example.com/profile.jpg",
    "createdAt": "2025-08-07T12:34:56.000Z",
    "updatedAt": "2025-08-07T12:34:56.000Z",
    "role": "COMPLETER"
  }
}
```

### 2. `updateProfile`

- **Type:** `mutation`
- **Called As:** `profile.updateProfile`
- **Description:** Updates the authenticated user's own profile.

#### Example Input

```json
{
  "name": "New Name",
  "displayName": "newusername",
  "image": "https://example.com/new-image.png"
}
```

#### Example Output

```json
{
  "success": true,
  "user": {
    "id": "abc123",
    "name": "New Name",
    "email": "user@example.com",
    "emailVerified": null,
    "displayName": "newusername",
    "status": "active",
    "image": "https://example.com/new-image.png",
    "role": "user",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-08-07T00:00:00.000Z"
  }
}
```

#### Notes

- Throws FORBIDDEN if restricted fields are present in the input

- Throws NOT_FOUND if the user doesn't exist

- Throws INTERNAL_SERVER_ERROR if the update fails

- Uses ctx.user.id from session context

### 3. `updateProfileAdmin`

- **Type:** `mutation`
- **Called As:** `profile.updateProfileAdmin`
- **Description:** Allows an admin to update another user's profile

#### Example Input

```json
{
  "userId": "abc123",
  "name": "Admin Updated Name",
  "status": "inactive",
  "role": "moderator"
}
```

#### Example Output

```json
{
  "success": true,
  "user": {
    "id": "abc123",
    "name": "Admin Updated Name",
    "email": "user@example.com",
    "emailVerified": null,
    "displayName": "userdisplay",
    "status": "inactive",
    "image": "https://example.com/original.png",
    "role": "moderator",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-08-07T12:00:00.000Z"
  }
}
```

#### Notes

- Authorization: Only users with ADMIN role can call this procedure.

- Validation:
  - userId is required

  - At least one of the following must be included: name, displayName, status, image, role

  - If none are included, validation fails with: "At least one field must be provided in addition to userId"

  - status must be one of: ACTIVE, SUSPENDED, BANNED

  - role must be one of: CREATOR, COMPLETER, ADMIN

- Behavior:
  - Returns NOT_FOUND if the user doesn't exist

  - Returns INTERNAL_SERVER_ERROR if no rows are updated

  - Fields not included in the input are left unchanged
