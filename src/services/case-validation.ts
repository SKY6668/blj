import type { CaseImage } from '../domain/case'

export interface CaseDraft {
  caseCode: string
  treatmentType: string
  toothPositions: string[]
  treatmentDate: string
  tags: string[]
  summary: string
  images: CaseImage[]
  deidentifiedConfirmed: boolean
}

export type ValidationErrors = Partial<Record<keyof CaseDraft, string>>

export function validateCaseDraft(draft: CaseDraft): ValidationErrors {
  const errors: ValidationErrors = {}
  if (!draft.caseCode.trim()) errors.caseCode = '请填写匿名病例编号。'
  if (!draft.treatmentType.trim()) errors.treatmentType = '请填写治疗类型。'
  if (!draft.toothPositions.length) errors.toothPositions = '请至少填写一个牙位。'
  if (!draft.deidentifiedConfirmed) errors.deidentifiedConfirmed = '保存前请确认病例已脱敏。'
  return errors
}
