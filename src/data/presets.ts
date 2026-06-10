import type { GenerateInput } from '@/types'

/**
 * 快速开始预设 — 一键生成常用组合
 * 数据来自本地，无需存储
 * 食材/调味料名与 data/ingredients.ts、data/seasonings.ts 的 name 字段一致
 * icon 字段对应 uni-icons type
 */
export interface QuickPreset {
  id: string
  icon: string
  title: string
  desc: string
  input: GenerateInput
}

export const QUICK_PRESETS: QuickPreset[] = [
  {
    id: 'egg-rice',
    icon: 'paperplane',
    title: '下班快手菜',
    desc: '十几分钟就出锅',
    input: {
      ingredients: ['鸡蛋', '米饭', '葱'],
      seasonings: ['盐', '生抽', '食用油']
    }
  },
  {
    id: 'tofu-quick',
    icon: 'gear',
    title: '冰箱清库存',
    desc: '有什么做什么',
    input: {
      ingredients: ['豆腐', '葱'],
      seasonings: ['盐', '生抽', '食用油', '姜']
    }
  },
  {
    id: 'tomato-egg',
    icon: 'star',
    title: '一人食简单做',
    desc: '刚刚好不浪费',
    input: {
      ingredients: ['番茄', '鸡蛋', '葱'],
      seasonings: ['盐', '糖', '食用油']
    }
  },
  {
    id: 'cold-dish',
    icon: 'fire',
    title: '今天想吃热乎的',
    desc: '暖暖一碗很满足',
    input: {
      ingredients: ['黄瓜', '蒜'],
      seasonings: ['醋', '生抽', '香油', '盐', '糖']
    }
  }
]

/**
 * 生成器页输入持久化 key
 */
export const GENERATOR_DRAFT_KEY = 'recipe-generator-draft'
export const RECENT_INGREDIENTS_KEY = 'recipe-generator-recent-ingredients'
export const RECENT_SEASONINGS_KEY = 'recipe-generator-recent-seasonings'
