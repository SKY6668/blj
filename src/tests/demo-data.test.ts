import { demoCases } from '../data/demo-data'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'

test('演示病例均为可展示的匿名病例', () => {
  expect(demoCases.length).toBeGreaterThanOrEqual(3)

  for (const caseRecord of demoCases) {
    expect(caseRecord.caseCode).toMatch(/^DEMO-\d{4}-\d{3}$/)
    expect(caseRecord.treatmentType).not.toBe('')
    expect(caseRecord.toothPositions.length).toBeGreaterThan(0)
    expect(caseRecord.tags.length).toBeGreaterThan(0)
    expect(caseRecord.summary).not.toBe('')
    expect(caseRecord.images.length).toBeGreaterThan(0)
    expect(caseRecord.images.every((image) => image.isDeidentified)).toBe(true)
    expect('patientName' in caseRecord).toBe(false)

    for (const image of caseRecord.images) {
      expect(image.previewUrl).toMatch(/^\/static\/demo\/.+\.svg$/)
      expect(existsSync(resolve(process.cwd(), image.previewUrl.slice(1)))).toBe(true)
    }
  }
})
