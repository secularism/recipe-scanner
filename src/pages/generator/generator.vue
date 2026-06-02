<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { INGREDIENT_GROUPS, SEASONING_GROUPS, CUISINE_LABELS, TASTE_LABELS, GENERATOR_DRAFT_KEY } from '@/data'
import type { Cuisine, Taste, GenerateInput } from '@/types'
import { generateRecipe } from '@/services'

const selectedIngredients = ref<string[]>([])
const selectedSeasonings = ref<string[]>([])
const customIngredients = ref<string[]>([])
const customSeasonings = ref<string[]>([])
const selectedCuisine = ref<Cuisine | null>(null)
const selectedTastes = ref<Taste[]>([])

interface Draft {
  i: string[]; s: string[]; ci: string[]; cs: string[]
  cu: Cuisine | null; t: Taste[]
}

function loadDraft() {
  try {
    const raw = uni.getStorageSync(GENERATOR_DRAFT_KEY) as Draft | null
    if (!raw || typeof raw !== 'object') return
    selectedIngredients.value = Array.isArray(raw.i) ? raw.i : []
    selectedSeasonings.value = Array.isArray(raw.s) ? raw.s : []
    customIngredients.value = Array.isArray(raw.ci) ? raw.ci : []
    customSeasonings.value = Array.isArray(raw.cs) ? raw.cs : []
    selectedCuisine.value = raw.cu ?? null
    selectedTastes.value = Array.isArray(raw.t) ? raw.t : []
  } catch { /* 忽略 */ }
}

function saveDraft() {
  try {
    const draft: Draft = {
      i: selectedIngredients.value,
      s: selectedSeasonings.value,
      ci: customIngredients.value,
      cs: customSeasonings.value,
      cu: selectedCuisine.value,
      t: selectedTastes.value
    }
    uni.setStorageSync(GENERATOR_DRAFT_KEY, draft)
  } catch { /* 忽略 */ }
}

function clearDraft() {
  try { uni.removeStorageSync(GENERATOR_DRAFT_KEY) } catch { /* 忽略 */ }
}

onMounted(loadDraft)
watch([selectedIngredients, selectedSeasonings, customIngredients, customSeasonings, selectedCuisine, selectedTastes],
  saveDraft, { deep: true })

const allIngredients = computed(() => [...selectedIngredients.value, ...customIngredients.value])
const allSeasonings = computed(() => [...selectedSeasonings.value, ...customSeasonings.value])

const canSubmit = computed(() =>
  allIngredients.value.length > 0 || allSeasonings.value.length > 0
)

const cuisineOptions = Object.entries(CUISINE_LABELS).map(([value, label]) => ({ value, label }))
const tasteOptions = Object.entries(TASTE_LABELS).map(([value, label]) => ({ value, label }))

const ingredientTagOptions = computed(() => {
  return INGREDIENT_GROUPS.flatMap(g =>
    g.items.map(i => ({ value: i.name, label: i.name }))
  )
})
const seasoningTagOptions = computed(() => {
  return SEASONING_GROUPS.flatMap(g =>
    g.items.map(s => ({ value: s.name, label: s.name }))
  )
})

function clearAll() {
  selectedIngredients.value = []
  selectedSeasonings.value = []
  customIngredients.value = []
  customSeasonings.value = []
  selectedCuisine.value = null
  selectedTastes.value = []
  clearDraft()
  uni.showToast({ title: '已清空', icon: 'none' })
}

function onSubmit() {
  if (!canSubmit.value) {
    uni.showToast({ title: '至少选一个食材或调味料', icon: 'none' })
    return
  }
  const input: GenerateInput = {
    ingredients: allIngredients.value,
    seasonings: allSeasonings.value,
    cuisine: selectedCuisine.value,
    tastes: selectedTastes.value.length > 0 ? selectedTastes.value : undefined
  }
  const app = getApp()
  if (app?.globalData) {
    app.globalData.pendingInput = input
  }
  uni.navigateTo({ url: '/pages/result/result' })
}
</script>

<template>
  <view class="page">
    <SectionTitle emoji="🥬" title="你有什么食材？" hint="可多选 / 自填" />
    <view class="block">
      <TagSelector
        v-model="selectedIngredients"
        :options="ingredientTagOptions"
        placeholder="点击下方标签选择"
      />
    </view>
    <view class="block">
      <ChipInput v-model="customIngredients" placeholder="比如：外婆的秘制腊肉" />
    </view>

    <SectionTitle emoji="🧂" title="你有什么调味料？" />
    <view class="block">
      <TagSelector
        v-model="selectedSeasonings"
        :options="seasoningTagOptions"
        placeholder="基础调味料也要选哦"
      />
    </view>
    <view class="block">
      <ChipInput v-model="customSeasonings" placeholder="比如：沙茶酱" />
    </view>

    <SectionTitle emoji="🍜" title="想吃哪种菜系？" hint="不选就全部匹配" />
    <view class="block">
      <view class="cuisine-list">
        <view
          v-for="opt in cuisineOptions"
          :key="opt.value"
          class="cuisine-chip"
          :class="{ active: selectedCuisine === opt.value }"
          @tap="selectedCuisine = selectedCuisine === opt.value ? null : (opt.value as Cuisine)"
        >
          <text>{{ opt.label }}</text>
        </view>
      </view>
    </view>

    <SectionTitle emoji="👅" title="想要什么口味？" hint="可多选" />
    <view class="block">
      <view class="taste-list">
        <view
          v-for="opt in tasteOptions"
          :key="opt.value"
          class="taste-chip"
          :class="{ active: selectedTastes.includes(opt.value as Taste) }"
          @tap="
            selectedTastes = selectedTastes.includes(opt.value as Taste)
              ? selectedTastes.filter(t => t !== opt.value)
              : [...selectedTastes, opt.value as Taste]
          "
        >
          <text>{{ opt.label }}</text>
        </view>
      </view>
    </view>

    <view class="footer">
      <view class="btn-secondary" @tap="clearAll">
        <text>清空</text>
      </view>
      <view class="btn-primary" :class="{ disabled: !canSubmit }" @tap="onSubmit">
        <text>开始生成 ✨</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 32rpx 32rpx 200rpx;
}
.block {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: var(--shadow-soft);
}
.cuisine-list, .taste-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.cuisine-chip, .taste-chip {
  padding: 16rpx 32rpx;
  border-radius: var(--radius-pill);
  background: var(--color-secondary);
  color: var(--color-text);
  font-size: 28rpx;
  font-weight: 500;
  &.active {
    background: var(--color-primary);
    color: #fff;
    box-shadow: var(--shadow-soft);
  }
}
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  background: rgba(255, 247, 235, 0.96);
  backdrop-filter: blur(8rpx);
  border-top: 2rpx solid var(--color-border);
  z-index: 10;
}
.btn-secondary, .btn-primary {
  padding: 24rpx 0;
  text-align: center;
  font-size: 30rpx;
  font-weight: 600;
  border-radius: var(--radius-pill);
}
.btn-secondary {
  background: #fff;
  color: var(--color-text);
  border: 2rpx solid var(--color-border);
  width: 180rpx;
}
.btn-primary {
  flex: 1;
  background: var(--color-primary);
  color: #fff;
  box-shadow: var(--shadow-soft);
  &.disabled {
    background: var(--color-border);
    box-shadow: none;
    color: var(--color-text-sub);
  }
}
</style>
