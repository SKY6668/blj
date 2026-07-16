# 牙科病例库 MVP 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个可在 H5 运行的匿名牙科病例整理原型，支持演示账户登录、病例管理、展示和分享设置预览。

**Architecture:** uni-app X 页面仅依赖 `CaseRepository`、`AuthRepository` 与 `ShareRepository` 三个前端接口。第一版实现本地存储版本；后端接入时新增 API 实现而不改变页面调用。

**Tech Stack:** uni-app X、Vue 3、TypeScript、uni-app 本地存储 API、Vitest。

## 全局约束

- 只使用虚构的匿名病例、标签和占位图；不得添加真实患者信息或图片。
- 演示登录不得保存真实密码、不得发起网络认证请求。
- 所有存储通过仓库接口访问；页面禁止直接调用 `uni.getStorageSync`。
- H5 是本期唯一构建验收目标；Android/iOS 真机与 Docker 后端不在本计划内。
- 每项任务完成后先执行对应测试，再创建 Git 提交；提交前由用户确认提交范围。

---

## 文件结构

- `src/domain/case.ts`：病例、图片、分享设置类型与常量。
- `src/domain/auth.ts`：演示账户与会话类型。
- `src/data/storage.ts`：本地存储读写、JSON 解析与错误恢复。
- `src/data/demo-data.ts`：匿名演示账户和病例种子数据。
- `src/data/case-repository.ts`：病例仓库接口和本地实现。
- `src/data/auth-repository.ts`：登录、会话和退出接口及本地实现。
- `src/data/share-repository.ts`：分享设置接口及本地实现。
- `src/services/case-filter.ts`：纯函数筛选逻辑。
- `src/services/case-validation.ts`：纯函数表单校验。
- `src/stores/session.ts`：应用会话状态与路由守卫使用的状态。
- `src/components/*`：列表卡片、筛选栏、图片对比和表单组件。
- `src/pages/*`：登录、病例列表、编辑、详情、展示、分享设置页面。
- `src/tests/*`：数据层和纯服务函数测试。

### Task 1: 创建 uni-app X 工程与测试入口

**Files:**
- Create: `package.json`
- Create: `pages.json`
- Create: `manifest.json`
- Create: `src/App.uvue`
- Create: `src/main.uts`
- Create: `src/pages/login/index.uvue`
- Create: `vitest.config.ts`
- Create: `src/tests/setup.ts`

**Interfaces:**
- Produces: 可在 HBuilderX 中运行的 H5 项目和 `npm run test` 命令。

- [ ] 在 HBuilderX 将当前工作区 `C:\Users\13715\Documents\blj` 初始化为“uni-app X”空项目；不要额外创建嵌套项目目录。
- [ ] 将初始页面设为 `src/pages/login/index.uvue`，并在 `pages.json` 注册后续页面路径：`cases`、`case-edit`、`case-detail`、`presentation`、`share-settings`。
- [ ] 在 `package.json` 增加脚本：

```json
{
  "scripts": {
    "test": "vitest run --passWithNoTests",
    "test:watch": "vitest",
    "build:h5": "uni build -p h5"
  }
}
```

- [ ] 安装 `vitest`，创建最小 `vitest.config.ts`：

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: { environment: 'node', include: ['src/tests/**/*.test.ts'] },
})
```

- [ ] 运行：`npm run test`。预期：退出码为 `0`，暂时显示没有测试文件。

### Task 2: 定义领域类型与匿名演示数据

**Files:**
- Create: `src/domain/case.ts`
- Create: `src/domain/auth.ts`
- Create: `src/data/demo-data.ts`
- Test: `src/tests/demo-data.test.ts`

**Interfaces:**
- Produces: `CaseRecord`、`CaseImage`、`ShareSettings`、`DemoAccount` 和 `demoCases`。

- [ ] 编写失败测试，断言每个演示病例没有 `patientName` 字段、包含匿名 `caseCode`，且每张图片均为 `isDeidentified: true`。
- [ ] 运行：`npm run test -- src/tests/demo-data.test.ts`。预期：因模块不存在而失败。
- [ ] 实现核心类型：

```ts
export type ImageLabel = 'before' | 'procedure' | 'after'
export interface CaseImage { id: string; label: ImageLabel; previewUrl: string; isDeidentified: boolean }
export interface CaseRecord { id: string; caseCode: string; treatmentType: string; toothPositions: string[]; treatmentDate: string; tags: string[]; summary: string; images: CaseImage[]; createdAt: string; updatedAt: string }
export interface ShareSettings { caseId: string; expiresAt: string; maxViews: number; revoked: boolean }
```

- [ ] 在 `demo-data.ts` 提供一组 `demo@dental.local / demo1234` 演示账户和至少三条虚构病例；所有图片使用应用内 SVG 或 data URL 占位图。
- [ ] 重跑同一测试。预期：通过。

### Task 3: 实现本地存储与病例仓库

**Files:**
- Create: `src/data/storage.ts`
- Create: `src/data/case-repository.ts`
- Test: `src/tests/case-repository.test.ts`

**Interfaces:**
- Consumes: `CaseRecord`、`demoCases`。
- Produces: `CaseRepository`，包含 `list()`、`getById(id)`、`save(caseRecord)`、`remove(id)`。

- [ ] 编写失败测试：首次 `list()` 返回种子病例；`save()` 后可读取修改值；无效 JSON 时回退种子病例。
- [ ] 运行：`npm run test -- src/tests/case-repository.test.ts`。预期：失败。
- [ ] 定义接口和实现：

```ts
export interface CaseRepository {
  list(): Promise<CaseRecord[]>
  getById(id: string): Promise<CaseRecord | null>
  save(caseRecord: CaseRecord): Promise<void>
  remove(id: string): Promise<void>
}
```

- [ ] 在 `storage.ts` 注入 `StorageAdapter`，生产实现包装 uni-app 存储 API，测试使用内存适配器；解析失败时删除损坏值并返回种子数据。
- [ ] 重跑测试。预期：通过。

### Task 4: 实现演示登录与会话状态

**Files:**
- Create: `src/data/auth-repository.ts`
- Create: `src/stores/session.ts`
- Modify: `src/pages/login/index.uvue`
- Test: `src/tests/auth-repository.test.ts`

**Interfaces:**
- Consumes: `DemoAccount`、`StorageAdapter`。
- Produces: `AuthRepository.login(email, password)`、`currentSession()`、`logout()`。

- [ ] 编写失败测试：正确演示凭据返回仅含 `accountId` 和 `displayName` 的会话；错误密码返回 `null`；`logout()` 清除会话。
- [ ] 实现接口：

```ts
export interface Session { accountId: string; displayName: string }
export interface AuthRepository {
  login(email: string, password: string): Promise<Session | null>
  currentSession(): Promise<Session | null>
  logout(): Promise<void>
}
```

- [ ] 登录页显示邮箱、密码、演示账户提示和登录失败信息；成功后替换为会话状态并跳转病例列表。密码只用于本次数组匹配，不写入存储。
- [ ] 运行：`npm run test -- src/tests/auth-repository.test.ts`。预期：通过。

### Task 5: 实现病例列表、搜索和筛选

**Files:**
- Create: `src/services/case-filter.ts`
- Create: `src/components/case-filter-bar.uvue`
- Create: `src/components/case-card.uvue`
- Create: `src/pages/cases/index.uvue`
- Test: `src/tests/case-filter.test.ts`

**Interfaces:**
- Consumes: `CaseRecord[]`。
- Produces: `filterCases(cases, criteria)`。

- [ ] 编写失败测试，覆盖关键词匹配病例编号/说明、治疗类型匹配、牙位匹配、标签交集和多个条件同时生效。
- [ ] 实现纯函数：

```ts
export interface CaseFilter { keyword: string; treatmentType: string; toothPosition: string; tag: string }
export function filterCases(cases: CaseRecord[], filter: CaseFilter): CaseRecord[]
```

- [ ] 列表页从 `CaseRepository.list()` 读取数据，使用筛选组件即时渲染卡片，提供“新建病例”和“退出登录”入口。
- [ ] 运行对应测试，并在 HBuilderX 的 H5 预览验证手机和桌面布局。

### Task 6: 实现病例新建、编辑与验证

**Files:**
- Create: `src/services/case-validation.ts`
- Create: `src/components/case-form.uvue`
- Create: `src/pages/case-edit/index.uvue`
- Test: `src/tests/case-validation.test.ts`

**Interfaces:**
- Consumes: 编辑表单值。
- Produces: `validateCaseDraft(draft)` 返回字段错误集合。

- [ ] 编写失败测试：缺少病例编号、治疗类型、牙位、脱敏确认时分别返回错误；完整草稿返回空错误集合。
- [ ] 实现校验函数：

```ts
export interface CaseDraft { caseCode: string; treatmentType: string; toothPositions: string[]; treatmentDate: string; tags: string[]; summary: string; images: CaseImage[]; deidentifiedConfirmed: boolean }
export type ValidationErrors = Partial<Record<keyof CaseDraft, string>>
export function validateCaseDraft(draft: CaseDraft): ValidationErrors
```

- [ ] 表单支持标签输入、术前/过程/术后图片占位预览和脱敏确认；保存时创建或更新 `CaseRecord` 并调用 `CaseRepository.save()`。
- [ ] 运行测试，手工验证无效输入不会保存。

### Task 7: 实现详情、展示册和分享设置预览

**Files:**
- Create: `src/components/image-comparison.uvue`
- Create: `src/pages/case-detail/index.uvue`
- Create: `src/pages/presentation/index.uvue`
- Create: `src/data/share-repository.ts`
- Create: `src/pages/share-settings/index.uvue`
- Test: `src/tests/share-repository.test.ts`

**Interfaces:**
- Produces: `ShareRepository.get(caseId)`、`save(settings)` 和 `ShareSettings` 本地状态。

- [ ] 编写失败测试：首次读取返回默认设置；保存有效期、访问次数和撤销标记后可恢复。
- [ ] 实现接口：

```ts
export interface ShareRepository {
  get(caseId: string): Promise<ShareSettings>
  save(settings: ShareSettings): Promise<void>
}
```

- [ ] 详情页按图片标签分组显示，展示册页支持前后切换；分享页允许保存设置和撤销状态，固定显示“演示原型，不生成真实分享链接”。
- [ ] 运行分享仓库测试，手工验证分享页不出现 URL、二维码和网络请求。

### Task 8: H5 构建、回归验证与交付说明

**Files:**
- Create: `README.md`
- Modify: `docs/superpowers/specs/2026-07-16-dental-case-library-mvp-design.md`

**Interfaces:**
- Produces: 可复现的本地运行说明和 MVP 验收记录。

- [ ] 在 README 写明：HBuilderX 打开项目、H5 运行方式、演示账户、原型数据限制、真实病例禁入规则和未来后端接入点。
- [ ] 运行：`npm run test`。预期：所有仓库、筛选、验证测试通过。
- [ ] 运行：`npm run build:h5` 或使用 HBuilderX“发行 → 网站-H5手机版”。预期：生成可预览的 H5 构建产物且无编译错误。
- [ ] 按验收标准手动检查：登录/退出、列表筛选、病例保存后刷新恢复、详情展示、分享页无真实链接。
- [ ] 向用户汇报构建与手工验证结果，并请求确认是否提交首版代码。
