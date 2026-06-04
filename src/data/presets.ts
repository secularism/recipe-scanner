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
    title: '快手晚餐',
    desc: '15分钟搞定',
    input: {
      ingredients: ['鸡蛋', '米饭', '葱'],
      seasonings: ['盐', '生抽', '食用油']
    }
  },
  {
    id: 'tofu-quick',
    icon: 'fire',
    title: '国民下饭',
    desc: '豆腐+基础调味料',
    input: {
      ingredients: ['豆腐', '葱'],
      seasonings: ['盐', '生抽', '食用油', '姜']
    }
  },
  {
    id: 'tomato-egg',
    icon: 'staff',
    title: '家常小炒',
    desc: '番茄+鸡蛋，经典组合',
    input: {
      ingredients: ['番茄', '鸡蛋', '葱'],
      seasonings: ['盐', '糖', '食用油']
    }
  },
  {
    id: 'cold-dish',
    icon: 'loop',
    title: '随便看看',
    desc: '随机推荐',
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
