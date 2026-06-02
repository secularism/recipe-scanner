<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { useFavoritesStore } from '@/stores/favorites'

const favStore = useFavoritesStore()

onShow(() => favStore.load())

function openDetail(id: string) {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
}
</script>

<template>
  <view class="page">
    <view v-if="favStore.list.length === 0" class="empty">
      <EmptyState
        icon="star"
        title="还没有收藏的菜谱"
        subtitle="去生成一个吧"
      />
    </view>
    <view v-else>
      <view class="header-row">
        <view class="header-title">
          <uni-icons type="star-filled" color="#E8783B" size="15" />
          <text>我的收藏 · <text class="count">{{ favStore.list.length }} 道</text></text>
        </view>
      </view>
      <view class="list">
        <view
          v-for="r in favStore.list"
          :key="r.id"
          class="recipe-card"
          hover-class="recipe-card-hover"
          @tap="openDetail(r.id)"
        >
          <view class="card-head">
            <text class="name">{{ r.name }}</text>
            <text class="cuisine">{{ r.cuisine }}</text>
          </view>
          <view class="card-chips">
            <text class="chip">{{ r.cookTime }}分钟</text>
            <text v-for="t in r.taste" :key="t" class="chip accent">{{ t }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: var(--gradient-bg);
  padding-bottom: 40rpx;
}
.empty { padding-top: 80rpx; }
.header-row {
  padding: 24rpx 32rpx 16rpx;
  border-bottom: 2rpx solid var(--color-border);
  background: var(--color-bg-card);
}
.header-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--color-text);
}
.count { color: var(--color-primary); font-weight: 700; }
.list { padding: 24rpx 0; }
.recipe-card {
  margin: 0 32rpx 16rpx;
  background: var(--gradient-card);
  border: 2rpx solid var(--color-border);
  border-radius: 28rpx;
  padding: 28rpx;
  box-shadow: var(--shadow-card);
}
.recipe-card-hover { transform: scale(0.98); }
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}
.name { font-size: 32rpx; font-weight: 700; color: var(--color-text); }
.cuisine { font-size: 24rpx; color: var(--color-text-sub); }
.card-chips {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
}
.chip {
  padding: 4rpx 16rpx;
  border-radius: var(--radius-pill);
  font-size: 20rpx;
  font-weight: 500;
  background: var(--color-primary-light);
  color: var(--color-text);
}
.chip.accent {
  background: var(--color-primary);
  color: #fff;
}
</style>
