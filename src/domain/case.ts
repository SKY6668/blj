export type CaseImageLabel = '术前' | '过程' | '术后'

export interface CaseImage {
  id: string
  label: CaseImageLabel
  previewUrl: string
  isDeidentified: boolean
}

export interface CaseRecord {
  id: string
  caseCode: string
  treatmentType: string
  toothPositions: string[]
  treatmentDate: string
  tags: string[]
  summary: string
  images: CaseImage[]
  createdAt: string
  updatedAt: string
}
