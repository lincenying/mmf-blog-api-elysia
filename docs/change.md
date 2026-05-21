# 变更记录

## 2026-05-21 09:30:00

- **JWT 工具**：`utils/jwt-token.ts` 统一 `signSessionToken` / `verifySessionToken`；`check-jwt` 改为同步布尔校验。
- **会话 Cookie**：`utils/session-cookie.ts` 抽取登录/登出 Cookie 读写，前后台 Controller 去重。
- **错误码**：`types/api-code.ts` 定义 `API_CODE`；Mongoose/Postgre/SQLite 等将 `-200` 改为 `SERVER_ERROR(500)`，业务校验统一 `VALIDATION(201)`。
- **数据库**：Service 经 `~/db` 导入 `sqliteDb` / `postgreDb`；Mongo 连接改为 `config.db.mongo_uri` + `mongo_db`。
- **路由**：`admin` POST 使用 `user.insert` Schema；postgre 增加 `login`/`logout` 与 404；bun-sqlite 增加 404。
- **环境**：新增 `.env.development.example`；`.gitignore` 忽略 `.env*`（保留 example）。

---

**本次改动建议的 commit message（未自动提交）：**

```
refactor: 集中 JWT/会话工具、统一 API_CODE 并完善配置示例
```

---

## 2026-05-21 09:05:51

- **目录规范**：新增 `src/db/index.ts` 统一导出 Drizzle 实例（`sqliteDb` / `postgreDb`）。
- **配置**：`config/schema.ts` 增加 `jwt.expiresInSeconds`，登录 Cookie `maxAge` 与 `jwt.sign` 的 `expiresIn` 均从配置读取。
- **插件化**：
  - `src/plugins/api-stack.ts`（自 `utils/api-stack` 迁入）；
  - `src/plugins/auth.ts`：`createAdminAuthGuard` / `createUserAuthGuard`，消除 Controller 内重复的 `checkJWT`；
  - `plugins/index.ts` 统一导出 CORS、响应包装、鉴权、API 栈、访问日志。
- **响应格式**：`response-wrapper` 对齐 `IApiResponse`（`code` / `message` / `data`），错误时 `data: null`；`ApiResponse` 类型改为 `IApiResponse` 别名。
- **路由**：后台/前台 Controller 公开路由置于鉴权插件之前；上传/JWT 模块复用 `createPublicApiLayer` / `createCookieSessionApiLayer`。
- **Bun 兼容**：`node:fs` / `node:crypto` / `node:path` 改为 `fs` / `path` 与 `crypto.randomUUID()`。
- **类型**：修复 `response-wrapper`、`user.ts`、`article.types.ts`、`lru-cache.ts` 中的 `any`。

---

**本次改动建议的 commit message（未自动提交）：**

```
refactor: 按 global-01-elysia 规范补齐插件、鉴权与 IApiResponse
```

---

## 2026-05-20 18:45:00

- **Mongoose Schema 迁入**：原 `src/schema/mongoose-*.ts` 移至 `src/modules/mongoose/`，并重命名为 **`*.schema.ts`**（`article`、`category`、`comment`、`user`、`admin`、`template`）。
- **引用**：各 `*.model.ts` 改为从 `~/modules/mongoose/<name>.schema` 默认导入 Model。
- **保留**：`src/schema/` 仅保留 `elysia-schema*.ts`（路由校验）。
- **规范**：更新 `.cursor/rules/global-01-elysia.mdc` 目录说明（`modules/mongoose` 与 `src/schema` 职责划分）。

---

**本次改动建议的 commit message（未自动提交）：**

```
refactor: 将 Mongoose schema 集中到 modules/mongoose
```

---

## 2026-05-20 18:00:00

- **Mongoose Model 迁入模块**：原 `src/models/*.model.ts` 全部移至对应模块目录——`modules/backend/`（`backend-article`、`backend-category`、`backend-user`）、`modules/frontend/`（`frontend-article`、`frontend-user`、`frontend-comment`、`frontend-like`）。
- **引用**：各 `*.service.ts` 改为相对路径 `./xxx.model` 引入；已删除空置的 `src/models/`。
- **规范**：`.cursor/rules/global-01-elysia.mdc` 项目结构中补充 `module.model.ts` 说明（与 Drizzle `db/schema` 并存场景）。

---

**本次改动建议的 commit message（未自动提交）：**

```
refactor: 将 Mongoose model 迁入 modules 并与 Service 同目录
```

---

## 2026-05-20 17:15:00

- **Mongo / 业务 Service 层**：将原 `src/controllers/*` 全部迁入对应模块下的 `*.service.ts`（后台：`backend-article/category/user.service.ts`；前台：`frontend-article/user/comment/like.service.ts`；上传：`upload-image.service.ts`；后台 Twig：`admin-template.service.ts`）。
- **路由插件**：`backend.controller`、`frontend.controller`、`upload.controller`、`admin.controller` 仅依赖上述 Service；后台「前台用户」管理路由改用 `FrontendUserService`，不再直连 `FrontendUserModel`。
- **移除**：整个 `src/controllers/` 目录（已无引用）。
- **依赖**：`AdminTemplateService` 通过相对路径调用 `BackendUserService`，替代原先 `AdminTemplateController` → `BackendUserController`。

---

**本次改动建议的 commit message（未自动提交）：**

```
refactor: 移除 controllers 目录并将 Mongoose 业务收口至模块 Service
```

---

## 2026-05-20 16:30:00

- **Drizzle 表定义**：迁入 `src/db/schema/postgre/`（`users.ts` + `index.ts`）、`src/db/schema/sqlite/`（`articles.ts`、`genealogy.ts` + `index.ts`）；删除原 `src/schema/postgre-sql.ts`、`src/schema/bun-sqlite.ts`。`drizzle.config.ts` / `drizzle-sqlite.config.ts` 的 `schema` 指向上述目录入口；`src/db/postgre-sql.ts`、`src/db/bun-sqlite.ts` 改为从 `~/db/schema/*` 聚合导出加载 schema。
- **修正**：Postgre `users` 列定义变量由拼写错误的 `userScheam` 改为 `userSchema`（仅变量名，表结构不变）。
- **Service 层**：Postgre 用户逻辑迁至 `src/modules/postgre/postgre-user.service.ts`（`PostgreUserService`）；SQLite 文章逻辑迁至 `src/modules/bun-sqlite/sqlite-article.service.ts`（`SqliteArticleService`）。`postgre.controller.ts`、`bun-sqlite.controller.ts` 仅调用 Service，不再直连原 Model。
- **移除**：`src/models/postgre/frontend-user.model.ts`、`src/models/sqlite/article.model.ts` 及空目录。

---

**本次改动建议的 commit message（未自动提交）：**

```
refactor: 拆分 Drizzle schema 目录与 Postgre/SQLite Service 层
```

---

## 2026-05-20 15:45:00

- 修复 `docker-compose.yml` 中 `api_postgres.healthcheck.test`：改为多行列表 + 纯标量形式，满足 ESLint `yaml/plain-scalar` / `yaml/quotes`，行为仍为 `CMD-SHELL` 执行 `pg_isready`。

---

**本次改动建议的 commit message（未自动提交）：**

```
style: 调整 postgres healthcheck 写法以符合 YAML 规范
```

---

## 2026-05-20 14:30:00

- 按 `global-01-elysia.mdc` 的 `modules/` 约定：原 `src/routes/*.ts` 全部迁入 `src/modules/<领域>/<领域>.controller.ts`，并由 `src/modules/index.ts` 统一导出，供 `app.ts` 以插件方式 `.use()` 挂载。
- 新增 `src/plugins/api-stack.ts`：`createPublicApiLayer()`（CORS + validationSchema + responseWrapper）、`createCookieSessionApiLayer()`（在其上附加 `cookies` 守卫），消除前台/后台/WebSocket 重复的中间件链。
- 新增 `src/utils/elysia-request.ts`：`cookieValue` / `queryString`，消除嵌套 `guard` 下 Cookie / query 推断为 `unknown` 导致的类型错误。
- `src/plugins/index.ts` 额外导出上述 API 层工厂函数。
- 删除已空置的 `src/routes/` 目录。

---

**本次改动建议的 commit message（未自动提交）：**

```
refactor: 路由迁入 modules 并抽取 API 中间件栈
```

---

## 2026-05-20 12:00:00

- 按 `global-01-elysia.mdc` 约定拆分入口：新增 `src/app.ts` 导出 `createApp()`，集中挂载插件与路由；`src/index.ts` 仅负责上传目录初始化、开发环境 Twig 预热、`createApp()` 与 `listen`，符合「入口不写业务组装、插件化挂载」。
- 在 `src/types/global.types.ts` 补充规范约定的 `IApiResponse<T>`（`code` / `message` / `data`），与现有判别联合型 `ApiResponse` 并存，便于新业务渐进对齐。
- TypeScript：`createApp` 不显式标注返回类型，避免 Elysia 条件挂载 Swagger 导致的泛型不兼容。

---

**本次改动建议的 commit message（未自动提交）：**

```
refactor: 按 Elysia 规范拆分应用入口并补充 IApiResponse 类型
```
