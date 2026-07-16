import { expect, test } from 'vitest'
import { validateCaseDraft, type CaseDraft } from '../services/case-validation'

const completeDraft: CaseDraft = {
  caseCode: 'DEMO-2026-004', treatmentType: '牙体修复', toothPositions: ['15'],
  treatmentDate: '2026-07-16', tags: [], summary: '虚构匿名病例。', images: [], deidentifiedConfirmed: true,
}

test('缺少必填病例字段或脱敏确认时返回字段错误', () => {
  expect(validateCaseDraft({ ...completeDraft, caseCode: '' }).caseCode).toBeTruthy()
  expect(validateCaseDraft({ ...completeDraft, treatmentType: '' }).treatmentType).toBeTruthy()
  expect(validateCaseDraft({ ...completeDraft, toothPositions: [] }).toothPositions).toBeTruthy()
  expect(validateCaseDraft({ ...completeDraft, deidentifiedConfirmed: false }).deidentifiedConfirmed).toBeTruthy()
})

test('完整草稿不返回错误', () => {
  expect(validateCaseDraft(completeDraft)).toEqual({})
})

test('表单组件和编辑页存在，且编辑页通过仓库保存病例', async () => {
  const { existsSync, readFileSync } = await import('node:fs')
  const { resolve } = await import('node:path')
  const root = process.cwd()
  const page = readFileSync(resolve(root, 'pages/case-edit/index.uvue'), 'utf8')

  expect(existsSync(resolve(root, 'src/components/case-form.uvue'))).toBe(true)
  expect(page).toContain('createLocalCaseRepository')
  expect(page).toContain('validateCaseDraft')
})
