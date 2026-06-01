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
    histStore.add({
      recipeId: top.recipe.id,
      recipeName: top.recipe.name,
      input: input.value
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
  uni.navigateTo({ url: `/pages/detail/detail?id=${r.recipe.id}` })
}

const hasResults = computed(() => results.value.length > 0)

function goBack() {
  uni.navigateBack()
}
</script>

<template>
  <view class="page">
    <view v-if="hasResults" class="results">
      <view class="headline">
        <text class="title">为你找到 {{ results.length }} 道菜</text>
        <text class="hint">点击查看详情</text>
      </view>
      <RecipeCard
        v-for="r in results"
        :key="r.recipe.id"
        :result="r"
        show-score
        @tap="openDetail"
      />
      <view class="reshuffle" @tap="reshuffle">
        <text>🔀 换一换</text>
      </view>
    </view>
    <EmptyState
      v-else
      emoji="😢"
      title="没有找到匹配的菜谱"
      subtitle="试试多选几个食材和调味料，或换个菜系"
    >
      <view class="back-btn" @tap="goBack">
        <text>← 回去再选选</text>
      </view>
    </EmptyState>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 32rpx;
}
.headline {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 24rpx;
  padding: 0 8rpx;
  .title { font-size: 36rpx; font-weight: 700; color: var(--color-text); }
  .hint { font-size: 24rpx; color: var(--color-text-sub); }
}
.reshuffle {
  margin-top: 40rpx;
  text-align: center;
  padding: 28rpx 0;
  background: #fff;
  border: 2rpx dashed var(--color-primary);
  border-radius: var(--radius-pill);
  color: var(--color-primary);
  font-size: 30rpx;
  font-weight: 600;
}
.back-btn {
  margin-top: 40rpx;
  padding: 24rpx 48rpx;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-pill);
  font-size: 28rpx;
  font-weight: 600;
  display: inline-block;
}
</style>
