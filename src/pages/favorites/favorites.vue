<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { useFavoritesStore } from '@/stores/favorites'
import { CUISINE_LABELS } from '@/data'

const favStore = useFavoritesStore()

onShow(() => favStore.load())

function openDetail(id: string) {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
}
</script>

<template>
  <view class="page">
    <EmptyState
      v-if="favStore.list.length === 0"
      emoji="💝"
      title="还没有收藏"
      subtitle="看到喜欢的菜谱，点击收藏按钮吧"
    />
    <view v-else class="list">
      <view
        v-for="r in favStore.list"
        :key="r.id"
        class="card item"
        @tap="openDetail(r.id)"
      >
        <view class="left">
          <text class="name">{{ r.name }}</text>
          <text class="desc">{{ r.shortDesc }}</text>
          <text class="meta">{{ CUISINE_LABELS[r.cuisine] }} · {{ r.cookTime }}分钟</text>
        </view>
        <text class="star">⭐</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page { min-height: 100vh; padding: 32rpx; }
.list { display: flex; flex-direction: column; gap: 20rpx; }
.item {
  display: flex;
  align-items: center;
  padding: 28rpx;
}
.left { flex: 1; display: flex; flex-direction: column; gap: 8rpx; }
.name { font-size: 32rpx; font-weight: 700; color: var(--color-text); }
.desc { font-size: 24rpx; color: var(--color-text-sub); line-height: 1.4; }
.meta { font-size: 22rpx; color: var(--color-primary); }
.star { font-size: 40rpx; margin-left: 16rpx; }
</style>
