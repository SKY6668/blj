import type { CaseRecord } from '../domain/case'
import { demoCases } from './demo-data'
import type { KeyValueStorage } from './storage'

const caseStorageKey = 'dental-case-library.cases'

export interface CaseRepository {
  list(): CaseRecord[]
  getById(id: string): CaseRecord | null
  save(caseRecord: CaseRecord): CaseRecord
  remove(id: string): void
}

function cloneCases(caseRecords: CaseRecord[]): CaseRecord[] {
  return JSON.parse(JSON.stringify(caseRecords)) as CaseRecord[]
}

function readCases(storage: KeyValueStorage): CaseRecord[] {
  const savedCases = storage.getItem(caseStorageKey)

  if (!savedCases) {
    const initialCases = cloneCases(demoCases)
    storage.setItem(caseStorageKey, JSON.stringify(initialCases))
    return initialCases
  }

  try {
    const parsedCases = JSON.parse(savedCases) as CaseRecord[]
    return Array.isArray(parsedCases) ? parsedCases : cloneCases(demoCases)
  } catch {
    const initialCases = cloneCases(demoCases)
    storage.setItem(caseStorageKey, JSON.stringify(initialCases))
    return initialCases
  }
}

export function createLocalCaseRepository(storage: KeyValueStorage): CaseRepository {
  return {
    list() {
      return cloneCases(readCases(storage))
    },
    getById(id) {
      const caseRecord = readCases(storage).find((item) => item.id === id)
      return caseRecord ? cloneCases([caseRecord])[0] : null
    },
    save(caseRecord) {
      const caseRecords = readCases(storage)
      const updatedCases = caseRecords.some((item) => item.id === caseRecord.id)
        ? caseRecords.map((item) => (item.id === caseRecord.id ? cloneCases([caseRecord])[0] : item))
        : [...caseRecords, cloneCases([caseRecord])[0]]

      storage.setItem(caseStorageKey, JSON.stringify(updatedCases))
      return cloneCases([caseRecord])[0]
    },
    remove(id) {
      const remainingCases = readCases(storage).filter((item) => item.id !== id)
      storage.setItem(caseStorageKey, JSON.stringify(remainingCases))
    },
  }
}
