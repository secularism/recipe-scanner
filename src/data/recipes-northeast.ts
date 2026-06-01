import type { Recipe } from '@/types'

/**
 * 东北 & 汤羹 & 主食 — 朴实分量足
 */
export const NOURTHERN_SOUP_RECIPES: Recipe[] = [
  {
    id: 'northeast-stewed-pork',
    name: '东北乱炖',
    shortDesc: '一锅炖所有，朴实豪迈',
    cuisine: 'northeast',
    taste: ['salty'],
    cookTime: 40,
    difficulty: 1,
    ingredients: ['pork', 'potato', 'eggplant', 'green-bean', 'tomato'],
    seasonings: ['soy-sauce', 'ginger', 'garlic', 'scallion', 'oil'],
    steps: [
      { order: 1, text: '所有食材切块，五花肉煸出油' },
      { order: 2, text: '加姜蒜爆香，下豆角土豆翻炒' },
      { order: 3, text: '加生抽和水，没过食材' },
      { order: 4, text: '炖15分钟加茄子番茄再炖10分钟' },
      { order: 5, text: '大火收汁，撒葱花' }
    ],
    tags: ['家常', '方便']
  },
  {
    id: 'pickled-cabbage-pork',
    name: '酸菜炖白肉',
    shortDesc: '东北招牌，酸香不腻',
    cuisine: 'northeast',
    taste: ['sour', 'salty'],
    cookTime: 45,
    difficulty: 2,
    ingredients: ['pickled-cabbage' as any, 'pork-belly'],
    seasonings: ['ginger', 'scallion', 'salt'],
    steps: [
      { order: 1, text: '五花肉整块煮20分钟切薄片' },
      { order: 2, text: '酸菜切丝洗净攥干' },
      { order: 3, text: '锅中放肉片煸出油' },
      { order: 4, text: '下酸菜翻炒，加肉汤炖20分钟' },
      { order: 5, text: '加盐调味即可' }
    ],
    tags: ['东北', '下饭']
  },
  {
    id: 'tomato-egg-soup',
    name: '番茄蛋汤',
    shortDesc: '酸甜开胃，5分钟上桌',
    cuisine: 'home',
    taste: ['sour', 'sweet', 'light'],
    cookTime: 8,
    difficulty: 1,
    ingredients: ['tomato', 'egg', 'scallion'],
    seasonings: ['salt', 'sesame-oil'],
    steps: [
      { order: 1, text: '番茄切块，鸡蛋打散' },
      { order: 2, text: '热油炒番茄出汁' },
      { order: 3, text: '加水煮开，淋蛋液成蛋花' },
      { order: 4, text: '盐调味，淋香油撒葱花' }
    ],
    tags: ['汤', '简单', '新手']
  },
  {
    id: 'winter-melon-soup',
    name: '冬瓜虾米汤',
    shortDesc: '清淡鲜美，夏日去火',
    cuisine: 'home',
    taste: ['light', 'salty'],
    cookTime: 15,
    difficulty: 1,
    ingredients: ['winter-melon' as any, 'shrimp'],
    seasonings: ['ginger', 'salt', 'sesame-oil', 'scallion'],
    steps: [
      { order: 1, text: '冬瓜去皮切薄片' },
      { order: 2, text: '锅中加水下冬瓜和姜片煮开' },
      { order: 3, text: '下虾米煮5分钟' },
      { order: 4, text: '盐调味，淋香油撒葱花' }
    ],
    tags: ['汤', '简单']
  },
  {
    id: 'egg-fried-rice',
    name: '蛋炒饭',
    shortDesc: '粒粒分明，剩饭救星',
    cuisine: 'home',
    taste: ['salty'],
    cookTime: 10,
    difficulty: 1,
    ingredients: ['rice', 'egg', 'scallion', 'carrot'],
    seasonings: ['soy-sauce', 'salt', 'oil'],
    steps: [
      { order: 1, text: '隔夜饭打散，蛋液拌入饭中' },
      { order: 2, text: '热油爆香葱花，下胡萝卜丁炒软' },
      { order: 3, text: '下米饭大火快炒，饭粒分明' },
      { order: 4, text: '加盐和少许生抽调味' }
    ],
    tags: ['主食', '简单', '新手']
  },
  {
    id: 'lemon-shrimp',
    name: '柠檬虾',
    shortDesc: '酸甜清新，零失败',
    cuisine: 'western',
    taste: ['sour', 'sweet'],
    cookTime: 15,
    difficulty: 2,
    ingredients: ['shrimp'],
    seasonings: ['butter', 'garlic', 'lemon' as any, 'salt', 'parsley'],
    steps: [
      { order: 1, text: '虾去虾线，开背' },
      { order: 2, text: '黄油爆香蒜末，下虾煎至两面红' },
      { order: 3, text: '挤入柠檬汁，加盐调味' },
      { order: 4, text: '翻匀撒欧芹碎' }
    ],
    tags: ['海鲜', '简单']
  },
  {
    id: 'honey-glazed-chicken-wing',
    name: '蜜汁鸡翅',
    shortDesc: '甜香入味，老少皆宜',
    cuisine: 'home',
    taste: ['sweet', 'salty'],
    cookTime: 25,
    difficulty: 2,
    ingredients: ['chicken-wing'],
    seasonings: ['soy-sauce', 'sugar', 'honey' as any, 'ginger', 'garlic', 'scallion'],
    steps: [
      { order: 1, text: '鸡翅两面划几刀，加生抽糖姜蒜腌20分钟' },
      { order: 2, text: '热锅少油，鸡翅煎至两面金黄' },
      { order: 3, text: '倒入腌料和少量水，中火焖10分钟' },
      { order: 4, text: '大火收汁至浓稠，淋蜂蜜翻匀' }
    ],
    tags: ['聚餐', '下饭']
  }
]
