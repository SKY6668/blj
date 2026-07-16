import { createDemoAuthRepository, demoAccount } from '../data/auth-repository'
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

test('演示账号登录后仅持久化非敏感会话信息', () => {
  const storage = createMemoryStorage()
  const repository = createDemoAuthRepository(storage)

  expect(repository.login(demoAccount.email, demoAccount.password)).toEqual({
    accountId: demoAccount.id,
    displayName: demoAccount.displayName,
  })
  expect(storage.getItem('dental-case-library.session')).not.toContain(demoAccount.password)
})

test('错误密码不会创建会话，退出后会清空会话', () => {
  const repository = createDemoAuthRepository(createMemoryStorage())

  expect(repository.login(demoAccount.email, 'wrong-password')).toBeNull()
  expect(repository.currentSession()).toBeNull()

  repository.login(demoAccount.email, demoAccount.password)
  repository.logout()
  expect(repository.currentSession()).toBeNull()
})

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
