import type { Seasoning } from '@/types'

/**
 * 常用调味料库
 */
export const COMMON_SEASONINGS: Seasoning[] = [
  // 基础
  { id: 'salt', name: '盐', type: 'basic' },
  { id: 'sugar', name: '糖', type: 'basic' },
  { id: 'msg', name: '味精', type: 'basic' },
  { id: 'pepper-powder', name: '胡椒粉', type: 'basic' },

  // 酱料
  { id: 'soy-sauce', name: '生抽', type: 'sauce' },
  { id: 'dark-soy', name: '老抽', type: 'sauce' },
  { id: 'oyster-sauce', name: '蚝油', type: 'sauce' },
  { id: 'vinegar', name: '醋', type: 'sauce' },
  { id: 'rice-vinegar', name: '米醋', type: 'sauce' },
  { id: 'bean-paste', name: '豆瓣酱', type: 'sauce' },
  { id: 'sweet-bean', name: '甜面酱', type: 'sauce' },
  { id: 'ketchup', name: '番茄酱', type: 'sauce' },
  { id: 'hoisin', name: '海鲜酱', type: 'sauce' },
  { id: 'sriracha', name: '辣椒酱', type: 'sauce' },

  // 香料
  { id: 'ginger', name: '姜', type: 'spice' },
  { id: 'garlic', name: '蒜', type: 'spice' },
  { id: 'scallion', name: '葱', type: 'spice' },
  { id: 'cilantro', name: '香菜', type: 'spice' },
  { id: 'basil', name: '九层塔', type: 'spice' },
  { id: 'cumin', name: '孜然', type: 'spice' },
  { id: 'star-anise', name: '八角', type: 'spice' },
  { id: 'bay-leaf', name: '香叶', type: 'spice' },
  { id: 'sichuan-pepper', name: '花椒', type: 'spice' },
  { id: 'dried-chili', name: '干辣椒', type: 'spice' },

  // 油
  { id: 'oil', name: '食用油', type: 'oil' },
  { id: 'sesame-oil', name: '香油', type: 'oil' },
  { id: 'chili-oil', name: '辣椒油', type: 'oil' },
  { id: 'butter', name: '黄油', type: 'oil' },
  { id: 'olive-oil', name: '橄榄油', type: 'oil' }
]

/**
 * 按类型分组
 */
export const SEASONING_GROUPS: Array<{ label: string; key: Seasoning['type']; items: Seasoning[] }> = [
  { label: '基础', key: 'basic', items: COMMON_SEASONINGS.filter(s => s.type === 'basic') },
  { label: '酱料', key: 'sauce', items: COMMON_SEASONINGS.filter(s => s.type === 'sauce') },
  { label: '香料', key: 'spice', items: COMMON_SEASONINGS.filter(s => s.type === 'spice') },
  { label: '油类', key: 'oil', items: COMMON_SEASONINGS.filter(s => s.type === 'oil') }
]
