# Directory Structure

In [Quick Start](./features$started), you should have a preliminary impression of the framework. Now let's briefly understand the directory convention specifications.

Here, let's first briefly discuss the development history of applications combining Node.js + frontend.

## Directory Structure Evolution

Over different time periods, the directory structure organization of applications combining Node.js + frontend has been constantly changing. Here, it can be roughly divided into three stages.

### Complete Frontend-Backend Independence

In the earliest practices, some teams simply forced Node.js and frontend-related code folders into one `Repo` for maintenance. However, they were mutually independent, including independent `package.json` and independent development build commands.
This approach actually has very poor maintainability and development experience.

With this type of structure division, during local development, we often need to open two terminal shells to run the startup commands for both ends respectively. Or use modules like [concurrently](https://www.npmjs.com/package/concurrently) to run two commands in parallel. Similarly, our dependency installation operations and dependency build operations all need to run in this mode. Very cumbersome.

### Independent Frontend-Backend Folders

Another approach is independent frontend-backend folders, but with shared `package.json` and development startup build commands. This is also the organizational structure currently adopted by this framework. The advantage of this is that developers don't need to pay attention to the details of both ends, and only need to execute one `ssr start` command to start all services. The `ssr build` command builds all the resource files used.

### Shared Frontend-Backend Folders

Now some teams are exploring frontend-backend integration related practices. They proposed the idea of maintaining frontend-backend code in one folder.

The advantage of this is that frontend components can quickly reuse `interface` defined by the server side. But although the syntax is both `ts|js`, their actual runtime environments are completely different. This approach requires very high mental demands from users. Once both ends access each other's environment variables, it will be a disaster when packaging.

For example, a common `utils` contains files that can only run on the server side, or can only run on the client side. Problems will definitely occur during runtime or packaging if no special handling is done.

```js
// utils/foo.ts
import * as fs from "fs";

// utils/bar.ts
const bar = window.bar;
export default bar;

// utils/index.ts
export * from "./foo";
export * from "./bar";
```

But this approach is a future development trend. We will also consider how to better organize directory structure to enable frontend-backend to share environment-independent code.

## Directory Structure

The following is the application directory structure created by the `ssr` framework by default. This structure remains consistent across `React`, `Vue2`, and `Vue3` scenarios. The only difference is the file extension difference between `tsx|vue`.

```shell
.
├── build # web directory build artifacts, like the public folder, will be set as static resource folder, non-application build artifact static resource files like images/fonts should be placed in the public folder and imported by frontend code via absolute paths
│   ├── client # stores frontend static resource files
│   └── server # stores externalized server bundle
├── public # serves as static resource directory for storing static resource files
├── config.js # defines application configuration (used at framework level, required in production environment)
├── config.prod.js # (optional) if exists, treated as production environment application configuration
├── f.yml # (optional), only used in Serverless scenarios, automatically created if ssr deploy detects this file doesn't exist
├── package.json
├── src # stores server-side Node.js related code
│   └── index.ts
├── tsconfig.json # server-side Node.js compilation configuration file
├── typings # stores common type files for frontend and backend
├── web # stores frontend component related code
│   ├── components # stores common components
│   │   └── header # common header
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   └── layout # page html layout
│   │       └── index.tsx # page html layout, only rendered on server side
│   │       └── App.tsx # specific page component content, used for initializing common configurations
│   │       └── fetch.ts # layout level fetch, used to get common data for all pages, called before each page-level fetch call
│   ├── pages # folders under pages directory will be mapped to frontend routing table, storing page-level components
│   │   ├── index # index folder maps to root route /index => /
│   │   │   ├── fetch.ts # defines fetch file to unify server/client data fetching methods, distinguishes environment through __isBrowser__ variable, called during homepage server-side rendering and frontend route switching
│   │   │   ├── index.less
│   │   │   └── render.tsx # defines render file to define page rendering logic
│   │   └── detail
│   │   │   ├── fetch.ts
│   │   │   ├── index.less
│   │   │   └── render$id.tsx # maps to /detail/:id
│   │   │   └── user
│   │   │        ├── fetch.ts
│   │   │        └── render$id.tsx # multi-level routes map to /detail/user/:id according to rules
│   │   │        └── render$user$id.tsx # multi-parameter routes map to /detail/user/:user/:id
│   │   ├── bar
│   │   │   ├── fetch.ts
│   │   │   └── render.tsx
│   │   │   ├── fetch$id.ts
│   │   │   └── render$id.tsx # when multiple render type files exist, each render file corresponds to a fetch file with the same name, e.g., render$id corresponds to fetch$id
│   ├── tsconfig.json # tsconfig under web directory is only used for editor ts syntax checking
```

For more detailed understanding of `frontend route mapping`, you can read the [Conventional Routes](./features$feRoutes) chapter.

For more detailed understanding of `fetch.ts` files, you can read the [Data Fetching](./features$fetch) chapter.

For more detailed understanding of `config.js` files, you can read the [Application Configuration](./api$config) chapter.
