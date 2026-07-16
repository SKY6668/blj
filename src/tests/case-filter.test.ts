import { filterCases } from '../services/case-filter'
import { demoCases } from '../data/demo-data'
import { expect, test } from 'vitest'

test('关键词可匹配病例编号、治疗类型和标签', () => {
  expect(filterCases(demoCases, { keyword: '002' })).toHaveLength(1)
  expect(filterCases(demoCases, { keyword: '种植' })[0].caseCode).toBe('DEMO-2026-003')
  expect(filterCases(demoCases, { keyword: '全瓷冠' })[0].caseCode).toBe('DEMO-2026-002')
})

test('治疗类型、牙位与标签筛选可叠加', () => {
  expect(
    filterCases(demoCases, {
      treatmentType: '单冠修复',
      toothPosition: '36',
      tag: '后牙',
    }),
  ).toHaveLength(1)

  expect(filterCases(demoCases, { toothPosition: '11', tag: '后牙' })).toHaveLength(0)
})
