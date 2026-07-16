export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function getBrowserStorage(): KeyValueStorage {
  const browserGlobal = globalThis as typeof globalThis & { localStorage?: KeyValueStorage }
  if (!browserGlobal.localStorage) {
    throw new Error('当前环境不支持本地存储。')
  }

  return browserGlobal.localStorage
}
