import type { Recipe } from '@/types'

/**
 * 西餐 & 日韩 — 异国风味
 */
export const WESTERN_RECIPES: Recipe[] = [
  {
    id: 'scrambled-egg',
    name: '美式炒蛋',
    shortDesc: '滑嫩奶香，早餐三明治好搭档',
    cuisine: 'western',
    taste: ['light', 'salty'],
    cookTime: 8,
    difficulty: 1,
    ingredients: ['鸡蛋', '黄油'],
    seasonings: ['盐', '胡椒粉'],
    steps: [
      { order: 1, text: '鸡蛋加少许盐和牛奶打散' },
      { order: 2, text: '黄油小火融化（不要大火烧焦）' },
      { order: 3, text: '倒入蛋液，用硅胶铲不断推拌' },
      { order: 4, text: '蛋液半凝固时离火，余温会继续熟' },
      { order: 5, text: '撒黑胡椒即可' }
    ],
    tags: ['早餐', '简单']
  },
  {
    id: 'spaghetti-bolognese',
    name: '番茄肉酱意面',
    shortDesc: '经典意式家常，酸甜浓郁',
    cuisine: 'western',
    taste: ['sour', 'sweet', 'salty'],
    cookTime: 30,
    difficulty: 2,
    ingredients: ['面条', '猪肉', '番茄', '洋葱'],
    seasonings: ['番茄酱', '橄榄油', '蒜', '盐', '九层塔', '胡椒粉'],
    steps: [
      { order: 1, text: '意面煮8分钟至al dente' },
      { order: 2, text: '洋葱蒜末用橄榄油爆香' },
      { order: 3, text: '加肉末炒散，加番茄丁炒出汁' },
      { order: 4, text: '加番茄酱、盐、胡椒，小火炖10分钟' },
      { order: 5, text: '意面捞出拌入酱汁，撒九层塔' }
    ],
    tags: ['西餐', '下饭']
  },
  {
    id: 'shrimp-pasta',
    name: '蒜香虾仁意面',
    shortDesc: '简单快手，蒜香黄油味',
    cuisine: 'western',
    taste: ['salty', 'light'],
    cookTime: 20,
    difficulty: 2,
    ingredients: ['面条', '虾', '蒜'],
    seasonings: ['黄油', '橄榄油', '盐', '胡椒粉', '欧芹'],
    steps: [
      { order: 1, text: '意面煮至八成熟' },
      { order: 2, text: '黄油+橄榄油爆香蒜末' },
      { order: 3, text: '下虾仁炒至变红' },
      { order: 4, text: '加意面和少量煮面水翻炒' },
      { order: 5, text: '盐胡椒调味，撒欧芹碎' }
    ],
    tags: ['西餐', '海鲜']
  },
  {
    id: 'korean-bibimbap',
    name: '韩式拌饭',
    shortDesc: '五彩蔬菜+辣酱，一拌就开吃',
    cuisine: 'korean',
    taste: ['spicy', 'salty'],
    cookTime: 20,
    difficulty: 2,
    ingredients: ['米饭', '胡萝卜', '菠菜', '蘑菇', '鸡蛋'],
    seasonings: ['辣椒酱', '生抽', '香油', '蒜', '盐'],
    steps: [
      { order: 1, text: '米饭蒸好，胡萝卜菠菜香菇分别炒熟' },
      { order: 2, text: '煎一个太阳蛋' },
      { order: 3, text: '热米饭上铺蔬菜，蛋放中间' },
      { order: 4, text: '淋韩式辣酱、酱油、香油' },
      { order: 5, text: '拌匀开吃' }
    ],
    tags: ['异国', '方便']
  },
  {
    id: 'japanese-curry',
    name: '日式咖喱饭',
    shortDesc: '浓郁香甜，蔬菜炖肉',
    cuisine: 'japanese',
    taste: ['sweet', 'salty'],
    cookTime: 35,
    difficulty: 2,
    ingredients: ['米饭', '牛肉', '土豆', '胡萝卜', '洋葱'],
    seasonings: ['咖喱块', '食用油', '盐'],
    steps: [
      { order: 1, text: '土豆胡萝卜洋葱切块，牛肉切块' },
      { order: 2, text: '热油炒洋葱至透明，下牛肉翻炒' },
      { order: 3, text: '加土豆胡萝卜翻炒2分钟' },
      { order: 4, text: '加水没过食材，中火炖20分钟' },
      { order: 5, text: '加入咖喱块搅化，小火煮至浓稠，浇在米饭上' }
    ],
    tags: ['异国', '下饭']
  },
  {
    id: 'miso-soup',
    name: '味噌汤',
    shortDesc: '日式经典，5分钟搞定',
    cuisine: 'japanese',
    taste: ['light', 'salty'],
    cookTime: 8,
    difficulty: 1,
    ingredients: ['豆腐', '海带', '葱'],
    seasonings: ['味噌'],
    steps: [
      { order: 1, text: '水开后下豆腐丁和海带煮2分钟' },
      { order: 2, text: '味噌用少量水化开，倒入锅中搅匀（不要沸腾）' },
      { order: 3, text: '撒葱花即可' }
    ],
    tags: ['汤', '简单']
  }
]
