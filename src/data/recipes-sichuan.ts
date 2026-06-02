import type { Recipe } from '@/types'

/**
 * 川菜 & 湘菜 — 重口味，香辣为主
 * 食材/调味料名与 data/ingredients.ts、data/seasonings.ts 的 name 字段一致
 */
export const SICHUAN_HUNAN_RECIPES: Recipe[] = [
  {
    id: 'mapo-tofu',
    name: '麻婆豆腐',
    shortDesc: '麻辣鲜香，川菜代表作，嫩豆腐配肉末',
    cuisine: 'sichuan',
    taste: ['spicy', 'salty'],
    cookTime: 15,
    difficulty: 2,
    ingredients: ['豆腐', '猪肉'],
    seasonings: ['豆瓣酱', '花椒', '生抽', '姜', '蒜', '葱', '食用油'],
    steps: [
      { order: 1, text: '豆腐切丁焯水备用，肉末用料酒腌一下' },
      { order: 2, text: '热油爆香姜蒜末，加豆瓣酱炒出红油' },
      { order: 3, text: '下肉末炒散，加生抽调味' },
      { order: 4, text: '倒入豆腐轻轻翻炒，加少量水焖煮2分钟' },
      { order: 5, text: '勾薄芡，撒花椒粉和葱花即可' }
    ],
    tags: ['下饭', '经典']
  },
  {
    id: 'kung-pao-chicken',
    name: '宫保鸡丁',
    shortDesc: '糊辣荔枝味，鸡丁花生米，川菜经典',
    cuisine: 'sichuan',
    taste: ['spicy', 'sweet', 'salty'],
    cookTime: 20,
    difficulty: 2,
    ingredients: ['鸡肉', '花生米'],
    seasonings: ['干辣椒', '花椒', '醋', '糖', '生抽', '姜', '蒜', '葱'],
    steps: [
      { order: 1, text: '鸡腿肉切丁，用料酒、盐、淀粉腌10分钟' },
      { order: 2, text: '调汁：醋、糖、生抽、淀粉、水按1:1:1比例混合' },
      { order: 3, text: '热油爆香花椒和干辣椒，下鸡丁炒至变色' },
      { order: 4, text: '加姜蒜葱白炒香，倒入调味汁翻炒' },
      { order: 5, text: '最后撒入花生米和葱花，快速翻匀出锅' }
    ],
    tags: ['下饭', '经典']
  },
  {
    id: 'twice-cooked-pork',
    name: '回锅肉',
    shortDesc: '川菜之王，五花肉二次回锅配青蒜',
    cuisine: 'sichuan',
    taste: ['spicy', 'salty'],
    cookTime: 25,
    difficulty: 2,
    ingredients: ['五花肉', '蒜苗', '青椒'],
    seasonings: ['豆瓣酱', '甜面酱', '生抽', '糖', '姜', '蒜'],
    steps: [
      { order: 1, text: '整块五花肉冷水下锅，加姜片煮8成熟，捞出切薄片' },
      { order: 2, text: '热锅不放油，下肉片煸炒出油至微卷' },
      { order: 3, text: '加豆瓣酱、甜面酱炒香上色' },
      { order: 4, text: '下青蒜段和青椒翻炒，加少许糖提鲜' },
      { order: 5, text: '翻炒均匀即可出锅' }
    ],
    tags: ['下饭', '经典']
  },
  {
    id: 'fish-flavored-pork',
    name: '鱼香肉丝',
    shortDesc: '咸甜酸辣，泡椒木耳笋丝，无鱼有鱼味',
    cuisine: 'sichuan',
    taste: ['spicy', 'sweet', 'sour', 'salty'],
    cookTime: 20,
    difficulty: 2,
    ingredients: ['里脊', '胡萝卜', '蘑菇'],
    seasonings: ['豆瓣酱', '醋', '糖', '生抽', '姜', '蒜', '葱'],
    steps: [
      { order: 1, text: '里脊切丝，用盐、料酒、淀粉腌10分钟' },
      { order: 2, text: '调鱼香汁：醋、糖、生抽、淀粉、水按1:1:1:1混合' },
      { order: 3, text: '热油爆香姜蒜末和泡椒，加肉丝滑散' },
      { order: 4, text: '下胡萝卜丝和木耳丝翻炒' },
      { order: 5, text: '倒入鱼香汁快速翻匀，撒葱花出锅' }
    ],
    tags: ['下饭']
  },
  {
    id: 'sichuan-boiled-fish',
    name: '水煮鱼',
    shortDesc: '麻辣鲜烫，鱼片嫩滑配豆芽',
    cuisine: 'sichuan',
    taste: ['spicy', 'salty'],
    cookTime: 30,
    difficulty: 3,
    ingredients: ['鱼', '豆腐', '白菜'],
    seasonings: ['豆瓣酱', '干辣椒', '花椒', '生抽', '姜', '蒜', '葱', '食用油'],
    steps: [
      { order: 1, text: '鱼片用盐、料酒、淀粉、蛋清腌15分钟' },
      { order: 2, text: '豆芽白菜焯水铺底' },
      { order: 3, text: '热油爆香豆瓣酱、姜蒜，加水煮开' },
      { order: 4, text: '下鱼片滑熟，连汤倒入碗中' },
      { order: 5, text: '撒上花椒、干辣椒、蒜末，淋热油激香' }
    ],
    tags: ['硬菜', '聚餐']
  },
  {
    id: 'hunan-steamed-fish-head',
    name: '剁椒鱼头',
    shortDesc: '湘菜代表，剁椒铺满鱼头蒸出鲜辣',
    cuisine: 'hunan',
    taste: ['spicy', 'salty'],
    cookTime: 25,
    difficulty: 2,
    ingredients: ['鱼'],
    seasonings: ['辣椒', '姜', '蒜', '葱', '生抽', '食用油'],
    steps: [
      { order: 1, text: '鱼头剖开，抹盐和料酒腌10分钟' },
      { order: 2, text: '剁椒加姜蒜末拌匀' },
      { order: 3, text: '鱼头摆盘，铺满剁椒混合物' },
      { order: 4, text: '大火蒸12分钟' },
      { order: 5, text: '出锅撒葱花，淋热油激香' }
    ],
    tags: ['硬菜', '蒸菜']
  }
]
