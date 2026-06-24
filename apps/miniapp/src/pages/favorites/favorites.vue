<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import type { Recipe } from '@/types'
import { recipesApi } from '@/services'
import { useFavoritesStore } from '@/stores/favorites'
import EmptyState from '@/components/EmptyState.vue'

interface FavoriteView {
  id: string
  recipe?: Recipe
}

const favStore = useFavoritesStore()
const items = ref<FavoriteView[]>([])
const loading = ref(false)
const errorMessage = ref('')

const hasLocalFavorites = computed(() => favStore.ids.length > 0)
const availableCount = computed(() => items.value.filter(item => item.recipe).length)

onShow(() => {
  favStore.load()
  void loadFavorites()
})

async function loadFavorites() {
  errorMessage.value = ''
  items.value = []

  if (favStore.ids.length === 0) return

  loading.value = true
  try {
    const recipes = await recipesApi.fetchMatchReadyRecipes()
    const byId = new Map(recipes.map(recipe => [recipe.id, recipe]))
    items.value = favStore.ids.map(id => ({ id, recipe: byId.get(id) }))
  } catch {
    errorMessage.value = '暂时加载不到收藏菜谱，收藏记录还在，请稍后重试'
  } finally {
    loading.value = false
  }
}

function openDetail(item: FavoriteView) {
  if (!item.recipe) return
  uni.navigateTo({ url: `/pages/detail/detail?id=${item.id}` })
}

function cancelFavorite(id: string) {
  if (!favStore.remove(id)) return
  items.value = items.value.filter(item => item.id !== id)
  if (favStore.ids.length === 0) errorMessage.value = ''
  uni.showToast({ title: '已取消收藏', icon: 'none' })
}
</script>

<template>
  <view class="page">
    <view v-if="!hasLocalFavorites" class="empty">
      <EmptyState icon="star" title="还没有收藏的菜谱" subtitle="去生成一个吧" />
    </view>

    <view v-else>
      <view class="header-row">
        <view class="header-title">
          <uni-icons type="star-filled" color="var(--color-primary)" size="15" />
          <text>我的收藏 · <text class="count">{{ favStore.count }} 道</text></text>
        </view>
      </view>

      <view v-if="loading" class="loading-state">
        <view class="loading-icon"><uni-icons type="spinner-cycle" color="var(--color-primary)" size="36" /></view>
        <text class="loading-title">正在加载收藏菜谱</text>
      </view>

      <view v-else-if="errorMessage" class="error-state">
        <EmptyState icon="info" title="收藏加载失败" :subtitle="errorMessage" />
        <text class="preserved">已保留 {{ favStore.count }} 道本地收藏</text>
        <view class="retry-btn" @tap="loadFavorites"><uni-icons type="refresh" color="#FFFFFF" size="14" /><text>重试</text></view>
      </view>

      <view v-else class="list">
        <text class="list-hint">可查看 {{ availableCount }} 道，暂不可用 {{ favStore.count - availableCount }} 道</text>
        <view
          v-for="item in items"
          :key="item.id"
          :class="['recipe-card', item.recipe ? '' : 'unavailable']"
          hover-class="recipe-card-hover"
          @tap="openDetail(item)"
        >
          <template v-if="item.recipe">
            <view class="card-head">
              <text class="name">{{ item.recipe.name }}</text>
              <text class="cuisine">{{ item.recipe.cuisine }}</text>
            </view>
            <view class="card-chips">
              <text class="chip">{{ item.recipe.cookTime }}分钟</text>
              <text v-for="taste in item.recipe.taste" :key="taste" class="chip accent">{{ taste }}</text>
            </view>
          </template>

          <template v-else>
            <view class="card-head">
              <text class="name">暂不可用</text>
              <text class="cuisine">本地收藏</text>
            </view>
            <text class="missing-id">{{ item.id }}</text>
            <view class="cancel-btn" @tap.stop="cancelFavorite(item.id)">
              <uni-icons type="close" color="var(--color-danger)" size="13" />
              <text>取消收藏</text>
            </view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page { min-height: 100vh; background: var(--gradient-bg); padding-bottom: 40rpx; }
.empty { padding-top: 80rpx; }
.header-row { padding: 24rpx 32rpx 16rpx; border-bottom: 2rpx solid var(--color-border); background: var(--color-bg-card); }
.header-title { display: flex; align-items: center; justify-content: center; gap: 12rpx; font-size: 28rpx; font-weight: 600; color: var(--color-text); }
.count { color: var(--color-primary); font-weight: 700; }
.loading-state { min-height: 52vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 96rpx 32rpx; }
.loading-icon { width: 96rpx; height: 96rpx; border-radius: 48rpx; background: var(--color-primary-light); display: flex; align-items: center; justify-content: center; opacity: 0.7; }
.loading-title { margin-top: 20rpx; font-size: 28rpx; font-weight: 600; color: var(--color-text); }
.error-state { display: flex; flex-direction: column; align-items: center; padding-bottom: 40rpx; }
.preserved { margin-top: -72rpx; font-size: 24rpx; color: var(--color-text-sub); }
.retry-btn { display: inline-flex; align-items: center; gap: 12rpx; margin-top: 24rpx; padding: 20rpx 56rpx; border-radius: var(--radius-pill); background: var(--gradient-cta); color: #FFFFFF; font-size: 26rpx; font-weight: 600; box-shadow: var(--shadow-cta); }
.retry-btn:active { transform: scale(0.98); }
.list { padding: 24rpx 0; }
.list-hint { display: block; padding: 0 32rpx 20rpx; font-size: 22rpx; color: var(--color-text-sub); }
.recipe-card { margin: 0 32rpx 16rpx; background: var(--gradient-card); border: 2rpx solid var(--color-border); border-radius: 28rpx; padding: 28rpx; box-shadow: var(--shadow-card); }
.recipe-card-hover { transform: scale(0.98); }
.recipe-card.unavailable { border-style: dashed; background: var(--color-bg-card); }
.card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12rpx; gap: 16rpx; }
.name { flex: 1; min-width: 0; font-size: 32rpx; font-weight: 700; color: var(--color-text); }
.cuisine { flex-shrink: 0; font-size: 24rpx; color: var(--color-text-sub); }
.card-chips { display: flex; gap: 8rpx; flex-wrap: wrap; }
.chip { padding: 4rpx 16rpx; border-radius: var(--radius-pill); font-size: 20rpx; font-weight: 500; background: var(--color-primary-light); color: var(--color-text); }
.chip.accent { background: var(--color-primary); color: #FFFFFF; }
.missing-id { display: block; margin-bottom: 20rpx; font-size: 22rpx; color: var(--color-text-sub); word-break: break-all; }
.cancel-btn { display: inline-flex; align-items: center; gap: 8rpx; padding: 12rpx 24rpx; border-radius: var(--radius-pill); border: 2rpx solid var(--color-danger); color: var(--color-danger); font-size: 24rpx; font-weight: 600; }
.cancel-btn:active { transform: scale(0.98); background: #FEF2F2; }
</style>
