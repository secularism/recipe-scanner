<script setup lang="ts">
import { onShareAppMessage, onShow } from '@dcloudio/uni-app'
import { useFavoritesStore } from '@/stores/favorites'
import { useHistoryStore } from '@/stores/history'
import { QUICK_PRESETS } from '@/data'
import type { QuickPreset } from '@/data/presets'

const favStore = useFavoritesStore()
const histStore = useHistoryStore()

onShow(() => {
  favStore.load()
  histStore.load()
})

onShareAppMessage(() => ({
  title: '今天吃什么？告诉我你有什么，我帮你想想',
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
  <view class="page">
    <view class="hero">
      <view class="hero-illustration">
        <view class="steam">
          <view class="steam-line one" />
          <view class="steam-line two" />
          <view class="steam-line three" />
        </view>
        <view class="pan">
          <view class="pan-body">
            <view class="pan-inner" />
          </view>
          <view class="pan-handle" />
        </view>
      </view>
      <text class="title">今天吃什么？</text>
      <text class="subtitle">看看冰箱里有什么，今晚就有答案</text>
    </view>

    <view class="cta-wrap">
      <navigator url="/pages/generator/generator" class="btn-primary" hover-class="none">
        <uni-icons type="cart" color="#fff" size="18" />
        <text>选食材开始</text>
      </navigator>
      <text class="cta-hint">30 秒选完，马上给你推荐</text>
    </view>

    <view class="section-title">
      <uni-icons type="refresh" color="#E8783B" size="16" />
      <text>今天这样做</text>
    </view>
    <view class="presets">
      <view class="scene-grid">
        <view
          v-for="p in QUICK_PRESETS"
          :key="p.id"
          class="scene-card"
          hover-class="scene-card-hover"
          @tap="usePreset(p)"
        >
          <view class="scene-icon">
            <uni-icons :type="p.icon" color="#E8783B" size="18" />
          </view>
          <text class="scene-title">{{ p.title }}</text>
          <text class="scene-desc">{{ p.desc }}</text>
        </view>
      </view>
    </view>

    <view class="secondary-wrap">
      <text class="secondary-title">我的</text>
      <view class="entry-grid">
        <navigator url="/pages/favorites/favorites" class="entry-card" hover-class="entry-card-hover">
          <uni-icons type="star" color="#8B5E3D" size="18" />
          <view class="e-info">
            <text class="e-label">收藏</text>
            <text class="e-count">{{ favStore.count }} 道</text>
          </view>
        </navigator>
        <navigator url="/pages/history/history" class="entry-card" hover-class="entry-card-hover">
          <uni-icons type="list" color="#8B5E3D" size="18" />
          <view class="e-info">
            <text class="e-label">历史</text>
            <text class="e-count">{{ histStore.list.length }} 条</text>
          </view>
        </navigator>
      </view>
    </view>

    <view class="footer">
      <text>用心做饭，用爱生活</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page { min-height: 100vh; background: linear-gradient(180deg, #F8EEDD 0%, #FCF4E8 18%, #FFF6ED 42%, #FFF6ED 100%); padding: 0 32rpx 24rpx; }
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 0 -32rpx;
  padding: 88rpx 56rpx 44rpx;
  background: linear-gradient(180deg, rgba(255, 240, 224, 0.92) 0%, rgba(255, 244, 234, 0.68) 58%, rgba(255, 246, 237, 0) 100%);
}
.hero-illustration {
  width: 176rpx;
  height: 176rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 28rpx;
  border-radius: 50%;
  background: var(--color-bg-card);
  border: 4rpx solid var(--color-border);
  box-shadow: 0 4rpx 24rpx rgba(74, 45, 21, 0.06);
}
.steam {
  position: absolute;
  top: -20rpx;
  right: -4rpx;
  display: flex;
  gap: 8rpx;
  width: 72rpx;
  height: 72rpx;
}
.steam-line {
  width: 8rpx;
  border-left: 4rpx solid var(--color-primary-glow);
  border-radius: 50%;
}
.steam-line.one {
  height: 40rpx;
  opacity: 0.55;
}
.steam-line.two {
  height: 48rpx;
  opacity: 0.45;
}
.steam-line.three {
  height: 36rpx;
  opacity: 0.35;
}
.pan {
  width: 104rpx;
  height: 82rpx;
  position: relative;
  margin-top: 48rpx;
}
.pan-body {
  width: 88rpx;
  height: 56rpx;
  border: 5rpx solid var(--color-text);
  border-radius: 50%;
  background: #FFFDF9;
}
.pan-inner {
  width: 30rpx;
  height: 18rpx;
  margin: 14rpx auto 0;
  border: 4rpx dashed var(--color-primary);
  border-radius: 50%;
  opacity: 0.5;
}
.pan-handle {
  position: absolute;
  top: 20rpx;
  right: -6rpx;
  width: 36rpx;
  height: 8rpx;
  border-radius: var(--radius-pill);
  background: var(--color-text);
  transform: rotate(-42deg);
}
.title {
  margin-bottom: 8rpx;
  font-size: 52rpx;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text);
}
.subtitle {
  max-width: 440rpx;
  font-size: 26rpx;
  line-height: 1.45;
  color: var(--color-text-sub);
}
.cta-wrap { padding: 4rpx 0 28rpx; text-align: center; }
.cta-hint {
  display: block;
  margin-top: 12rpx;
  font-size: 22rpx;
  color: var(--color-text-sub);
  opacity: 0.7;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: var(--color-text);
}
.presets {
  padding-bottom: 24rpx;
}
.scene-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}
.scene-card {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  padding: 28rpx 24rpx;
  border-radius: 24rpx;
  background: var(--color-bg-card);
  border: 2rpx solid var(--color-border);
}
.scene-card-hover, .entry-card-hover { transform: scale(0.98); }
.scene-icon {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  background: linear-gradient(135deg, var(--color-bg-warm), #FFE8D4);
}
.scene-title {
  font-size: 24rpx;
  font-weight: 700;
  line-height: 1.25;
  color: var(--color-text);
}
.scene-desc {
  font-size: 20rpx;
  line-height: 1.35;
  color: var(--color-text-sub);
  opacity: 0.86;
}
.secondary-wrap { padding-bottom: 12rpx; }
.secondary-title {
  display: block;
  margin-bottom: 12rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: var(--color-text-sub);
  opacity: 0.75;
}
.entry-grid {
  display: flex;
  gap: 16rpx;
}
.entry-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 24rpx;
  border-radius: 16rpx;
  background: var(--color-bg-card);
  border: 2rpx solid var(--color-border);
}
.e-info { display: flex; flex-direction: column; }
.e-label {
  font-size: 24rpx;
  font-weight: 600;
  color: var(--color-text);
}
.e-count {
  font-size: 20rpx;
  color: var(--color-text-sub);
  opacity: 0.8;
}
.footer {
  text-align: center;
  padding: 20rpx 32rpx 16rpx;
  font-size: 20rpx;
  color: var(--color-text-sub);
  opacity: 0.55;
}
</style>
