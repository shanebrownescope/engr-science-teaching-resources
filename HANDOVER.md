# Developer Handover & Onboarding Guide

Welcome to the E-SCoPe (Engineering Science Teaching Resources) project! This document serves as an onboarding guide for developers taking over this codebase. It supplements the existing `README.md` and `CONTRIBUTING.md` by explaining the "how" and "why" behind the project's architecture, data flow, and role-based permissions.

---

## 1. Project Navigation (Directory Structure)

The core web application is housed entirely within the `engr-site` directory, which is a Next.js (App Router) project using TypeScript.

- **`actions/`**: Contains all Next.js Server Actions. This is like the "backend API" of the project. Actions are grouped by what they do (e.g., `auth/`, `delete/`).
- **`app/`**: Follows standard Next.js App Router conventions.
  - `(protected)/`: Any routes placed inside this route group are meant to be shielded from unauthenticated users.
  - `api/auth/[...nextauth]/`: The NextAuth backend configuration route.
- **`components/`**: UI components.
  - Custom components usually combine Mantine UI elements.
- **`database/`**: Defines the raw MySQL connector (`dbConnector.ts`) and contains historical schema snapshots (e.g., `MASTER.sql`).
- **`data/`**: Abstractions over raw SQL queries focused to specific entities (e.g., `user.ts` for user-related querying).
- **`hooks/`**: Custom React hooks. The most notable ones are `useCurrentRole.ts` and `useCurrentUser.ts` for retrieving auth state on the client side.
- **`schemas/`**: Validation schemas for forms and API validation.
- **`utils/`**: Helper methods like `authHelpers.ts` (for server-side session checks), AWS S3 client setup (`s3Client.ts`), and global types.

---

## 2. Role-Based Access Control (RBAC)

The system relies heavily on a three-tier role-based access model configured via NextAuth: **Admin**, **Instructor**, and **Student**.

### How Auth State is Managed
Authentication uses NextAuth v5 (Beta) with a JWT session strategy (configured in `auth.ts` and `auth.config.ts`).
1. During `signIn`, the user's role is queried from the DB.
2. The `jwt` callback injects the `token.role` onto the JWT.
3. The `session` callback maps `token.role` back to the active `session.user` object.

### The Role Hierarchy / Permissions
- **Admin**: Has full destructive permissions system-wide. They can approve/reject users, delete *any* resource (files or links) from the dashboard, and manage courses/tags.
- **Instructor**: Specifically granted access to the Dashboard to upload and manage their own resources. They can *only* delete files/links that belong to them (`uploadedUserId === session.user.id`).
- **Student**: Default authenticated state. Cannot access the Dashboard and has no "delete" capabilities.

### Protecting Features
To hide UI components conditionally (Client-side):
```tsx
import { useCurrentRole } from "@/hooks/useCurrentRole";

// Inside component:
const role = useCurrentRole();
if (role !== "admin") return null;
```

To block back-end mutations (Server Actions):
```typescript
import { getCurrentUser } from "@/utils/authHelpers";

// Inside server action:
const user = await getCurrentUser();
if (!user || user.role !== "admin") {
    return { error: "Not authorized" };
}
```

---

## 3. Data Models & Database Strategy

The project uses managed AWS RDS MySQL database.

### Table Versioning Discrepancy (Important Note)
> [!WARNING]
> While `database/MASTER.sql` provides a conceptual schematic of the current database logic, the live tables used in the application have been migrated to a version `_v3` schema (e.g., the code queries `Files_v3` rather than `Files` typically, though `MASTER.sql` refers to them without the suffix). When running fresh queries or performing maintenance, always check existing code for `_v3` references.

### Key Entities
1. **Users (`Users_v3`)**: Stores base authentication details and the critical `Role` and `AccountStatus` enums.
2. **Resources (`Files_v3` & `Links_v3`)**: The primary resources uploaded by Instructors/Admins. Files contain physical `S3Url` references, while Links do not. Both are relationally linked to their respective uploader (`uploadedUserId`).
3. **Taxonomy (`Courses`, `Modules`, `Tags`)**: Resources are mapped to Topics, which are mapped to Courses. Many-to-many relationships (like `FileTags`) link search terms to resources.

### Database Connection Strategy
Database querying is largely not handled by an ORM. Instead, the project uses `dbConnect` (`database/dbConnector.ts`) to run raw parameterized SQL statements asynchronously.

---

## 4. Third-Party Integrations & Workflows

### AWS S3 File Handling Workflow
1. The client requests an upload token from the server action (`actions/uploadingPostTags/getSignedUrl.ts`) along with file metadata (checksum, size, type).
2. The Server Action uses `@aws-sdk/client-s3` (`utils/s3Client.ts`) and `@aws-sdk/s3-request-presigner` to generate a pre-signed URL for a `PutObjectCommand`.
3. The Server Action writes the expected S3 URL and relational metadata to the `Files_v3` table via raw SQL *before* the upload happens.
4. The signed URL is returned to the client, which then runs the physical file upload directly to AWS S3.
5. **Deletion**: Deletion actions (like `deleteFileAction`) run a `DeleteObjectCommand` using the URL parsed from the database before deleting the DB row.

### NextAuth 5.0 Edge Middleware Notes
> [!CAUTION]
> As documented in `CONTRIBUTING.md`, the edge `middleware.ts` feature is currently disabled and renamed to `middleware.txt`. Our custom DB queries inside session strategies rely on Node-specific APIs that crash the Next.js Edge runtime. Until an Edge-compatible strategy or database driver (e.g., PlanetScale / serverless driver) is implemented, protection acts on the `page.tsx` component level via `requireAuth()` rather than central middleware.

---

## 5. Step-by-Step Developer Guides

### How to Create a New Server Action
1. Create a new TS file inside `actions/{domain}/`.
2. Add `"use server";` to the very top line.
3. Validate permissions dynamically by calling `await getCurrentUser()`.
4. Ensure the output strictly conforms to the expected structure (e.g., `{ success?: any, error?: string }`).
5. (Optional) Revalidate paths via `revalidatePath("/")` if the UI depends on fresh data cache.

### How to Create a New Database Table
1. Define the abstract schema in `database/MASTER.sql` (for documentation sanity).
2. Manually deploy the raw `CREATE TABLE` query via your preferred MySQL client into the AWS RDS instance.
3. Ensure the active queries in server actions or the `data/` folder correctly reference the new table name (`_v3` format if continuing existing conventions).
