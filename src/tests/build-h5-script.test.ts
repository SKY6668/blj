import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'

test('H5 构建脚本提供闭合的网页标题字符串', () => {
  const scriptPath = resolve(process.cwd(), 'scripts/build-h5.ps1')
  const file = readFileSync(scriptPath)
  const script = file.toString('utf8')

  expect([...file.subarray(0, 3)]).toEqual([0xef, 0xbb, 0xbf])
  expect(script).toContain("--webTitle '牙科病例库'")
})

test('H5 构建脚本会把 CLI 连接错误转换为失败退出码', () => {
  const script = readFileSync(resolve(process.cwd(), 'scripts/build-h5.ps1'), 'utf8')

  expect(script).toContain('未检测到已打开的HBuilderX')
  expect(script).toContain('与主程序的连接已中断')
  expect(script).toContain('exit 1')
})
