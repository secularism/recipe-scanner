<script setup lang="ts">
import { onShareAppMessage } from '@dcloudio/uni-app'
import { useFavoritesStore } from '@/stores/favorites'
import { useHistoryStore } from '@/stores/history'
import { QUICK_PRESETS } from '@/data'
import type { QuickPreset } from '@/data/presets'

const favStore = useFavoritesStore()
const histStore = useHistoryStore()

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
      <text class="subtitle">告诉我你冰箱里有什么，我帮你想想</text>
    </view>

    <view class="cta-wrap">
      <navigator url="/pages/generator/generator" class="btn-primary" hover-class="none">
        <uni-icons type="cart" color="#fff" size="18" />
        <text>选食材开始</text>
      </navigator>
    </view>

    <view class="section-title">
      <uni-icons type="fire" color="#4A2D15" size="16" />
      <text>一键生成</text>
    </view>
    <scroll-view scroll-x class="presets" show-scrollbar="false">
      <view class="presets-track">
        <view
          v-for="p in QUICK_PRESETS"
          :key="p.id"
          class="preset-card"
          hover-class="preset-card-hover"
          @tap="usePreset(p)"
        >
          <view class="preset-icon-wrap">
            <uni-icons :type="p.icon" color="#8B5E3D" size="22" />
          </view>
          <text class="preset-title">{{ p.title }}</text>
          <text class="preset-desc">{{ p.desc }}</text>
        </view>
      </view>
    </scroll-view>

    <view class="entry-grid">
      <navigator url="/pages/favorites/favorites" class="entry-card" hover-class="entry-card-hover">
        <uni-icons type="star" color="#8B5E3D" size="22" />
        <view class="e-info">
          <text class="e-label">收藏</text>
          <text class="e-count">{{ favStore.count }} 道</text>
        </view>
      </navigator>
      <navigator url="/pages/history/history" class="entry-card" hover-class="entry-card-hover">
        <uni-icons type="list" color="#8B5E3D" size="22" />
        <view class="e-info">
          <text class="e-label">历史</text>
          <text class="e-count">{{ histStore.list.length }} 条</text>
        </view>
      </navigator>
    </view>

    <view class="footer">
      <uni-icons type="heart-filled" color="#D9706A" size="14" />
      <text>用心做饭，用爱生活</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: var(--gradient-bg);
  padding: 28rpx 32rpx 40rpx;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 52rpx 24rpx 44rpx;
  text-align: center;
}
.hero-illustration {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background: var(--color-bg-card);
  border: 6rpx solid var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
  position: relative;
  overflow: visible;
}
.steam {
  position: absolute;
  top: 22rpx;
  left: 50%;
  width: 96rpx;
  height: 48rpx;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  gap: 14rpx;
}
.steam-line {
  width: 12rpx;
  height: 42rpx;
  border-left: 4rpx solid var(--color-primary-glow);
  border-radius: 50%;
  opacity: 0.7;
  transform: rotate(12deg);
}
.steam-line.two { height: 50rpx; opacity: 0.55; transform: rotate(-8deg); }
.steam-line.three { height: 36rpx; opacity: 0.45; transform: rotate(16deg); }
.pan {
  width: 124rpx;
  height: 96rpx;
  position: relative;
  margin-top: 54rpx;
}
.pan-body {
  width: 104rpx;
  height: 68rpx;
  border: 6rpx solid var(--color-text);
  border-radius: 50%;
  background: #FFFDF9;
  transform: rotate(-4deg);
}
.pan-inner {
  width: 44rpx;
  height: 24rpx;
  border: 4rpx dashed var(--color-primary);
  border-radius: 50%;
  margin: 18rpx auto 0;
  opacity: 0.55;
}
.pan-handle {
  position: absolute;
  right: -4rpx;
  top: 24rpx;
  width: 42rpx;
  height: 8rpx;
  border-radius: var(--radius-pill);
  background: var(--color-text);
  transform: rotate(-42deg);
}
.title {
  font-size: 56rpx;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.2;
  letter-spacing: 2rpx;
  display: block;
  margin-bottom: 12rpx;
  position: relative;
}
.title::after {
  content: '';
  position: absolute;
  bottom: -4rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 160rpx;
  height: 6rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='6'%3E%3Cpath d='M0 3 Q20 0 40 3 T80 3 T120 3 T160 3' fill='none' stroke='%23E8783B' stroke-width='4'/%3E%3C/svg%3E") no-repeat center;
}
.subtitle {
  font-size: 26rpx;
  color: var(--color-text-sub);
  font-weight: 500;
  max-width: 480rpx;
  line-height: 1.4;
  display: block;
}

.cta-wrap { padding-bottom: 40rpx; }
.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  width: 100%;
  padding: 28rpx 0;
  background: var(--gradient-cta);
  color: #fff;
  border-radius: 32rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: var(--shadow-cta);
}
.btn-primary:active { transform: scale(0.98); }

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding-bottom: 20rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: var(--color-text);
}

.presets {
  width: 100%;
  padding-bottom: 36rpx;
}
.presets-track {
  display: flex;
  gap: 16rpx;
  width: 848rpx;
}
.preset-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  width: 200rpx;
  height: 200rpx;
  background: var(--color-bg-card);
  border: 2rpx solid var(--color-border);
  border-radius: 20rpx;
  padding: 20rpx 16rpx;
  flex-shrink: 0;
}
.preset-card-hover { transform: scale(0.97); }
.preset-icon-wrap {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preset-title { font-size: 24rpx; font-weight: 600; color: var(--color-text); }
.preset-desc { font-size: 20rpx; color: var(--color-text-sub); }

.entry-grid {
  display: flex;
  gap: 16rpx;
  padding-bottom: 32rpx;
}
.entry-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: var(--color-bg-card);
  border: 2rpx solid var(--color-border);
  border-radius: 24rpx;
  padding: 28rpx 24rpx;
}
.entry-card-hover { transform: scale(0.98); }
.e-info { display: flex; flex-direction: column; }
.e-label { font-size: 28rpx; font-weight: 600; color: var(--color-text); }
.e-count { font-size: 22rpx; color: var(--color-text-sub); }

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 20rpx 32rpx 48rpx;
  font-size: 22rpx;
  color: var(--color-text-sub);
}
</style>
