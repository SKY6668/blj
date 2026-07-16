import { createLocalCaseRepository } from '../data/case-repository'
import type { KeyValueStorage } from '../data/storage'
import { expect, test } from 'vitest'

function createMemoryStorage(): KeyValueStorage {
  const values = new Map<string, string>()

  return {
    getItem(key) {
      return values.get(key) ?? null
    },
    removeItem(key) {
      values.delete(key)
    },
    setItem(key, value) {
      values.set(key, value)
    },
  }
}

test('首次读取会初始化匿名演示病例', () => {
  const repository = createLocalCaseRepository(createMemoryStorage())

  expect(repository.list()).toHaveLength(3)
  expect(repository.list().every((caseRecord) => caseRecord.caseCode.startsWith('DEMO-'))).toBe(true)
})

test('保存的病例可由新的仓库实例恢复', () => {
  const storage = createMemoryStorage()
  const repository = createLocalCaseRepository(storage)
  const caseRecord = repository.list()[0]

  repository.save({
    ...caseRecord,
    summary: '已更新的匿名演示说明。',
  })

  const restoredRepository = createLocalCaseRepository(storage)
  expect(restoredRepository.getById(caseRecord.id)?.summary).toBe('已更新的匿名演示说明。')
})
