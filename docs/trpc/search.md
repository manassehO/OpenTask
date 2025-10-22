# Search Router (`searchRouter`)

This router handles global search operations, allowing users to search for tasks, courses, or tutorials based on a query string. It supports filtering by type (`tasks`, `courses`, `tutorials`, or `all`) and includes pagination.

---

# Table of Contents

1. [globalSearch](#globalsearch)
   - [Type](#type)
   - [Called As](#called-as)
   - [Description](#description)
   - [Example Input](#example-input)
   - [Example Output](#example-output)
   - [Notes](#notes)

---

## `globalSearch`

**Type**: `query`  
**Called As**: `searchRouter.globalSearch()`  
**Description**: Performs a global search across tasks, courses, or tutorials, filtering by title, description, or category. It allows the search to be limited to specific types and supports pagination.

#### Example Input

```json
{
  "query": "task",
  "type": "all",
  "limit": 20
}
```

#### Example Output

```json
{
  "success": true,
  "results": [
    {
      "id": "task-uuid-1",
      "title": "Task 1",
      "description": "Description of Task 1",
      "category": "Category 1",
      "type": "task"
    },
    {
      "id": "course-uuid-1",
      "title": "Course 1",
      "description": "Description of Course 1",
      "category": "Category 1",
      "type": "course"
    }
  ]
}
```

### Notes

- **Search Parameters**:
  - **`query`**: The search string to look for in the `title`, `description`, or `category` fields.
  - **`type`**: The type of content to search for. Available options:
    - `tasks`: Only search tasks.
    - `courses`: Only search courses.
    - `tutorials`: Only search tutorials.
    - `all`: Search across tasks, courses, and tutorials (default).
  - **`limit`**: The number of results returned per page. Default is `20`, and the maximum is `50`.

- **Error Handling**:
  - If an error occurs while fetching tasks, courses, or tutorials, an `INTERNAL_SERVER_ERROR` is thrown.

- **Search Logic**:
  - Searches for the query in the `title`, `description`, or `category` fields.
  - Filters out tasks with statuses other than `ACTIVE` or `COMPLETED`.
  - Filters out courses and tutorials that are not `ACTIVE`.

- **Sorting**:
  - Results are returned in ascending order of `createdAt` for all types (`tasks`, `courses`, `tutorials`).

- **Data Aggregation**:
  - Returns a list of results, each containing the `id`, `title`, `description`, `category`, and `type` (either `task`, `course`, or `tutorial`).

- **Pagination**:
  - The `limit` parameter controls how many results are returned per page.

- **Response Format**:
  - Returns a `success` field indicating if the search was successful and a `results` field containing the list of matched items.
