<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MatchResult, GenerateInput } from '@/types'
import { generateRecipe, shuffleResult } from '@/services'
import { useHistoryStore } from '@/stores/history'
import { onLoad } from '@dcloudio/uni-app'

const histStore = useHistoryStore()
const input = ref<GenerateInput | null>(null)
const results = ref<MatchResult[]>([])

onLoad(() => {
  const app = getApp()
  const pending = app?.globalData?.pendingInput as GenerateInput | undefined
  if (pending) {
    input.value = pending
    if (app?.globalData) app.globalData.pendingInput = null
    doGenerate()
  } else {
    uni.showToast({ title: '没有输入', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 800)
  }
})

function doGenerate() {
  if (!input.value) return
  results.value = generateRecipe(input.value)
  if (results.value.length > 0) {
    const top = results.value[0]
    histStore.addIfFresh({
      recipeId: top.recipe.id,
      recipeName: top.recipe.name,
      input: input.value,
      missingCount: top.missingIngredients.length + top.missingSeasonings.length
    })
  }
}

function reshuffle() {
  if (!input.value) return
  if (results.value.length > 0) {
    const current = results.value[0].recipe.id
    const next = shuffleResult(current, input.value)
    if (next) {
      results.value = [next, ...results.value.slice(1).filter(r => r.recipe.id !== next.recipe.id)]
    } else {
      uni.showToast({ title: '换个口味先', icon: 'none' })
    }
  }
}

function openDetail(r: MatchResult) {
  const app = getApp()
  if (app?.globalData) {
    app.globalData.pendingDetailInput = {
      input: input.value,
      coverage: r.coverage
    }
  }
  uni.navigateTo({ url: `/pages/detail/detail?id=${r.recipe.id}` })
}

const hasResults = computed(() => results.value.length > 0)
const totalInputItems = computed(() => {
  if (!input.value) return 0
  return input.value.ingredients.length + input.value.seasonings.length
})
function goBack() { uni.navigateBack() }
</script>

<template>
  <view class="page">
    <view v-if="hasResults" class="results">
      <view class="summary">
        <text>基于你输入的 <text class="strong">{{ totalInputItems }} 种食材</text></text>
      </view>
      <view class="cards">
        <RecipeCard
          v-for="(r, i) in results"
          :key="r.recipe.id"
          :result="r"
          show-score
          :variant="i === 0 ? 'large' : 'small'"
          @tap="openDetail"
        />
      </view>
      <view class="refresh-wrap">
        <view class="btn-refresh" @tap="reshuffle">
          <uni-icons type="refresh" color="#E8783B" size="14" />
          <text>换一换</text>
        </view>
      </view>
    </view>
    <EmptyState
      v-else
      icon="info"
      title="没有找到匹配的菜谱"
      subtitle="试试多选几个食材和调味料，或换个菜系"
    >
      <view class="back-btn" @tap="goBack">
        <text>返回修改</text>
      </view>
    </EmptyState>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: var(--gradient-bg);
  padding-bottom: 40rpx;
}
.summary {
  padding: 20rpx 32rpx;
  font-size: 24rpx;
  color: var(--color-text-sub);
  background: var(--color-bg-card);
  border-bottom: 2rpx solid var(--color-border);
  display: flex;
  align-items: center;
}
.strong { color: var(--color-text); font-weight: 600; }
.cards { padding: 24rpx 0 0; }
.refresh-wrap {
  text-align: center;
  padding: 32rpx 0;
}
.btn-refresh {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 48rpx;
  border-radius: var(--radius-pill);
  border: 2rpx solid var(--color-primary);
  background: var(--color-bg-card);
  color: var(--color-primary);
  font-size: 26rpx;
  font-weight: 600;
}
.btn-refresh:active {
  transform: scale(0.97);
  background: var(--color-primary-light);
}
.back-btn {
  margin-top: 40rpx;
  padding: 24rpx 48rpx;
  background: var(--gradient-cta);
  color: #fff;
  border-radius: var(--radius-pill);
  font-size: 28rpx;
  font-weight: 600;
  display: inline-block;
  box-shadow: var(--shadow-cta);
}
.back-btn:active { transform: scale(0.98); }
</style>
