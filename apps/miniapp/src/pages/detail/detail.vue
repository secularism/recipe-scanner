<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Recipe, GenerateInput } from '@/types'
import { findRecipeById, CUISINE_LABELS, TASTE_LABELS, DIFFICULTY_LABELS } from '@/data'
import { useFavoritesStore } from '@/stores/favorites'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import SectionTitle from '@/components/SectionTitle.vue'

const favStore = useFavoritesStore()
const recipe = ref<Recipe | null>(null)
const userInput = ref<GenerateInput | null>(null)
const coverage = ref<number | null>(null)
const fromShare = ref(false)

interface PendingDetail { input: GenerateInput; coverage: number }

onLoad((q) => {
  const id = (q?.id as string) || ''
  const from = (q?.from as string) || ''
  const r = findRecipeById(id)
  if (r) {
    recipe.value = r
    favStore.load()
    fromShare.value = from === 'share'
    const app = getApp()
    const pending = app?.globalData?.pendingDetailInput as PendingDetail | undefined
    if (pending) {
      userInput.value = pending.input
      coverage.value = pending.coverage
      if (app?.globalData) app.globalData.pendingDetailInput = null
    }
    if (fromShare.value) {
      uni.showToast({ title: '好友分享的菜谱', icon: 'none' })
    }
  } else {
    uni.showToast({ title: '菜谱不存在', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 800)
  }
})

const isFav = computed(() => recipe.value ? favStore.isFavorite(recipe.value.id) : false)

function splitHaveMiss(all: string[], input: GenerateInput | null) {
  if (!input) return { have: [], miss: [...all] }
  const set = new Set([...input.ingredients, ...input.seasonings])
  const have: string[] = []
  const miss: string[] = []
  for (const x of all) (set.has(x) ? have : miss).push(x)
  return { have, miss }
}

const ingSplit = computed(() => recipe.value
  ? splitHaveMiss(recipe.value.ingredients, userInput.value) : { have: [], miss: [] })
const seaSplit = computed(() => recipe.value
  ? splitHaveMiss(recipe.value.seasonings, userInput.value) : { have: [], miss: [] })
const showGrouped = computed(() => userInput.value !== null)

const ingGroups = computed(() => [
  { label: '已有', cls: 'have', icon: 'checkmarkempty', color: '#6AAF6F', items: ingSplit.value.have },
  { label: '还差', cls: 'missing', icon: 'minus', color: '#E8A83A', items: ingSplit.value.miss }
].filter(g => g.items.length > 0))
const seaGroups = computed(() => [
  { label: '已有', cls: 'have', icon: 'checkmarkempty', color: '#6AAF6F', items: seaSplit.value.have },
  { label: '还差', cls: 'missing', icon: 'minus', color: '#E8A83A', items: seaSplit.value.miss }
].filter(g => g.items.length > 0))

function onFav() {
  if (!recipe.value) return
  const nowFav = favStore.toggle(recipe.value.id)
  uni.showToast({ title: nowFav ? '已收藏' : '已取消', icon: 'none' })
}

onShareAppMessage(() => {
  if (!recipe.value) {
    return { title: '菜谱生成', path: '/pages/index/index' }
  }
  return {
    title: `试试这道 ${recipe.value.name} — ${recipe.value.shortDesc}`,
    path: `/pages/detail/detail?id=${recipe.value.id}&from=share`
  }
})
</script>

<template>
  <view v-if="recipe" class="page">
    <!-- Hero Card -->
    <view class="hero-card">
      <text class="name">{{ recipe.name }}</text>
      <view class="chips-row">
        <text class="chip">{{ CUISINE_LABELS[recipe.cuisine] }}</text>
        <text class="chip accent">{{ recipe.cookTime }}分钟</text>
        <text v-for="t in recipe.taste" :key="t" class="chip accent">{{ TASTE_LABELS[t] }}</text>
      </view>
      <text class="match-display">契合 {{ coverage ?? 100 }}%</text>
      <text class="match-label">{{ showGrouped ? '基于你冰箱里的食材' : '菜谱详情' }}</text>
    </view>

    <!-- Ingredients -->
    <template v-if="showGrouped">
      <view class="section">
        <SectionTitle icon="list" title="需要准备" />
        <view v-for="g in ingGroups" :key="g.label" class="group">
          <view :class="['group-label', g.cls]">
            <uni-icons :type="g.icon" :color="g.color" size="12" />
            <text>{{ g.label }}</text>
          </view>
          <view class="tag-list">
            <text v-for="x in g.items" :key="x" :class="['ing-tag', g.cls]">{{ x }}</text>
          </view>
        </view>
      </view>
      <view class="section">
        <SectionTitle icon="gear" title="调味料" />
        <view v-for="g in seaGroups" :key="g.label" class="group">
          <view :class="['group-label', g.cls]">
            <uni-icons :type="g.icon" :color="g.color" size="12" />
            <text>{{ g.label }}</text>
          </view>
          <view class="tag-list">
            <text v-for="x in g.items" :key="x" :class="['ing-tag', g.cls]">{{ x }}</text>
          </view>
        </view>
      </view>
    </template>

    <template v-else>
      <view class="section">
        <SectionTitle icon="list" title="所需食材" />
        <view class="tag-list">
          <text v-for="i in recipe.ingredients" :key="i" class="ing-tag">{{ i }}</text>
        </view>
      </view>
      <view class="section">
        <SectionTitle icon="gear" title="所需调味料" />
        <view class="tag-list">
          <text v-for="s in recipe.seasonings" :key="s" class="ing-tag">{{ s }}</text>
        </view>
      </view>
    </template>

    <!-- Steps -->
    <view class="section">
      <SectionTitle icon="flag" title="做法" />
      <view class="steps">
        <view v-for="step in recipe.steps" :key="step.order" class="step">
          <view class="step-num">
            <text>{{ step.order }}</text>
          </view>
          <text class="step-text">{{ step.text }}</text>
        </view>
      </view>
    </view>

    <!-- Bottom bar -->
    <view class="bottom-bar">
      <view class="btn-fav" @tap="onFav">
        <uni-icons :type="isFav ? 'star-filled' : 'star'" :color="isFav ? '#E8783B' : '#4A2D15'" size="16" />
        <text>{{ isFav ? '已收藏' : '收藏' }}</text>
      </view>
      <button open-type="share" class="btn-share">
        <uni-icons type="paperplane" color="#fff" size="16" />
        <text>分享给好友</text>
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page { min-height: 100vh; background: var(--gradient-bg); padding: 24rpx 0 144rpx; }
.hero-card {
  margin: 0 32rpx 24rpx;
  background: var(--gradient-card);
  border: 2rpx solid var(--color-border);
  border-radius: 32rpx;
  padding: 36rpx 32rpx;
  box-shadow: var(--shadow-card);
}
.name {
  display: block; font-size: 40rpx; font-weight: 700;
  color: var(--color-text); margin-bottom: 20rpx; line-height: 1.3;
}
.chips-row {
  display: flex; gap: 12rpx; flex-wrap: wrap; margin-bottom: 28rpx;
}
.chip {
  padding: 6rpx 20rpx; border-radius: var(--radius-pill);
  font-size: 22rpx; font-weight: 500;
  background: var(--color-primary-light); color: var(--color-text);
}
.chip.accent { background: var(--color-primary); color: #fff; }
.match-display {
  display: block; font-size: 64rpx; font-weight: 800;
  color: var(--color-primary); line-height: 1; margin-bottom: 4rpx;
}
.match-label { display: block; font-size: 22rpx; color: var(--color-text-sub); }
.section { padding: 16rpx 32rpx; }
.group { margin-bottom: 16rpx; }
.group-label {
  display: flex; align-items: center; gap: 8rpx;
  font-size: 22rpx; font-weight: 600; margin-bottom: 8rpx;
}
.group-label.have { color: var(--color-success); }
.group-label.missing { color: var(--color-warn); }
.tag-list { display: flex; flex-wrap: wrap; gap: 8rpx; }
.ing-tag {
  padding: 6rpx 20rpx; border-radius: var(--radius-pill);
  font-size: 22rpx; font-weight: 500;
  background: var(--color-primary-light); color: var(--color-text);
}
.ing-tag.have { background: #EDF7EE; color: var(--color-success); border: 2rpx solid var(--color-success); }
.ing-tag.missing { background: #FFF3DC; color: var(--color-warn); border: 2rpx solid var(--color-warn); }
.steps { display: flex; flex-direction: column; gap: 12rpx; }
.step {
  display: flex; gap: 20rpx; padding: 16rpx 24rpx;
  background: linear-gradient(135deg, #FFF8EF 0%, #FFF2E4 100%);
  border-radius: 20rpx; align-items: flex-start;
}
.step-num {
  flex-shrink: 0; width: 40rpx; height: 40rpx;
  background: var(--gradient-cta); color: #fff; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 22rpx; font-weight: 700;
}
.step-text {
  flex: 1; font-size: 26rpx; color: var(--color-text);
  line-height: 1.6; padding-top: 4rpx;
}
.bottom-bar {
  position: fixed; left: 0; right: 0; bottom: 0;
  display: flex; gap: 16rpx; padding: 20rpx 32rpx 28rpx;
  background: var(--color-bg-card);
  border-top: 2rpx solid var(--color-border);
  z-index: 10;
}
.btn-fav, .btn-share {
  display: flex; align-items: center; justify-content: center;
  gap: 12rpx; padding: 20rpx 0; border-radius: 24rpx;
  font-size: 26rpx; font-weight: 600;
}
.btn-fav {
  flex: 1; background: var(--color-bg-card);
  color: var(--color-text); border: 2rpx solid var(--color-border);
}
.btn-share {
  flex: 2; background: var(--gradient-cta); color: #fff; border: none;
  box-shadow: var(--shadow-cta);
}
.btn-fav:active, .btn-share:active { transform: scale(0.97); }
</style>
