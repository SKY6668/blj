import type { CaseRecord } from '../domain/case'

export interface CaseFilter {
  keyword?: string
  treatmentType?: string
  toothPosition?: string
  tag?: string
}

function containsText(value: string, keyword: string): boolean {
  return value.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
}

export function filterCases(caseRecords: CaseRecord[], filter: CaseFilter): CaseRecord[] {
  const keyword = filter.keyword?.trim() ?? ''

  return caseRecords.filter((caseRecord) => {
    const matchesKeyword = !keyword || [
      caseRecord.caseCode,
      caseRecord.treatmentType,
      caseRecord.summary,
      ...caseRecord.tags,
      ...caseRecord.toothPositions,
    ].some((value) => containsText(value, keyword))
    const matchesTreatmentType = !filter.treatmentType || caseRecord.treatmentType === filter.treatmentType
    const matchesToothPosition = !filter.toothPosition || caseRecord.toothPositions.includes(filter.toothPosition)
    const matchesTag = !filter.tag || caseRecord.tags.includes(filter.tag)

    return matchesKeyword && matchesTreatmentType && matchesToothPosition && matchesTag
  })
}
