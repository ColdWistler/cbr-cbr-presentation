import type { ComponentType } from 'react'
import type { Accent } from './primitives'

import Title from '../slides/01-title'
import Problem from '../slides/02-problem'
import Cycle from '../slides/03-cycle'
import Memory from '../slides/04-memory'
import Worked from '../slides/05-worked'
import Retrieval from '../slides/06-retrieval'
import Maintenance from '../slides/07-maintenance'
import Recap from '../slides/08-recap'

export interface SlideMeta {
  slug: string
  title: string
  section: string
  accent: Accent
  Component: ComponentType
}

export const SLIDES: SlideMeta[] = [
  { slug: 'title', title: 'Case-Based Reasoning for a Smart Navigation & Delivery System', section: 'Opening', accent: 'teal', Component: Title },
  { slug: 'problem', title: 'Every route we need has already been driven', section: 'The problem', accent: 'red', Component: Problem },
  { slug: 'cycle', title: 'The 4-R loop in delivery terms', section: 'The CBR cycle', accent: 'blue', Component: Cycle },
  { slug: 'memory', title: 'The table + the discrimination tree', section: 'Case memory', accent: 'purple', Component: Memory },
  { slug: 'worked', title: 'Order N at 08:12 — end to end', section: 'Worked example', accent: 'blue', Component: Worked },
  { slug: 'retrieval', title: 'Table vs Tree vs Hybrid', section: 'Retrieval compared', accent: 'amber', Component: Retrieval },
  { slug: 'maintenance', title: 'Prune on purpose + Fight staleness', section: 'Maintenance', accent: 'green', Component: Maintenance },
  { slug: 'recap', title: 'Recap', section: 'Close', accent: 'teal', Component: Recap },
]

export const TOTAL = SLIDES.length