<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Recipe } from '@/types'
import { findRecipeById, CUISINE_LABELS, TASTE_LABELS, DIFFICULTY_LABELS } from '@/data'
import { useFavoritesStore } from '@/stores/favorites'
import { onLoad } from '@dcloudio/uni-app'

const favStore = useFavoritesStore()
const recipe = ref<Recipe | null>(null)

onLoad((q) => {
  const id = (q?.id as string) || ''
  const r = findRecipeById(id)
  if (r) {
    recipe.value = r
    favStore.load()
  } else {
    uni.showToast({ title: '菜谱不存在', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 800)
  }
})

const isFav = computed(() => recipe.value ? favStore.isFavorite(recipe.value.id) : false)

function onFav() {
  if (!recipe.value) return
  const nowFav = favStore.toggle(recipe.value.id)
  uni.showToast({ title: nowFav ? '已收藏' : '已取消', icon: 'none' })
}

function onShare() {
  // 微信小程序分享 — phase 4 完善 onShareAppMessage
  uni.showToast({ title: '点击右上角分享', icon: 'none' })
}
</script>

<template>
  <view v-if="recipe" class="page">
    <view class="hero">
      <text class="name">{{ recipe.name }}</text>
      <text class="desc">{{ recipe.shortDesc }}</text>
      <view class="meta">
        <view class="meta-item">
          <text class="meta-num">{{ recipe.cookTime }}</text>
          <text class="meta-label">分钟</text>
        </view>
        <view class="meta-item">
          <text class="meta-num">{{ DIFFICULTY_LABELS[recipe.difficulty] }}</text>
          <text class="meta-label">难度</text>
        </view>
        <view class="meta-item">
          <text class="meta-num">{{ CUISINE_LABELS[recipe.cuisine] }}</text>
          <text class="meta-label">菜系</text>
        </view>
      </view>
      <view class="tastes">
        <text v-for="t in recipe.taste" :key="t" class="taste-chip">
          {{ TASTE_LABELS[t] }}
        </text>
      </view>
    </view>

    <view class="card">
      <view class="card-title">
        <text>🥘 所需食材</text>
      </view>
      <view class="tags">
        <text v-for="ing in recipe.ingredients" :key="ing" class="tag ing">{{ ing }}</text>
      </view>
    </view>

    <view class="card">
      <view class="card-title">
        <text>🧂 所需调味料</text>
      </view>
      <view class="tags">
        <text v-for="s in recipe.seasonings" :key="s" class="tag sea">{{ s }}</text>
      </view>
    </view>

    <view class="card">
      <view class="card-title">
        <text>📝 制作步骤</text>
      </view>
      <view class="steps">
        <view v-for="step in recipe.steps" :key="step.order" class="step">
          <view class="step-num">
            <text>{{ step.order }}</text>
          </view>
          <text class="step-text">{{ step.text }}</text>
        </view>
      </view>
    </view>

    <view class="actions">
      <view class="btn-ghost" @tap="onShare">
        <text>📤 分享</text>
      </view>
      <view class="btn-primary" :class="{ active: isFav }" @tap="onFav">
        <text>{{ isFav ? '★ 已收藏' : '☆ 收藏' }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 32rpx 32rpx 200rpx;
  background: var(--color-bg);
}
.hero {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 40rpx 32rpx;
  text-align: center;
  margin-bottom: 24rpx;
  box-shadow: var(--shadow-card);
  .name { font-size: 48rpx; font-weight: 800; color: var(--color-text); display: block; }
  .desc { font-size: 26rpx; color: var(--color-text-sub); display: block; margin-top: 12rpx; }
}
.meta {
  display: flex;
  justify-content: space-around;
  margin-top: 32rpx;
}
.meta-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  .meta-num { font-size: 32rpx; font-weight: 700; color: var(--color-primary); }
  .meta-label { font-size: 22rpx; color: var(--color-text-sub); margin-top: 4rpx; }
}
.tastes {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  margin-top: 24rpx;
}
.taste-chip {
  padding: 4rpx 20rpx;
  background: var(--color-secondary);
  color: var(--color-text);
  border-radius: var(--radius-pill);
  font-size: 22rpx;
}
.card {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: var(--shadow-card);
}
.card-title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 20rpx;
  display: block;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.tag {
  padding: 8rpx 20rpx;
  border-radius: var(--radius-pill);
  font-size: 26rpx;
  &.ing { background: var(--color-secondary); color: var(--color-text); }
  &.sea { background: #fff5e6; color: var(--color-primary); border: 2rpx solid var(--color-primary-light); }
}
.steps { display: flex; flex-direction: column; gap: 24rpx; }
.step {
  display: flex;
  gap: 20rpx;
  align-items: flex-start;
}
.step-num {
  flex-shrink: 0;
  width: 48rpx;
  height: 48rpx;
  background: var(--color-primary);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 700;
}
.step-text {
  flex: 1;
  font-size: 28rpx;
  color: var(--color-text);
  line-height: 1.6;
  padding-top: 4rpx;
}
.actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  background: rgba(255, 247, 235, 0.96);
  backdrop-filter: blur(8rpx);
  border-top: 2rpx solid var(--color-border);
}
.btn-ghost, .btn-primary {
  flex: 1;
  padding: 24rpx 0;
  text-align: center;
  border-radius: var(--radius-pill);
  font-size: 30rpx;
  font-weight: 600;
}
.btn-ghost {
  background: #fff;
  color: var(--color-text);
  border: 2rpx solid var(--color-border);
}
.btn-primary {
  background: var(--color-primary);
  color: #fff;
  box-shadow: var(--shadow-soft);
  &.active { background: var(--color-success); }
}
</style>
