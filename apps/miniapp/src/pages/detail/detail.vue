<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GenerateInput, Recipe } from '@/types'
import { CUISINE_LABELS, DIFFICULTY_LABELS, TASTE_LABELS } from '@/data'
import { recipesApi } from '@/services'
import { useFavoritesStore } from '@/stores/favorites'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import EmptyState from '@/components/EmptyState.vue'
import SectionTitle from '@/components/SectionTitle.vue'

interface PendingDetail { input: GenerateInput; coverage: number }

const favStore = useFavoritesStore()
const recipe = ref<Recipe | null>(null)
const userInput = ref<GenerateInput | null>(null)
const coverage = ref<number | null>(null)
const fromShare = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const recipeId = ref('')

onLoad((q) => {
  recipeId.value = (q?.id as string) || ''
  fromShare.value = q?.from === 'share'
  favStore.load()
  takePendingDetailInput()
  void loadRecipe()
})

async function loadRecipe() {
  if (!recipeId.value) {
    recipe.value = null
    errorMessage.value = '没有找到菜谱编号'
    return
  }
  loading.value = true
  errorMessage.value = ''
  try {
    recipe.value = await recipesApi.fetchRecipeById(recipeId.value)
    if (fromShare.value) uni.showToast({ title: '好友分享的菜谱', icon: 'none' })
  } catch {
    recipe.value = null
    errorMessage.value = '暂时加载不到这道菜谱，请稍后重试'
  } finally {
    loading.value = false
  }
}

function takePendingDetailInput() {
  const app = getApp()
  const pending = app?.globalData?.pendingDetailInput as PendingDetail | undefined
  if (!pending) return
  if (isResultPageEntry()) {
    userInput.value = pending.input
    coverage.value = pending.coverage
  }
  if (app?.globalData) app.globalData.pendingDetailInput = null
}

function isResultPageEntry() {
  const pages = getCurrentPages()
  const previous = pages[pages.length - 2] as { route?: string } | undefined
  return previous?.route === 'pages/result/result'
}

const isFav = computed(() => recipe.value ? favStore.isFavorite(recipe.value.id) : false)
const showGrouped = computed(() => userInput.value !== null)
const ingSplit = computed(() => recipe.value ? splitHaveMiss(recipe.value.ingredients, userInput.value) : { have: [], miss: [] })
const seaSplit = computed(() => recipe.value ? splitHaveMiss(recipe.value.seasonings, userInput.value) : { have: [], miss: [] })
const ingGroups = computed(() => toGroups(ingSplit.value.have, ingSplit.value.miss))
const seaGroups = computed(() => toGroups(seaSplit.value.have, seaSplit.value.miss))

function splitHaveMiss(all: string[], input: GenerateInput | null) {
  if (!input) return { have: [], miss: [...all] }
  const set = new Set([...input.ingredients, ...input.seasonings])
  const have: string[] = []
  const miss: string[] = []
  for (const item of all) (set.has(item) ? have : miss).push(item)
  return { have, miss }
}

function toGroups(have: string[], miss: string[]) {
  return [
    { label: '已有', cls: 'have', icon: 'checkmarkempty', color: 'var(--color-success)', items: have },
    { label: '还差', cls: 'missing', icon: 'minus', color: 'var(--color-warn)', items: miss }
  ].filter(group => group.items.length > 0)
}

function onFav() {
  if (!recipe.value) return
  const nowFav = favStore.toggle(recipe.value.id)
  uni.showToast({ title: nowFav ? '已收藏' : '已取消', icon: 'none' })
}

function goBack() {
  const pages = getCurrentPages()
  if (!fromShare.value && pages.length > 1) {
    uni.navigateBack()
    return
  }
  uni.reLaunch({ url: '/pages/index/index' })
}

onShareAppMessage(() => {
  if (!recipe.value) return { title: '菜谱生成', path: '/pages/index/index' }
  return {
    title: `试试这道 ${recipe.value.name} - ${recipe.value.shortDesc}`,
    path: `/pages/detail/detail?id=${recipe.value.id}&from=share`
  }
})
</script>

<template>
  <view class="page">
    <view v-if="loading" class="loading-state">
      <view class="loading-icon"><uni-icons type="spinner-cycle" color="var(--color-primary)" size="48" /></view>
      <text class="loading-title">正在加载菜谱</text>
      <text class="loading-subtitle">马上就能看到完整做法</text>
    </view>

    <view v-else-if="errorMessage" class="error-state">
      <EmptyState icon="info" title="菜谱加载失败" :subtitle="errorMessage" />
      <view class="error-actions">
        <view class="retry-btn" @tap="loadRecipe"><uni-icons type="refresh" color="#FFFFFF" size="14" /><text>重试</text></view>
        <view class="back-btn" @tap="goBack"><text>返回首页</text></view>
      </view>
    </view>

    <view v-else-if="recipe" class="detail-content">
      <view class="hero-card">
        <text class="name">{{ recipe.name }}</text>
        <view class="chips-row">
          <text class="chip">{{ CUISINE_LABELS[recipe.cuisine] }}</text>
          <text class="chip accent">{{ recipe.cookTime }}分钟</text>
          <text class="chip accent">{{ DIFFICULTY_LABELS[recipe.difficulty] }}</text>
          <text v-for="taste in recipe.taste" :key="taste" class="chip accent">{{ TASTE_LABELS[taste] }}</text>
        </view>
        <text class="match-display">契合 {{ coverage ?? 100 }}%</text>
        <text class="match-label">{{ showGrouped ? '基于你冰箱里的食材' : '菜谱详情' }}</text>
      </view>

      <template v-if="showGrouped">
        <view class="section">
          <SectionTitle icon="list" title="需要准备" />
          <view v-for="group in ingGroups" :key="group.label" class="group">
            <view :class="['group-label', group.cls]"><uni-icons :type="group.icon" :color="group.color" size="12" /><text>{{ group.label }}</text></view>
            <view class="tag-list"><text v-for="item in group.items" :key="item" :class="['ing-tag', group.cls]">{{ item }}</text></view>
          </view>
        </view>
        <view class="section">
          <SectionTitle icon="gear" title="调味料" />
          <view v-for="group in seaGroups" :key="group.label" class="group">
            <view :class="['group-label', group.cls]"><uni-icons :type="group.icon" :color="group.color" size="12" /><text>{{ group.label }}</text></view>
            <view class="tag-list"><text v-for="item in group.items" :key="item" :class="['ing-tag', group.cls]">{{ item }}</text></view>
          </view>
        </view>
      </template>

      <template v-else>
        <view class="section"><SectionTitle icon="list" title="所需食材" /><view class="tag-list"><text v-for="ingredient in recipe.ingredients" :key="ingredient" class="ing-tag">{{ ingredient }}</text></view></view>
        <view class="section"><SectionTitle icon="gear" title="所需调味料" /><view class="tag-list"><text v-for="seasoning in recipe.seasonings" :key="seasoning" class="ing-tag">{{ seasoning }}</text></view></view>
      </template>

      <view class="section">
        <SectionTitle icon="flag" title="做法" />
        <view class="steps">
          <view v-for="step in recipe.steps" :key="step.order" class="step">
            <view class="step-num"><text>{{ step.order }}</text></view>
            <text class="step-text">{{ step.text }}</text>
          </view>
        </view>
      </view>

      <view class="bottom-bar">
        <view class="btn-fav" @tap="onFav">
          <uni-icons :type="isFav ? 'star-filled' : 'star'" :color="isFav ? 'var(--color-primary)' : 'var(--color-text)'" size="16" />
          <text>{{ isFav ? '已收藏' : '收藏' }}</text>
        </view>
        <button open-type="share" class="btn-share"><uni-icons type="paperplane" color="#FFFFFF" size="16" /><text>分享给好友</text></button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page { min-height: 100vh; background: var(--gradient-bg); padding: 24rpx 0 144rpx; }
.detail-content { min-height: 100vh; }
.loading-state { min-height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 120rpx 32rpx; }
.loading-icon { width: 120rpx; height: 120rpx; border-radius: 60rpx; background: var(--color-primary-light); display: flex; align-items: center; justify-content: center; opacity: 0.7; }
.loading-title { margin-top: 24rpx; font-size: 32rpx; font-weight: 700; color: var(--color-text); }
.loading-subtitle { margin-top: 8rpx; font-size: 24rpx; color: var(--color-text-sub); }
.error-state { min-height: 70vh; padding-top: 40rpx; }
.error-actions { display: flex; flex-direction: column; align-items: center; gap: 20rpx; margin-top: -72rpx; }
.retry-btn, .back-btn { display: inline-flex; align-items: center; justify-content: center; gap: 12rpx; min-width: 220rpx; padding: 20rpx 48rpx; border-radius: var(--radius-pill); font-size: 26rpx; font-weight: 600; }
.retry-btn { background: var(--gradient-cta); color: #FFFFFF; box-shadow: var(--shadow-cta); }
.back-btn { background: var(--color-bg-card); color: var(--color-primary); border: 2rpx solid var(--color-primary); }
.retry-btn:active, .back-btn:active { transform: scale(0.98); }
.hero-card { margin: 0 32rpx 24rpx; background: var(--gradient-card); border: 2rpx solid var(--color-border); border-radius: 32rpx; padding: 36rpx 32rpx; box-shadow: var(--shadow-card); }
.name { display: block; font-size: 40rpx; font-weight: 700; color: var(--color-text); margin-bottom: 20rpx; line-height: 1.3; }
.chips-row { display: flex; gap: 12rpx; flex-wrap: wrap; margin-bottom: 28rpx; }
.chip { padding: 6rpx 20rpx; border-radius: var(--radius-pill); font-size: 22rpx; font-weight: 500; background: var(--color-primary-light); color: var(--color-text); }
.chip.accent { background: var(--color-primary); color: #FFFFFF; }
.match-display { display: block; font-size: 64rpx; font-weight: 800; color: var(--color-primary); line-height: 1; margin-bottom: 4rpx; }
.match-label { display: block; font-size: 22rpx; color: var(--color-text-sub); }
.section { padding: 16rpx 32rpx; }
.group { margin-bottom: 16rpx; }
.group-label { display: flex; align-items: center; gap: 8rpx; font-size: 22rpx; font-weight: 600; margin-bottom: 8rpx; }
.group-label.have { color: var(--color-success); }
.group-label.missing { color: var(--color-warn); }
.tag-list { display: flex; flex-wrap: wrap; gap: 8rpx; }
.ing-tag { padding: 6rpx 20rpx; border-radius: var(--radius-pill); font-size: 22rpx; font-weight: 500; background: var(--color-primary-light); color: var(--color-text); }
.ing-tag.have { background: #EDF7EE; color: var(--color-success); border: 2rpx solid var(--color-success); }
.ing-tag.missing { background: #FFF3DC; color: var(--color-warn); border: 2rpx solid var(--color-warn); }
.steps { display: flex; flex-direction: column; gap: 12rpx; }
.step { display: flex; gap: 20rpx; padding: 16rpx 24rpx; background: linear-gradient(135deg, #FFF8EF 0%, #FFF2E4 100%); border-radius: 20rpx; align-items: flex-start; }
.step-num { flex-shrink: 0; width: 40rpx; height: 40rpx; background: var(--gradient-cta); color: #FFFFFF; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22rpx; font-weight: 700; }
.step-text { flex: 1; font-size: 26rpx; color: var(--color-text); line-height: 1.6; padding-top: 4rpx; }
.bottom-bar { position: fixed; left: 0; right: 0; bottom: 0; display: flex; gap: 16rpx; padding: 20rpx 32rpx 28rpx; background: var(--color-bg-card); border-top: 2rpx solid var(--color-border); z-index: 10; }
.btn-fav, .btn-share { display: flex; align-items: center; justify-content: center; gap: 12rpx; padding: 20rpx 0; border-radius: 24rpx; font-size: 26rpx; font-weight: 600; }
.btn-fav { flex: 1; background: var(--color-bg-card); color: var(--color-text); border: 2rpx solid var(--color-border); }
.btn-share { flex: 2; background: var(--gradient-cta); color: #FFFFFF; border: none; box-shadow: var(--shadow-cta); }
.btn-fav:active, .btn-share:active { transform: scale(0.97); }
</style>
