# 登录页与路由骨架实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 交付可使用演示账号登录、可进入病例列表占位页，并具备五个已注册后续页面路由的 uni-app X 导航骨架。

**Architecture:** 登录页复用现有 `createDemoAuthRepository(getBrowserStorage())` 完成前端本地演示账号校验。页面路由集中定义于 `pages.json`；病例列表和其余业务页面只作为静态占位页，通过 `uni.navigateTo` 和 `uni.reLaunch` 维持单向、可验证的导航关系。

**Tech Stack:** uni-app X、UTS、TypeScript、Vitest、Node 类型定义。

## 全局约束

- 只使用虚构匿名演示数据；不添加真实患者资料、图片、分享链接、二维码或网络请求。
- 登录页只能通过现有 `DemoAuthRepository` 校验；密码不能写入存储、日志或页面状态以外的持久位置。
- 页面不得直接使用 `uni.getStorageSync`；本阶段仅由既有 `getBrowserStorage()` 通过认证仓库访问存储。
- 仅实现登录与导航骨架；不读取、筛选、保存或删除病例。
- H5 构建 CLI 无连接时必须以非零退出码失败，不能报告为成功。

---

## 文件结构

- `package.json`：增加 Node 类型定义开发依赖。
- `tsconfig.json`：将 Node 类型加入测试/工具代码的类型环境。
- `src/tests/page-routing.test.ts`：验证入口页、全部路由及页面文件存在。
- `pages.json`：注册入口、病例列表及四个后续占位页面。
- `pages/index/index.uvue`：演示账号登录界面及跳转。
- `pages/cases/index.uvue`：病例列表静态占位页与后续页面入口。
- `pages/case-edit/index.uvue`、`pages/case-detail/index.uvue`、`pages/presentation/index.uvue`、`pages/share-settings/index.uvue`：各自独立的静态占位页与返回入口。
- `scripts/build-h5.ps1`：在 CLI 输出“未检测到已打开的 HBuilderX”或“连接已中断”时终止构建。
- `src/tests/build-h5-script.test.ts`：验证构建脚本保留标题且检测 CLI 连接错误输出。

### Task 1: 修复类型检查并建立路由结构测试

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Create: `src/tests/page-routing.test.ts`

**Interfaces:**
- Consumes: `pages.json` 和六个 `.uvue` 页面文件。
- Produces: `npm.cmd exec -- tsc --noEmit` 可通过；路由测试对入口路径与页面集合的固定约束。

- [ ] **Step 1: 写入失败的路由结构测试**

```ts
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'

const root = process.cwd()
const expectedPaths = [
  'pages/index/index',
  'pages/cases/index',
  'pages/case-edit/index',
  'pages/case-detail/index',
  'pages/presentation/index',
  'pages/share-settings/index',
]

test('页面入口为登录页且所有骨架路由均已注册', () => {
  const pages = JSON.parse(readFileSync(resolve(root, 'pages.json'), 'utf8')) as {
    pages: Array<{ path: string }>
  }

  expect(pages.pages.map((page) => page.path)).toEqual(expectedPaths)
  for (const pagePath of expectedPaths) {
    expect(existsSync(resolve(root, `${pagePath}.uvue`))).toBe(true)
  }
})
```

- [ ] **Step 2: 运行测试并确认它先失败**

运行：`npm.cmd test -- src/tests/page-routing.test.ts`

预期：失败，原因是仅存在入口路由和占位首页。

- [ ] **Step 3: 补全 Node 类型工具链**

在 `package.json` 的 `devDependencies` 中加入：

```json
"@types/node": "^24.0.0"
```

将 `tsconfig.json` 的类型配置改为：

```json
"types": ["node", "vitest/globals"]
```

运行：`npm.cmd install`

预期：更新 `package-lock.json`，安装 `@types/node`。

- [ ] **Step 4: 验证类型检查已恢复**

运行：`npm.cmd exec -- tsc --noEmit`

预期：退出码为 `0`，且没有 `node:fs`、`node:path` 或 `process` 缺失的错误。

- [ ] **Step 5: 提交工具链与测试基线**

```powershell
git add package.json package-lock.json tsconfig.json src/tests/page-routing.test.ts
git commit -m "test: cover routing skeleton"
```

### Task 2: 注册路由并创建静态占位页面

**Files:**
- Modify: `pages.json`
- Create: `pages/cases/index.uvue`
- Create: `pages/case-edit/index.uvue`
- Create: `pages/case-detail/index.uvue`
- Create: `pages/presentation/index.uvue`
- Create: `pages/share-settings/index.uvue`
- Test: `src/tests/page-routing.test.ts`

**Interfaces:**
- Consumes: 路由测试定义的六个路径。
- Produces: `pages/index/index` 为入口，后续五个页面均可由 uni-app X 路由加载。

- [ ] **Step 1: 将页面路由写入 `pages.json`**

```json
{
  "pages": [
    { "path": "pages/index/index", "style": { "navigationBarTitleText": "演示登录" } },
    { "path": "pages/cases/index", "style": { "navigationBarTitleText": "病例列表" } },
    { "path": "pages/case-edit/index", "style": { "navigationBarTitleText": "新建病例" } },
    { "path": "pages/case-detail/index", "style": { "navigationBarTitleText": "病例详情" } },
    { "path": "pages/presentation/index", "style": { "navigationBarTitleText": "展示册" } },
    { "path": "pages/share-settings/index", "style": { "navigationBarTitleText": "分享设置" } }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "牙科病例库",
    "navigationBarBackgroundColor": "#f5f7fb",
    "backgroundColor": "#f5f7fb"
  }
}
```

- [ ] **Step 2: 创建病例列表占位页**

```vue
<template>
  <view class="page">
    <text class="title">病例列表</text>
    <text class="description">页面导航骨架已就绪；病例数据将在后续阶段接入。</text>
    <button @click="goTo('case-edit')">新建病例</button>
    <button @click="goTo('case-detail')">病例详情</button>
    <button @click="goTo('presentation')">展示册</button>
    <button @click="goTo('share-settings')">分享设置</button>
  </view>
</template>

<script setup lang="uts">
function goTo(page: string) {
  uni.navigateTo({ url: `/pages/${page}/index` })
}
</script>
```

- [ ] **Step 3: 为四个后续路由分别创建占位页**

每个页面使用对应标题，并使用同一返回函数：

```vue
<template>
  <view class="page">
    <text class="title">页面标题</text>
    <text class="description">该功能将在后续阶段实现。</text>
    <button @click="backToCases">返回病例列表</button>
  </view>
</template>

<script setup lang="uts">
function backToCases() {
  uni.reLaunch({ url: '/pages/cases/index' })
}
</script>
```

其中“页面标题”依次替换为“新建病例”“病例详情”“展示册”“分享设置”。为每个页面补充 `.page`、`.title`、`.description` 样式，保持现有浅色背景和移动端间距。

- [ ] **Step 4: 运行路由结构测试**

运行：`npm.cmd test -- src/tests/page-routing.test.ts`

预期：1 个测试通过，六个路由顺序与全部页面文件均匹配。

- [ ] **Step 5: 提交路由骨架**

```powershell
git add pages.json pages/cases/index.uvue pages/case-edit/index.uvue pages/case-detail/index.uvue pages/presentation/index.uvue pages/share-settings/index.uvue
git commit -m "feat: add page routing skeleton"
```

### Task 3: 实现演示登录入口

**Files:**
- Modify: `pages/index/index.uvue`
- Test: `src/tests/auth-repository.test.ts`
- Test: `src/tests/page-routing.test.ts`

**Interfaces:**
- Consumes: `createDemoAuthRepository(storage: KeyValueStorage): DemoAuthRepository`、`getBrowserStorage(): KeyValueStorage`。
- Produces: 提交邮箱与密码后，成功时调用 `uni.reLaunch({ url: '/pages/cases/index' })`；失败时仅显示通用错误提示。

- [ ] **Step 1: 扩充认证测试，锁定非敏感持久化行为**

在 `src/tests/auth-repository.test.ts` 追加：

```ts
test('当前会话不包含邮箱或密码', () => {
  const storage = createMemoryStorage()
  const repository = createDemoAuthRepository(storage)

  repository.login(demoAccount.email, demoAccount.password)

  expect(repository.currentSession()).toEqual({
    accountId: demoAccount.id,
    displayName: demoAccount.displayName,
  })
  expect(storage.getItem('dental-case-library.session')).not.toContain(demoAccount.email)
  expect(storage.getItem('dental-case-library.session')).not.toContain(demoAccount.password)
})
```

- [ ] **Step 2: 运行认证测试并确认它失败**

运行：`npm.cmd test -- src/tests/auth-repository.test.ts`

预期：失败；现有会话存储是否含邮箱取决于实现，若已通过则记录该断言为已满足，并继续执行下一步，不修改认证仓库。

- [ ] **Step 3: 用既有认证仓库替换入口占位内容**

```vue
<script setup lang="uts">
import { createDemoAuthRepository, demoAccount } from '../../src/data/auth-repository'
import { getBrowserStorage } from '../../src/data/storage'

let email = ''
let password = ''
let errorMessage = ''
const authRepository = createDemoAuthRepository(getBrowserStorage())

function submitLogin() {
  errorMessage = ''
  const session = authRepository.login(email, password)
  if (!session) {
    errorMessage = '演示账号或密码不正确。'
    return
  }

  uni.reLaunch({ url: '/pages/cases/index' })
}
</script>

<template>
  <view class="page">
    <text class="title">牙科病例库</text>
    <text class="description">演示登录，不可用于真实账号。</text>
    <input v-model="email" placeholder="邮箱" />
    <input v-model="password" password placeholder="密码" />
    <button @click="submitLogin">登录</button>
    <text v-if="errorMessage" class="error">{{ errorMessage }}</text>
    <text class="hint">演示账号：{{ demoAccount.email }} / {{ demoAccount.password }}</text>
  </view>
</template>
```

为 `.error` 添加醒目的红色文字样式，为输入框补充边框、间距和可读性样式；不新增存储或网络代码。

- [ ] **Step 4: 验证认证与路由测试**

运行：`npm.cmd test -- src/tests/auth-repository.test.ts src/tests/page-routing.test.ts`

预期：认证测试与路由测试全部通过。

- [ ] **Step 5: 提交登录入口**

```powershell
git add pages/index/index.uvue src/tests/auth-repository.test.ts
git commit -m "feat: add demo login entry"
```

### Task 4: 让 H5 构建失败可观测并回归验证

**Files:**
- Modify: `scripts/build-h5.ps1`
- Modify: `src/tests/build-h5-script.test.ts`

**Interfaces:**
- Consumes: HBuilderX `cli.exe` 的标准输出和退出码。
- Produces: 当 CLI 输出“未检测到已打开的HBuilderX”或“与主程序的连接已中断”时，`build:h5` 返回非零退出码。

- [ ] **Step 1: 写入构建失败识别测试**

在 `src/tests/build-h5-script.test.ts` 追加：

```ts
test('H5 构建脚本会把 CLI 连接错误转换为失败退出码', () => {
  const script = readFileSync(resolve(process.cwd(), 'scripts/build-h5.ps1'), 'utf8')

  expect(script).toContain('未检测到已打开的HBuilderX')
  expect(script).toContain('与主程序的连接已中断')
  expect(script).toContain('exit 1')
})
```

- [ ] **Step 2: 运行构建脚本测试并确认它失败**

运行：`npm.cmd test -- src/tests/build-h5-script.test.ts`

预期：新增断言失败，因为脚本尚未检查 CLI 输出内容。

- [ ] **Step 3: 为 `scripts/build-h5.ps1` 增加 CLI 输出检查**

将两次 CLI 调用都通过临时变量捕获输出，在输出中出现以下任一字符串时打印原始输出并 `exit 1`：

```powershell
'未检测到已打开的HBuilderX'
'与主程序的连接已中断'
```

保留现有对 `$LASTEXITCODE` 的检查、`--webTitle '牙科病例库'` 和 UTF-8 BOM。发布命令成功且未出现错误文本时，维持 `exit $LASTEXITCODE`。

- [ ] **Step 4: 运行构建脚本测试和完整测试集**

运行：`npm.cmd test`

预期：所有测试通过。

运行：`npm.cmd run build:h5`

预期：若 HBuilderX CLI 仍未连接，命令以非零退出码失败并输出明确的连接错误；若 CLI 已连接，生成 H5 构建产物且退出码为 `0`。

- [ ] **Step 5: 提交构建可观测性改进**

```powershell
git add scripts/build-h5.ps1 src/tests/build-h5-script.test.ts
git commit -m "fix: fail h5 build when cli disconnects"
```

## 最终回归

- [ ] 运行：`npm.cmd exec -- tsc --noEmit`；预期退出码为 `0`。
- [ ] 运行：`npm.cmd test`；预期全部测试通过。
- [ ] 在 HBuilderX CLI 可用时运行：`npm.cmd run build:h5`；预期退出码为 `0`。
- [ ] 手工验证：错误账号停留在登录页并显示通用错误；正确演示账号进入病例列表；列表页可打开四个占位页；每个占位页可返回列表。
