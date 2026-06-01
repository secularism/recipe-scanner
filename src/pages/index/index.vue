<script setup lang="ts">
import { useFavoritesStore } from '@/stores/favorites'
import { useHistoryStore } from '@/stores/history'

const favStore = useFavoritesStore()
const histStore = useHistoryStore()

favStore.load()
histStore.load()
</script>

<template>
  <view class="index">
    <view class="hero">
      <view class="plate">
        <text class="plate-emoji">🍳</text>
        <text class="plate-steam">♨</text>
      </view>
      <text class="title">今天吃什么？</text>
      <text class="subtitle">告诉我你冰箱里有什么，我帮你想想</text>
    </view>

    <view class="actions">
      <navigator url="/pages/generator/generator" class="btn btn-primary" hover-class="none">
        <text>🥕 选食材开始</text>
      </navigator>
      <view class="row">
        <navigator url="/pages/favorites/favorites" class="btn btn-ghost" hover-class="none">
          <view class="btn-icon">
            <text>⭐</text>
          </view>
          <view class="btn-info">
            <text class="btn-title">收藏</text>
            <text class="btn-count">{{ favStore.list.length }} 道</text>
          </view>
        </navigator>
        <navigator url="/pages/history/history" class="btn btn-ghost" hover-class="none">
          <view class="btn-icon">
            <text>📖</text>
          </view>
          <view class="btn-info">
            <text class="btn-title">历史</text>
            <text class="btn-count">{{ histStore.list.length }} 条</text>
          </view>
        </navigator>
      </view>
    </view>

    <view class="footer">
      <text class="footer-text">👨‍🍳 用心做饭，用爱生活</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.index {
  min-height: 100vh;
  padding: 120rpx 48rpx 80rpx;
  display: flex;
  flex-direction: column;
}
.hero {
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 80rpx;
}
.plate {
  position: relative;
  width: 240rpx;
  height: 240rpx;
  border-radius: 50%;
  background: #fff;
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6rpx solid var(--color-secondary);
  .plate-emoji { font-size: 100rpx; }
  .plate-steam {
    position: absolute;
    top: -36rpx;
    right: -16rpx;
    font-size: 56rpx;
    color: var(--color-primary-light);
    transform: rotate(15deg);
  }
}
.title {
  font-size: 64rpx;
  font-weight: 800;
  color: var(--color-text);
  margin-top: 48rpx;
  display: block;
  letter-spacing: 2rpx;
}
.subtitle {
  font-size: 28rpx;
  color: var(--color-text-sub);
  margin-top: 16rpx;
  display: block;
}
.actions {
  .row { display: flex; gap: 24rpx; margin-top: 24rpx; }
  .row .btn { flex: 1; }
}
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28rpx 0;
  border-radius: var(--radius-md);
  font-weight: 600;
  &-primary {
    background: var(--color-primary);
    color: #fff;
    box-shadow: var(--shadow-soft);
    font-size: 36rpx;
  }
  &-ghost {
    background: #fff;
    border: 2rpx solid var(--color-border);
    flex-direction: column;
    padding: 32rpx 16rpx;
    gap: 12rpx;
  }
}
.btn-icon { font-size: 40rpx; }
.btn-info { display: flex; flex-direction: column; align-items: center; gap: 4rpx; }
.btn-title { font-size: 28rpx; color: var(--color-text); font-weight: 600; }
.btn-count { font-size: 22rpx; color: var(--color-text-sub); }
.footer {
  text-align: center;
  margin-top: 80rpx;
  .footer-text { font-size: 24rpx; color: var(--color-text-sub); }
}
</style>
