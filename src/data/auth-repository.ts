import type { DemoAccount, DemoSession } from '../domain/auth'
import type { KeyValueStorage } from './storage'

const sessionStorageKey = 'dental-case-library.session'

export const demoAccount: DemoAccount = {
  id: 'demo-doctor-001',
  displayName: '演示医生',
  email: 'demo@dental-case.local',
  password: 'demo-dental-2026',
}

export interface DemoAuthRepository {
  currentSession(): DemoSession | null
  login(email: string, password: string): DemoSession | null
  logout(): void
}

export function createDemoAuthRepository(storage: KeyValueStorage): DemoAuthRepository {
  return {
    currentSession() {
      const savedSession = storage.getItem(sessionStorageKey)
      if (!savedSession) {
        return null
      }

      try {
        const session = JSON.parse(savedSession) as DemoSession
        return session.accountId && session.displayName ? session : null
      } catch {
        storage.removeItem(sessionStorageKey)
        return null
      }
    },
    login(email, password) {
      if (email !== demoAccount.email || password !== demoAccount.password) {
        return null
      }

      const session: DemoSession = {
        accountId: demoAccount.id,
        displayName: demoAccount.displayName,
      }
      storage.setItem(sessionStorageKey, JSON.stringify(session))
      return session
    },
    logout() {
      storage.removeItem(sessionStorageKey)
    },
  }
}
