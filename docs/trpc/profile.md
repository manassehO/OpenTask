# Profile Router (`profileRouter`)

This router handles operations related to the authenticated user’s profile. It provides procedures for retrieving and updating user profiles both for the user themselves and for administrators.

---

## Table of Contents

1. [Profile Router (`profileRouter`)](#profile-router-profilerouter)
2. [Procedures](#procedures)
   - [getProfile](#getprofile)
     - [Type](#type-query)
     - [Called As](#called-as-profilegetprofile)
     - [Description](#description-fetches-the-profile-of-the-currently-authenticated-user)
     - [Example Input](#example-input)
     - [Example Output](#example-output)
   - [updateProfile](#updateprofile)
     - [Type](#type-mutation)
     - [Called As](#called-as-profileupdateprofile)
     - [Description](#description-updates-the-authenticated-users-own-profile)
     - [Example Input](#example-input-1)
     - [Example Output](#example-output-1)
     - [Notes](#notes)
   - [updateProfileAdmin](#updateprofileadmin)
     - [Type](#type-mutation-1)
     - [Called As](#called-as-profileupdateprofileadmin)
     - [Description](#description-allows-an-admin-to-update-another-users-profile)
     - [Example Input](#example-input-2)
     - [Example Output](#example-output-2)
     - [Notes](#notes-1)
   - [getUserStats](#getuserstats)
     - [Type](#type-query-1)
     - [Called As](#called-as-userroutergetuserstats)
     - [Description](#description-retrieves-the-users-statistics-including-the-total-number-of-tasks-created-tasks-completed-and-disputes-raised-by-the-user)
     - [Example Input](#example-input-3)
     - [Example Output](#example-output-3)
     - [Notes](#notes-2)
   - [getExtendedProfile](#getextendedprofile)
     - [Type](#type-query-2)
     - [Called As](#called-as-userroutergetextendedprofile)
     - [Description](#description-retrieves-the-extended-profile-for-a-user-including-their-basic-information-and-associated-profile-details)
     - [Example Input](#example-input-4)
     - [Example Output](#example-output-4)
     - [Notes](#notes-3)
   - [updateExtendedProfile](#updateextendedprofile)
     - [Type](#type-mutation-2)
     - [Called As](#called-as-userrouterupdateextendedprofile)
     - [Description](#description-allows-a-user-to-update-their-profile-information-including-personal-details-from-the-user-table-and-additional-profile-information-from-the-userprofiles-table)
     - [Example Input](#example-input-5)
     - [Example Output](#example-output-5)
     - [Notes](#notes-4)

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

### `getUserStats`

**Type**: `query`  
**Called As**: `userRouter.getUserStats()`  
**Description**: Retrieves the user's statistics, including the total number of tasks created, tasks completed, and disputes raised by the user.

#### Example Input

```json
{}
```

#### Example Output

```json
{
  "success": true,
  "stats": {
    "createdTasks": 10,
    "completedTasks": 8,
    "disputesRaised": 2
  }
}
```

#### Notes

- **Data Aggregation**:
  - **Created Tasks**: The total number of tasks created by the user is retrieved from the `tasks` table.
  - **Completed Tasks**: The total number of tasks completed by the user is retrieved from the `submissions` table.
  - **Disputes Raised**: The total number of disputes raised by the user, which are linked to the user's submissions, is fetched from the `disputes` table.

- **Error Handling**:
  - If there is an issue retrieving the stats, an `INTERNAL_SERVER_ERROR` is thrown.

- **Data**:
  - The statistics returned include:
    - **createdTasks**: Number of tasks the user has created.
    - **completedTasks**: Number of tasks the user has completed.
    - **disputesRaised**: Number of disputes the user has raised.

- **Performance**:
  - The procedure uses `Promise.all` to perform the three queries concurrently, improving performance.

- **Logging**:
  - Any errors during the process are logged for debugging purposes.

#### Error Handling

- **Internal Server Error**: If there is an issue fetching the statistics, an `INTERNAL_SERVER_ERROR` is thrown.

### `getExtendedProfile`

**Type**: `query`  
**Called As**: `userRouter.getExtendedProfile()`  
**Description**: Retrieves the extended profile for a user, including their basic information and associated profile details such as skill tags and social links. If the profile data includes JSON strings for skill tags and social links, these are parsed into usable JavaScript objects.

#### Example Input

```json
{}
```

#### Example Output

```json
{
  "id": "user-uuid-1",
  "email": "user@example.com",
  "name": "John Doe",
  "profile": {
    "skillTags": ["JavaScript", "React", "Node.js"],
    "socialLinks": {
      "github": "https://github.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe"
    }
  }
}
```

#### Notes

- **Error Handling**:
  - If the user does not exist, a `NOT_FOUND` error is thrown with the message "User not found".

- **Profile Parsing**:
  - **Skill Tags**: The `skillTags` field is parsed from a JSON string into a JavaScript array. If parsing fails or if the field is empty, it defaults to an empty array.
  - **Social Links**: The `socialLinks` field is parsed from a JSON string into a JavaScript object (key-value pairs). If parsing fails or if the field is empty, it defaults to an empty object.

- **Data Aggregation**:
  - The procedure fetches basic user information from the `user` table and the associated profile from the `userProfiles` table.
  - The skill tags and social links are processed and returned in a structured format.

- **Performance**:
  - The procedure retrieves the user data and associated profile in a single query, improving efficiency.

- **Logging**:
  - Any parsing errors or failures are handled gracefully by falling back to default values (empty array or object).

#### Error Handling

- **User Not Found**: If the user does not exist, a `NOT_FOUND` error is returned.
- **Profile Parsing Errors**: If there is an issue parsing the `skillTags` or `socialLinks`, they will default to an empty array or object, respectively.

### `updateExtendedProfile`

**Type**: `mutation`  
**Called As**: `userRouter.updateExtendedProfile()`  
**Description**: Allows a user to update their profile information, including personal details from the `user` table and additional profile information from the `userProfiles` table. If the user has an existing profile, it updates; if not, a new profile is created.

#### Example Input

```json
{
  "name": "John Doe",
  "displayName": "John",
  "email": "john.doe@example.com",
  "image": "https://example.com/johndoe.jpg",
  "walletAddress": "0x1234567890abcdef",
  "gender": "Male",
  "niche": "Technology",
  "bio": "Software Developer",
  "location": "New York",
  "timezone": "GMT-5",
  "skillTags": ["JavaScript", "Node.js", "React"],
  "socialLinks": {
    "github": "https://github.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe"
  }
}
```

#### Example Output

```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### Notes

- **Authorization**:
  - Only the authenticated user can update their profile.

- **Data Validation**:
  - The procedure allows optional updates to the following fields:
    - **User Table**: `name`, `email`, `image`, `walletAddress`.
    - **UserProfiles Table**: `gender`, `niche`, `bio`, `location`, `timezone`, `skillTags`, and `socialLinks`.

- **Profile Parsing**:
  - **Skill Tags**: The `skillTags` field is expected to be an array of strings. If provided, it is converted to a JSON string for storage.
  - **Social Links**: The `socialLinks` field is expected to be an object (key-value pairs where the key is the social media platform and the value is the URL). It is also converted to a JSON string for storage.

- **Error Handling**:
  - If an error occurs during the update process, an `INTERNAL_SERVER_ERROR` is thrown with the message "Failed to update profile".

- **Profile Creation/Update**:
  - **User Table**: The user-related fields (`name`, `displayName`, `email`, `image`, `walletAddress`) are updated if new values are provided.
  - **UserProfiles Table**: If the user already has a profile, it is updated. If not, a new profile record is created with the provided data. The `isProfileComplete` field is set to `true` for new profiles.

- **Data Aggregation**:
  - The procedure handles both updating existing data and creating new records for a user's profile. It ensures atomicity by using a transaction for all operations.

- **Logging**:
  - Any errors encountered during the update process are logged for debugging purposes.

### Error Handling

- **Internal Server Error**: If the profile update fails, an `INTERNAL_SERVER_ERROR` is thrown.
