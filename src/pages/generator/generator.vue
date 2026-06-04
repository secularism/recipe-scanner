<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { INGREDIENT_GROUPS, SEASONING_GROUPS, CUISINE_LABELS, TASTE_LABELS, GENERATOR_DRAFT_KEY } from '@/data'
import type { Cuisine, Taste, GenerateInput } from '@/types'
import SectionTitle from '@/components/SectionTitle.vue'
import TagSelector from '@/components/TagSelector.vue'
import ChipInput from '@/components/ChipInput.vue'

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
    uni.setStorageSync(GENERATOR_DRAFT_KEY, {
      i: selectedIngredients.value, s: selectedSeasonings.value,
      ci: customIngredients.value, cs: customSeasonings.value,
      cu: selectedCuisine.value, t: selectedTastes.value
    })
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
const canSubmit = computed(() => allIngredients.value.length > 0 || allSeasonings.value.length > 0)

const cuisineOptions = Object.entries(CUISINE_LABELS).map(([v, l]) => ({ value: v, label: l }))
const tasteOptions = Object.entries(TASTE_LABELS).map(([v, l]) => ({ value: v, label: l }))
const ingredientTagOptions = computed(() =>
  INGREDIENT_GROUPS.flatMap(g => g.items.map(i => ({ value: i.name, label: i.name })))
)
const seasoningTagOptions = computed(() =>
  SEASONING_GROUPS.flatMap(g => g.items.map(s => ({ value: s.name, label: s.name })))
)

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
  if (app?.globalData) app.globalData.pendingInput = input
  uni.navigateTo({ url: '/pages/result/result' })
}

function toggleCuisine(v: string) {
  selectedCuisine.value = selectedCuisine.value === v ? null : (v as Cuisine)
}
function toggleTaste(v: string) {
  const tv = v as Taste
  selectedTastes.value = selectedTastes.value.includes(tv)
    ? selectedTastes.value.filter(t => t !== tv)
    : [...selectedTastes.value, tv]
}
</script>

<template>
  <view class="page">
    <view class="section">
      <SectionTitle icon="list" title="你有什么食材" />
      <TagSelector v-model="selectedIngredients" :options="ingredientTagOptions" />
      <view class="custom-row">
        <ChipInput v-model="customIngredients" placeholder="写下你自己的" />
      </view>
    </view>

    <view class="section">
      <SectionTitle icon="gear" title="你有什么调味料" />
      <TagSelector v-model="selectedSeasonings" :options="seasoningTagOptions" />
      <view class="custom-row">
        <ChipInput v-model="customSeasonings" placeholder="添加你的调味料" />
      </view>
    </view>

    <view class="section">
      <SectionTitle icon="map" title="想吃哪个菜系" />
      <view class="chip-row">
        <view
          v-for="opt in cuisineOptions"
          :key="opt.value"
          class="chip"
          :class="{ selected: selectedCuisine === opt.value }"
          @tap="toggleCuisine(opt.value)"
        >
          <text>{{ opt.label }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <SectionTitle icon="fire" title="想要什么口味" />
      <view class="chip-row">
        <view
          v-for="opt in tasteOptions"
          :key="opt.value"
          class="chip"
          :class="{ selected: selectedTastes.includes(opt.value as Taste) }"
          @tap="toggleTaste(opt.value)"
        >
          <text>{{ opt.label }}</text>
        </view>
      </view>
    </view>

    <view class="bottom-cta">
      <view class="btn-generate" :class="{ disabled: !canSubmit }" @tap="onSubmit">
        <uni-icons type="paperplane" color="#fff" size="17" />
        <text>看看能做啥</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: var(--gradient-bg);
  padding-bottom: 200rpx;
}
.section {
  padding: 28rpx 32rpx;
  border-bottom: 2rpx dashed var(--color-border);
}
.custom-row { margin-top: 16rpx; }
.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.chip {
  padding: 14rpx 28rpx;
  border-radius: var(--radius-pill);
  font-size: 26rpx;
  font-weight: 500;
  border: 2rpx solid var(--color-primary-light);
  background: var(--color-bg-card);
  color: var(--color-text);
}
.chip:active { transform: scale(0.96); }
.chip.selected {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
.bottom-cta {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24rpx 32rpx 32rpx;
  background: var(--gradient-bg);
  z-index: 10;
}
.btn-generate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  width: 100%;
  padding: 26rpx 0;
  background: var(--gradient-cta);
  color: #fff;
  border: none;
  border-radius: 32rpx;
  font-size: 30rpx;
  font-weight: 600;
  box-shadow: var(--shadow-cta);
}
.btn-generate:active { transform: scale(0.98); }
.btn-generate.disabled { opacity: 0.5; }
</style>
