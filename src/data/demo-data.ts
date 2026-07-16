import type { CaseRecord } from '../domain/case'

export const demoCases: CaseRecord[] = [
  {
    id: 'demo-case-001',
    caseCode: 'DEMO-2026-001',
    treatmentType: '前牙树脂美学修复',
    toothPositions: ['11', '21'],
    treatmentDate: '2026-01-18',
    tags: ['美学修复', '前牙', '树脂'],
    summary: '虚构演示病例：针对前牙颜色与形态协调进行分层树脂修复设计。',
    images: [
      {
        id: 'demo-001-before',
        label: '术前',
        previewUrl: '/static/demo/before.svg',
        isDeidentified: true,
      },
      {
        id: 'demo-001-after',
        label: '术后',
        previewUrl: '/static/demo/after.svg',
        isDeidentified: true,
      },
    ],
    createdAt: '2026-01-18T09:30:00.000Z',
    updatedAt: '2026-01-18T11:00:00.000Z',
  },
  {
    id: 'demo-case-002',
    caseCode: 'DEMO-2026-002',
    treatmentType: '单冠修复',
    toothPositions: ['36'],
    treatmentDate: '2026-02-06',
    tags: ['固定修复', '后牙', '全瓷冠'],
    summary: '虚构演示病例：完成后牙单冠修复前的预备、比色与咬合调整记录。',
    images: [
      {
        id: 'demo-002-before',
        label: '术前',
        previewUrl: '/static/demo/before.svg',
        isDeidentified: true,
      },
      {
        id: 'demo-002-process',
        label: '过程',
        previewUrl: '/static/demo/process.svg',
        isDeidentified: true,
      },
      {
        id: 'demo-002-after',
        label: '术后',
        previewUrl: '/static/demo/after.svg',
        isDeidentified: true,
      },
    ],
    createdAt: '2026-02-06T08:50:00.000Z',
    updatedAt: '2026-02-06T10:20:00.000Z',
  },
  {
    id: 'demo-case-003',
    caseCode: 'DEMO-2026-003',
    treatmentType: '种植修复随访',
    toothPositions: ['46'],
    treatmentDate: '2026-03-12',
    tags: ['种植修复', '随访', '后牙'],
    summary: '虚构演示病例：展示种植修复随访中的软组织状态与修复体外观记录。',
    images: [
      {
        id: 'demo-003-before',
        label: '术前',
        previewUrl: '/static/demo/before.svg',
        isDeidentified: true,
      },
      {
        id: 'demo-003-after',
        label: '术后',
        previewUrl: '/static/demo/after.svg',
        isDeidentified: true,
      },
    ],
    createdAt: '2026-03-12T13:10:00.000Z',
    updatedAt: '2026-03-12T14:40:00.000Z',
  },
]
