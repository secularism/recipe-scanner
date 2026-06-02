import type { Recipe } from '@/types'

/**
 * 粤菜 & 家常 — 清淡鲜美
 */
export const CANTONESE_HOME_RECIPES: Recipe[] = [
  {
    id: 'cantonese-steamed-egg',
    name: '广式蒸蛋',
    shortDesc: '嫩滑如布丁，粤式早茶经典',
    cuisine: 'cantonese',
    taste: ['light', 'salty'],
    cookTime: 15,
    difficulty: 1,
    ingredients: ['鸡蛋'],
    seasonings: ['盐', '生抽', '香油', '葱'],
    steps: [
      { order: 1, text: '鸡蛋打散，加1.5倍温水搅匀' },
      { order: 2, text: '过筛去掉气泡，撇去浮沫' },
      { order: 3, text: '盖上保鲜膜或盘子，水开后中火蒸10分钟' },
      { order: 4, text: '出锅淋生抽、香油，撒葱花' }
    ],
    tags: ['简单', '早餐']
  },
  {
    id: 'cantonese-white-cut-chicken',
    name: '白切鸡',
    shortDesc: '皮爽肉滑，姜葱蘸料是灵魂',
    cuisine: 'cantonese',
    taste: ['light', 'salty'],
    cookTime: 30,
    difficulty: 2,
    ingredients: ['鸡肉'],
    seasonings: ['姜', '葱', '盐', '香油', '生抽'],
    steps: [
      { order: 1, text: '整鸡洗净，冷水下锅加姜片煮开' },
      { order: 2, text: '水开后关火焖30分钟（核心步骤）' },
      { order: 3, text: '捞出立刻过冰水，表皮会紧致Q弹' },
      { order: 4, text: '剁块摆盘，姜葱蓉用热油激香加盐做蘸料' }
    ],
    tags: ['硬菜', '待客']
  },
  {
    id: 'tomato-egg-stir-fry',
    name: '番茄炒蛋',
    shortDesc: '国民下饭菜，酸甜开胃',
    cuisine: 'home',
    taste: ['sweet', 'sour'],
    cookTime: 10,
    difficulty: 1,
    ingredients: ['番茄', '鸡蛋'],
    seasonings: ['盐', '糖', '葱'],
    steps: [
      { order: 1, text: '鸡蛋打散加少许盐，番茄切块' },
      { order: 2, text: '热油炒蛋至凝固盛出' },
      { order: 3, text: '余油炒番茄出汁，加糖和盐' },
      { order: 4, text: '倒回鸡蛋翻匀，撒葱花出锅' }
    ],
    tags: ['简单', '下饭', '新手']
  },
  {
    id: 'stir-fry-potato',
    name: '酸辣土豆丝',
    shortDesc: '爽脆开胃，刀工和火候是关键',
    cuisine: 'home',
    taste: ['sour', 'spicy'],
    cookTime: 10,
    difficulty: 1,
    ingredients: ['土豆', '辣椒'],
    seasonings: ['醋', '盐', '生抽', '蒜', '食用油'],
    steps: [
      { order: 1, text: '土豆切细丝泡水洗去淀粉' },
      { order: 2, text: '热油爆香蒜末和干辣椒' },
      { order: 3, text: '下土豆丝大火快炒' },
      { order: 4, text: '沿锅边淋醋，加盐调味出锅' }
    ],
    tags: ['简单', '下饭']
  },
  {
    id: 'braised-pork-ribs',
    name: '红烧排骨',
    shortDesc: '色泽红亮，肉质软烂入味',
    cuisine: 'home',
    taste: ['salty', 'sweet'],
    cookTime: 45,
    difficulty: 2,
    ingredients: ['排骨'],
    seasonings: ['生抽', '老抽', '糖', '姜', '葱', '八角', '食用油'],
    steps: [
      { order: 1, text: '排骨冷水下锅焯水去血沫' },
      { order: 2, text: '锅中放油加糖炒糖色（关键步骤）' },
      { order: 3, text: '下排骨翻炒上色，加生抽老抽' },
      { order: 4, text: '加水没过排骨，加姜葱八角' },
      { order: 5, text: '小火炖40分钟，大火收汁' }
    ],
    tags: ['硬菜', '下饭']
  },
  {
    id: 'cucumber-salad',
    name: '拍黄瓜',
    shortDesc: '夏日必备，爽脆开胃',
    cuisine: 'home',
    taste: ['sour', 'salty', 'light'],
    cookTime: 5,
    difficulty: 1,
    ingredients: ['黄瓜', '蒜'],
    seasonings: ['醋', '生抽', '香油', '盐', '糖', '辣椒油', '香菜'],
    steps: [
      { order: 1, text: '黄瓜洗净用刀背拍裂切段' },
      { order: 2, text: '蒜末加醋、生抽、香油、糖、盐调汁' },
      { order: 3, text: '淋在黄瓜上拌匀，可加辣椒油' }
    ],
    tags: ['简单', '凉菜', '新手']
  },
  {
    id: 'eggplant-garlic',
    name: '蒜蓉茄子',
    shortDesc: '蒜香浓郁，绵软入味',
    cuisine: 'home',
    taste: ['salty', 'light'],
    cookTime: 20,
    difficulty: 1,
    ingredients: ['茄子', '蒜'],
    seasonings: ['生抽', '醋', '糖', '香油', '葱', '食用油'],
    steps: [
      { order: 1, text: '茄子切条上锅蒸10分钟至软' },
      { order: 2, text: '蒜末加生抽、醋、糖、香油调成汁' },
      { order: 3, text: '茄子出锅沥水，淋上料汁拌匀' },
      { order: 4, text: '撒葱花即可' }
    ],
    tags: ['简单', '下饭']
  }
]
