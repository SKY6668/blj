export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function getBrowserStorage(): KeyValueStorage {
  if (typeof globalThis.localStorage === 'undefined') {
    throw new Error('当前环境不支持本地存储。')
  }

  return globalThis.localStorage
}
