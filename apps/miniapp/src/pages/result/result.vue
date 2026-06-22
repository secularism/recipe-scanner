<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MatchResult, GenerateInput, Recipe } from '@/types'
import { generateRecipe, recipesApi, shuffleResult } from '@/services'
import { useHistoryStore } from '@/stores/history'
import { onLoad } from '@dcloudio/uni-app'
import RecipeCard from '@/components/RecipeCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const histStore = useHistoryStore()
const input = ref<GenerateInput | null>(null)
const results = ref<MatchResult[]>([])
const recipePool = ref<Recipe[]>([])
const loading = ref(false)
const hasLoaded = ref(false)
const errorMessage = ref('')

onLoad(() => {
  const app = getApp()
  const pending = app?.globalData?.pendingInput as GenerateInput | undefined
  if (pending) {
    input.value = pending
    if (app?.globalData) app.globalData.pendingInput = null
    void loadAndGenerate()
  } else {
    uni.showToast({ title: '没有输入', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 800)
  }
})

async function loadAndGenerate() {
  if (!input.value) return

  loading.value = true
  errorMessage.value = ''
  hasLoaded.value = false
  results.value = []

  try {
    const pool = await recipesApi.fetchMatchReadyRecipes()
    recipePool.value = pool
    results.value = generateRecipe(input.value, 3, recipePool.value)
    hasLoaded.value = true

    if (results.value.length === 0) {
      return
    }

    const top = results.value[0]
    histStore.addIfFresh({
      recipeId: top.recipe.id,
      recipeName: top.recipe.name,
      input: input.value,
      missingCount: top.missingIngredients.length + top.missingSeasonings.length
    })
  } catch {
    recipePool.value = []
    errorMessage.value = '暂时加载不到菜谱，请稍后重试'
  } finally {
    loading.value = false
  }
}

function reshuffle() {
  if (!input.value) return
  if (results.value.length > 0 && recipePool.value.length > 0) {
    const current = results.value[0].recipe.id
    const next = shuffleResult(current, input.value, 10, recipePool.value)
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
const showEmptyMatch = computed(() => hasLoaded.value && !loading.value && !errorMessage.value && !hasResults.value)
const totalInputItems = computed(() => {
  if (!input.value) return 0
  return input.value.ingredients.length + input.value.seasonings.length
})
function goBack() { uni.navigateBack() }
</script>

<template>
  <view class="page">
    <view v-if="loading" class="loading-state">
      <view class="loading-icon">
        <uni-icons type="spinner-cycle" color="#E8783B" size="48" />
      </view>
      <text class="loading-title">正在生成菜谱</text>
      <text class="loading-subtitle">根据你的食材挑选合适做法</text>
    </view>

    <EmptyState
      v-else-if="errorMessage"
      icon="info"
      title="菜谱加载失败"
      :subtitle="errorMessage"
    >
      <view class="error-actions">
        <view class="retry-btn" @tap="loadAndGenerate">
          <uni-icons type="refresh" color="#FFFFFF" size="14" />
          <text>重试</text>
        </view>
        <view class="back-btn secondary" @tap="goBack">
          <text>返回修改</text>
        </view>
      </view>
    </EmptyState>

    <view v-else-if="hasResults" class="results">
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
      v-else-if="showEmptyMatch"
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
.loading-state {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 32rpx;
}
.loading-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background: var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}
.loading-title {
  margin-top: 24rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: var(--color-text);
}
.loading-subtitle {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--color-text-sub);
}
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
.error-actions {
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}
.retry-btn {
  padding: 24rpx 64rpx;
  background: var(--gradient-cta);
  color: #fff;
  border-radius: var(--radius-pill);
  font-size: 28rpx;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  box-shadow: var(--shadow-cta);
}
.retry-btn:active { transform: scale(0.98); }
.back-btn.secondary {
  margin-top: 0;
  background: var(--color-bg-card);
  color: var(--color-primary);
  border: 2rpx solid var(--color-primary);
  box-shadow: none;
}
.back-btn:active { transform: scale(0.98); }
</style>
