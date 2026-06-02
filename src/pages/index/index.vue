<script setup lang="ts">
import { onShareAppMessage } from '@dcloudio/uni-app'
import { useFavoritesStore } from '@/stores/favorites'
import { useHistoryStore } from '@/stores/history'
import { QUICK_PRESETS } from '@/data'
import type { QuickPreset } from '@/data/presets'

const favStore = useFavoritesStore()
const histStore = useHistoryStore()

// 分享给好友：进入首页
onShareAppMessage(() => ({
  title: '今天吃什么？告诉我你有什么，我帮你想想 🍳',
  path: '/pages/index/index'
}))

function usePreset(p: QuickPreset) {
  const app = getApp()
  if (app?.globalData) {
    app.globalData.pendingInput = p.input
  }
  uni.navigateTo({ url: '/pages/result/result' })
}
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

    <view class="primary-action">
      <navigator url="/pages/generator/generator" class="btn btn-primary" hover-class="none">
        <text>🥕 选食材开始</text>
      </navigator>
    </view>

    <view class="presets">
      <view class="presets-title">
        <text>⚡ 一键生成</text>
      </view>
      <scroll-view scroll-x class="preset-list" show-scrollbar="false">
        <view
          v-for="p in QUICK_PRESETS"
          :key="p.id"
          class="preset-card"
          hover-class="preset-card-hover"
          @tap="usePreset(p)"
        >
          <text class="preset-emoji">{{ p.emoji }}</text>
          <text class="preset-title">{{ p.title }}</text>
          <text class="preset-desc">{{ p.desc }}</text>
        </view>
      </scroll-view>
    </view>

    <view class="actions">
      <navigator url="/pages/favorites/favorites" class="btn btn-ghost" hover-class="none">
        <view class="btn-icon">
          <text>⭐</text>
        </view>
        <view class="btn-info">
          <text class="btn-title">收藏</text>
          <text class="btn-count">{{ favStore.count }} 道</text>
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

    <view class="footer">
      <text class="footer-text">👨‍🍳 用心做饭，用爱生活</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.index {
  min-height: 100vh;
  padding: 120rpx 32rpx 60rpx;
  display: flex;
  flex-direction: column;
}
.hero {
  text-align: center;
  margin-bottom: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.plate {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background: #fff;
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6rpx solid var(--color-secondary);
  .plate-emoji { font-size: 90rpx; }
  .plate-steam {
    position: absolute;
    top: -32rpx;
    right: -16rpx;
    font-size: 48rpx;
    color: var(--color-primary-light);
    transform: rotate(15deg);
  }
}
.title {
  font-size: 56rpx;
  font-weight: 800;
  color: var(--color-text);
  margin-top: 32rpx;
  display: block;
  letter-spacing: 2rpx;
}
.subtitle {
  font-size: 26rpx;
  color: var(--color-text-sub);
  margin-top: 12rpx;
  display: block;
}
.primary-action {
  margin: 0 16rpx 32rpx;
}
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: 600;
  &-primary {
    background: var(--color-primary);
    color: #fff;
    box-shadow: var(--shadow-soft);
    font-size: 34rpx;
    padding: 26rpx 0;
  }
  &-ghost {
    background: #fff;
    border: 2rpx solid var(--color-border);
    flex-direction: column;
    padding: 24rpx 16rpx;
    gap: 8rpx;
    flex: 1;
  }
}
.presets {
  margin-bottom: 32rpx;
}
.presets-title {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 16rpx;
  padding: 0 16rpx;
}
.preset-list {
  white-space: nowrap;
  padding: 0 16rpx;
}
.preset-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 200rpx;
  padding: 20rpx 16rpx;
  margin-right: 16rpx;
  background: #fff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
  border: 2rpx solid var(--color-border);
  &-hover { transform: scale(0.98); }
}
.preset-emoji { font-size: 56rpx; }
.preset-title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--color-text);
  margin-top: 8rpx;
}
.preset-desc {
  font-size: 20rpx;
  color: var(--color-text-sub);
  margin-top: 4rpx;
  text-align: center;
  white-space: normal;
  width: 100%;
  line-height: 1.3;
}
.actions {
  display: flex;
  gap: 16rpx;
  padding: 0 16rpx;
}
.btn-icon { font-size: 40rpx; }
.btn-info { display: flex; flex-direction: column; align-items: center; gap: 4rpx; }
.btn-title { font-size: 28rpx; color: var(--color-text); font-weight: 600; }
.btn-count { font-size: 22rpx; color: var(--color-text-sub); }
.footer {
  text-align: center;
  margin-top: 48rpx;
  .footer-text { font-size: 24rpx; color: var(--color-text-sub); }
}
</style>
