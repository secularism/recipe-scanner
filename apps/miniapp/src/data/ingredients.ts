import type { Ingredient } from '@/types'

/**
 * 常用食材库 - 按类别分组
 * 用户在生成页可多选
 */
export const COMMON_INGREDIENTS: Ingredient[] = [
  // 肉类
  { id: 'pork', name: '猪肉', category: 'meat' },
  { id: 'pork-belly', name: '五花肉', category: 'meat' },
  { id: 'pork-tenderloin', name: '里脊', category: 'meat' },
  { id: 'beef', name: '牛肉', category: 'meat' },
  { id: 'chicken', name: '鸡肉', category: 'meat' },
  { id: 'chicken-leg', name: '鸡腿', category: 'meat' },
  { id: 'chicken-wing', name: '鸡翅', category: 'meat' },
  { id: 'duck', name: '鸭肉', category: 'meat' },
  { id: 'lamb', name: '羊肉', category: 'meat' },
  { id: 'ribs', name: '排骨', category: 'meat' },

  // 海鲜
  { id: 'shrimp', name: '虾', category: 'seafood' },
  { id: 'fish', name: '鱼', category: 'seafood' },
  { id: 'squid', name: '鱿鱼', category: 'seafood' },
  { id: 'crab', name: '蟹', category: 'seafood' },
  { id: 'clam', name: '蛤蜊', category: 'seafood' },
  { id: 'scallop', name: '扇贝', category: 'seafood' },

  // 蔬菜
  { id: 'tomato', name: '番茄', category: 'veg' },
  { id: 'potato', name: '土豆', category: 'veg' },
  { id: 'carrot', name: '胡萝卜', category: 'veg' },
  { id: 'cabbage', name: '白菜', category: 'veg' },
  { id: 'lettuce', name: '生菜', category: 'veg' },
  { id: 'cucumber', name: '黄瓜', category: 'veg' },
  { id: 'eggplant', name: '茄子', category: 'veg' },
  { id: 'tofu', name: '豆腐', category: 'veg' },
  { id: 'spinach', name: '菠菜', category: 'veg' },
  { id: 'broccoli', name: '西兰花', category: 'veg' },
  { id: 'mushroom', name: '蘑菇', category: 'veg' },
  { id: 'shiitake', name: '香菇', category: 'veg' },
  { id: 'green-bean', name: '四季豆', category: 'veg' },
  { id: 'pepper', name: '青椒', category: 'veg' },
  { id: 'chili', name: '辣椒', category: 'veg' },
  { id: 'onion', name: '洋葱', category: 'veg' },
  { id: 'garlic-sprout', name: '蒜苗', category: 'veg' },
  { id: 'celery', name: '芹菜', category: 'veg' },
  { id: 'corn', name: '玉米', category: 'veg' },

  // 主食/蛋奶
  { id: 'egg', name: '鸡蛋', category: 'staple' },
  { id: 'rice', name: '米饭', category: 'staple' },
  { id: 'noodle', name: '面条', category: 'staple' },
  { id: 'flour', name: '面粉', category: 'staple' },
  { id: 'milk', name: '牛奶', category: 'dairy' }
]

/**
 * 按类别分组
 */
export const INGREDIENT_GROUPS: Array<{ label: string; key: Ingredient['category']; items: Ingredient[] }> = [
  { label: '肉蛋', key: 'meat', items: COMMON_INGREDIENTS.filter(i => i.category === 'meat' || i.id === 'egg') },
  { label: '海鲜', key: 'seafood', items: COMMON_INGREDIENTS.filter(i => i.category === 'seafood') },
  { label: '蔬菜', key: 'veg', items: COMMON_INGREDIENTS.filter(i => i.category === 'veg') },
  { label: '主食', key: 'staple', items: COMMON_INGREDIENTS.filter(i => i.category === 'staple' && i.id !== 'egg') },
  { label: '其他', key: 'other', items: COMMON_INGREDIENTS.filter(i => i.category === 'dairy' || i.category === 'other') }
]
