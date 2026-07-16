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
