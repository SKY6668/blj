import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'

const root = process.cwd()

test('病例列表页使用仓库、筛选栏和病例卡片', () => {
  const page = readFileSync(resolve(root, 'pages/cases/index.uvue'), 'utf8')

  expect(existsSync(resolve(root, 'src/components/case-filter-bar.uvue'))).toBe(true)
  expect(existsSync(resolve(root, 'src/components/case-card.uvue'))).toBe(true)
  expect(page).toContain('createLocalCaseRepository')
  expect(page).toContain('filterCases')
  expect(page).toContain('case-filter-bar')
  expect(page).toContain('case-card')
  expect(page).toContain('退出登录')
})
