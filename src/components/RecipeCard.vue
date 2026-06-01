<script setup lang="ts">
import type { MatchResult } from '@/types'
import { CUISINE_LABELS, TASTE_LABELS } from '@/data'

defineProps<{
  result: MatchResult
  showScore?: boolean
}>()

const emit = defineEmits<{
  (e: 'tap', r: MatchResult): void
}>()

function tap(result: MatchResult) {
  emit('tap', result)
}
</script>

<template>
  <view class="card recipe-card" @tap="tap(result)">
    <view class="head">
      <view class="title-row">
        <text class="name">{{ result.recipe.name }}</text>
        <text v-if="showScore" class="score">契合 {{ result.coverage }}%</text>
      </view>
      <text class="desc">{{ result.recipe.shortDesc }}</text>
      <view class="meta">
        <text class="meta-tag">{{ CUISINE_LABELS[result.recipe.cuisine] }}</text>
        <text class="meta-tag">{{ result.recipe.cookTime }}分钟</text>
        <text v-for="t in result.recipe.taste" :key="t" class="meta-tag taste">
          {{ TASTE_LABELS[t] }}
        </text>
      </view>
    </view>
    <view v-if="result.missingIngredients.length > 0" class="missing">
      <text class="missing-label">还差：</text>
      <text class="missing-text">{{ result.missingIngredients.join('、') }}</text>
    </view>
    <view v-else class="ready">
      <text>🎉 食材齐全！</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.recipe-card {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: -8rpx;
    left: 32rpx;
    width: 120rpx;
    height: 24rpx;
    background: var(--color-secondary);
    opacity: 0.4;
    transform: rotate(-2deg);
    border-radius: 4rpx;
  }
}
.head {
  border-bottom: 1rpx dashed var(--color-border);
  padding-bottom: 20rpx;
  margin-bottom: 20rpx;
}
.title-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  .name { font-size: 36rpx; font-weight: 700; color: var(--color-text); }
  .score { font-size: 26rpx; color: var(--color-primary); font-weight: 600; }
}
.desc {
  display: block;
  font-size: 26rpx;
  color: var(--color-text-sub);
  margin-top: 8rpx;
  line-height: 1.5;
}
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 16rpx;
}
.meta-tag {
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  background: var(--color-secondary);
  color: var(--color-text);
  border-radius: var(--radius-pill);
  &.taste {
    background: var(--color-primary);
    color: #fff;
  }
}
.missing {
  font-size: 24rpx;
  color: var(--color-text-sub);
  .missing-label { color: var(--color-text); font-weight: 600; margin-right: 8rpx; }
}
.ready {
  font-size: 26rpx;
  color: var(--color-success);
  font-weight: 600;
}
</style>
