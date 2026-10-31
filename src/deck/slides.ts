import type { ComponentType } from 'react'
import type { Accent } from './primitives'

import Title from '../slides/01-title'
import Goals from '../slides/02-goals'
import Archive from '../slides/03-archive'
import Tension from '../slides/04-tension'
import DividerCycle from '../slides/05-divider-cycle'
import Loop from '../slides/06-loop'
import Retrieve from '../slides/07-retrieve'
import Reuse from '../slides/08-reuse'
import Revise from '../slides/09-revise'
import Retain from '../slides/10-retain'
import DividerMemory from '../slides/11-divider-memory'
import CaseTable from '../slides/12-case-table'
import Index from '../slides/13-index'
import Tree from '../slides/14-tree'
import Machine from '../slides/15-machine'
import Order from '../slides/16-order'
import Similarity from '../slides/17-similarity'
import Adapt from '../slides/18-adapt'
import Compare from '../slides/19-compare'
import TreeLies from '../slides/20-tree-lies'
import Prune from '../slides/21-prune'
import Stale from '../slides/22-stale'
import Limits from '../slides/23-limits'
import Recap from '../slides/24-recap'
import Resources from '../slides/25-resources'

export interface SlideMeta {
  slug: string
  title: string
  section: string
  accent: Accent
  Component: ComponentType
}

export const SLIDES: SlideMeta[] = [
  { slug: 'title', title: 'Case-Based Reasoning for a Smart Navigation & Delivery System', section: 'Opening', accent: 'teal', Component: Title },
  { slug: 'goals', title: 'Goals for today', section: 'Opening', accent: 'teal', Component: Goals },
  { slug: 'archive', title: 'Every route we need has already been driven', section: 'The problem', accent: 'red', Component: Archive },
  { slug: 'tension', title: 'What if the archive were the planner?', section: 'The problem', accent: 'red', Component: Tension },
  { slug: 'divider-cycle', title: '01 · The CBR cycle', section: 'The problem', accent: 'blue', Component: DividerCycle },
  { slug: 'loop', title: 'The loop, once', section: 'The CBR cycle', accent: 'blue', Component: Loop },
  { slug: 'retrieve', title: 'Retrieve = weighted nearest neighbours', section: 'The CBR cycle', accent: 'blue', Component: Retrieve },
  { slug: 'reuse', title: 'Reuse copies the parts that transfer', section: 'The CBR cycle', accent: 'blue', Component: Reuse },
  { slug: 'revise', title: 'Revise tests the answer in the world', section: 'The CBR cycle', accent: 'blue', Component: Revise },
  { slug: 'retain', title: 'Retain turns one delivery into future speed', section: 'The CBR cycle', accent: 'blue', Component: Retain },
  { slug: 'divider-memory', title: '02 · Case memory', section: 'The CBR cycle', accent: 'purple', Component: DividerMemory },
  { slug: 'case-table', title: 'The case table', section: 'Case memory', accent: 'purple', Component: CaseTable },
  { slug: 'index', title: 'Index attributes', section: 'Case memory', accent: 'purple', Component: Index },
  { slug: 'tree', title: 'The discrimination tree', section: 'Case memory', accent: 'purple', Component: Tree },
  { slug: 'machine', title: 'The memory as a machine', section: 'Case memory', accent: 'purple', Component: Machine },
  { slug: 'order', title: 'Worked example: the new order N', section: 'Worked example', accent: 'blue', Component: Order },
  { slug: 'similarity', title: 'Which case is retrieved', section: 'Worked example', accent: 'blue', Component: Similarity },
  { slug: 'adapt', title: 'Revise, then retain', section: 'Worked example', accent: 'blue', Component: Adapt },
  { slug: 'compare', title: 'Two ways to find a case', section: 'Retrieval compared', accent: 'amber', Component: Compare },
  { slug: 'tree-lies', title: 'Where the tree lies to you', section: 'Retrieval compared', accent: 'amber', Component: TreeLies },
  { slug: 'prune', title: 'Prune on purpose', section: 'Maintenance', accent: 'green', Component: Prune },
  { slug: 'stale', title: 'Fight staleness, not size', section: 'Maintenance', accent: 'green', Component: Stale },
  { slug: 'limits', title: 'When CBR is the wrong tool', section: 'Maintenance', accent: 'amber', Component: Limits },
  { slug: 'recap', title: 'Recap', section: 'Close', accent: 'teal', Component: Recap },
  { slug: 'resources', title: 'Resources', section: 'Close', accent: 'teal', Component: Resources },
]

export const TOTAL = SLIDES.length
