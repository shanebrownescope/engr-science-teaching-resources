# Contributing

This is for contributors maintaining the project.

## Content

<ol>

<li> <a href="#nextjs"> Next.js </a> </li>

 <li> <a href="#server-actions"> Server actions </a> </li>

 <li> <a href="#mantine"> Mantinue UI </a></li>

 <li><a href="#mysql"> MySQL </a></li>

 <li><a href="#next-auth"> Next.auth </a></li>
</ol>

## <span id="nextjs"> Next.js </span>

The project is currently on <a href="https://nextjs.org/blog/next-14">version</a> `14.0.2`.

## <span id="server-actions"> Server Actions </span>

The project uses server actions for fetching, mutating, and creating data.

All these actions can be found in the [actions](./engr-site/actions/) directory.

Server actions are sorted by their functionality. (e.g. any auth server action are in `./engr-site/actions/auth`).

Our server actions return an object of success and/or failure.

We are currently working on making the return structure more consistent and more conventional.

As of right now, the response either returns

```bash
{
  success: data
}
```

or

```bash
{
  failure: ""
}
```

or

```bash
{
  success?: data
  failure?: ""
}
```

We are working on a more clear approach:

### Success response

```
{
  success: true
  data?: Data
}
```

### Failure response

```
{
  success: false
  error: "Error message"
}
```

## <span id="mantine"> Mantine UI </span>

## <span id="mysql"> MySQL </span>

Files related to the database can be found in the [database](./engr-site/database) directory.

### Connecting to database in terminal

Run this in terminal to connect to database cluster

```bash
mysql -h [HOST] -u admin -p
```

Enter the password (DB_PASSWORD).

Once you are in, enter `use DB_NAME` to switch to that database.

You can now call queries to the database and get results in the terminal.

### Database schema

The file [NEWMASTER.sql](./engr-site/database/NEWMASTER.sql) contains all the
tables for our database.

### Database connector

The db connector can be found in the [dbConnector.ts](./engr-site/database/dbConnector.ts) file.

### Executing queries

There's a function called `dbConnect(query: string, values?: any[])` in [dbConnector.ts](./engr-site/database/dbConnector.ts) that is used to execute all the queries in our project.

The parameter `query` is the query that you want executed.

The parameter `values` is the values needed for the query if there are any `?` in the expected query.

### Queries

The queries that are executed in our project are declared in the files (server action files or helper files) that they will be used in.

### Helper functions

There are helper functions that we have for common queries like finding a user by Id or Email, etc.

These functions are in all the files in the [data](./engr-site/database/data) directory.

The file name is what the helper functions are for.

## <span id="next-auth"> Next.auth </span>

The projects is on <a href="https://authjs.dev/getting-started/migrating-to-v5"> version</a> `5.0.0-beta.5`.

These are the files that are important for the setup:

[auth.config.ts](./engr-site/auth.config.ts)

[auth.ts](./engr-site/auth.ts)

[routes.ts](./engr-site/routes.ts)

[[...nextauth]/route.ts](./engr-site/app/api/auth/[...nextauth]/route.ts)

### Helper functions and custom hooks

The file [authHelpers.ts](./engr-site/utils/authHelpers.ts) has helper functions for getting the currently logged in user and their role. These are async functions used for server pages and components.

The files [useCurrentRole.ts](./engr-site/hooks/useCurrentRole.ts) and [useCurrentUser.ts](./engr-site/hooks/useCurrentUser.ts) do the same thing but for client pages and components.

### Protected pages

All projected pages calls either [requireAuth()](./engr-site/actions/auth/requireAuth.ts) (for server or async entities) or [useRequireAuth()](./engr-site/hooks/useRequireAuth.ts) (for client entities) to verify the user is authorized.
The user will be redirected to `/auth/login` if they're not authorized.

### For the future: Middleware

Currently, we are calling functions on every protected page to check if the user is authenticated. A better solution would be to implement a middleware.

We have the middleware functionality in a file called [middleware.txt](./engr-site/middleware.txt).

The middleware was working in local development but was breaking in production due to **"Edge compatibility"** since there is a **"Node.js api"** used in the middleware.

We haven't been able to find a fix, maybe there's a bug in our code, or it'll work in the future with updates. But to test out the middleware, change `middleware.txt` to `middleware.ts`.

Here are some resources about the issue with **the edge**:

<ul>
<li><a href="https://authjs.dev/guides/edge-compatibility#middleware">Edge Compatibility </a> </li>
</ul>
