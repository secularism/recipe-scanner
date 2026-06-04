<script setup lang="ts">
/**
 * RecipeCard - 菜谱卡片
 * @param result - 匹配结果
 * @param showScore - 是否显示契合度
 * @param variant - 'large' 大卡（首推） / 'small' 小卡（次推）
 */
defineProps<{
  result: import('@/types').MatchResult
  showScore?: boolean
  variant?: 'large' | 'small'
}>()

const emit = defineEmits<{
  (e: 'tap', r: import('@/types').MatchResult): void
}>()

function tap(r: import('@/types').MatchResult) {
  emit('tap', r)
}
</script>

<template>
  <view
    class="recipe-card"
    :class="[variant === 'large' ? 'large' : 'small', showScore ? '' : 'no-score']"
    hover-class="recipe-card-hover"
    @tap="tap(result)"
  >
    <view class="header">
      <text class="name">{{ result.recipe.name }}</text>
      <text v-if="showScore" class="match">契合 {{ result.coverage }}%</text>
    </view>
    <view class="chips">
      <text class="chip">{{ result.recipe.cuisine }}</text>
      <text class="chip accent">{{ result.recipe.cookTime }}分钟</text>
      <text v-for="t in result.recipe.taste" :key="t" class="chip accent">{{ t }}</text>
    </view>
    <view v-if="result.missingIngredients.length > 0" class="missing">
      <view class="missing-label">
        <uni-icons type="minus" color="#E8A83A" size="12" />
        <text>还差</text>
      </view>
      <view class="missing-tags">
        <text v-for="m in result.missingIngredients" :key="m" class="missing-tag">{{ m }}</text>
      </view>
    </view>
    <view v-else class="ready">
      <uni-icons type="checkmarkempty" color="#6AAF6F" size="14" />
      <text>食材齐全</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.recipe-card {
  background: var(--gradient-card);
  border: 2rpx solid var(--color-border);
  border-radius: 28rpx;
  padding: 28rpx;
  margin: 0 32rpx 16rpx;
  box-shadow: var(--shadow-card);
}
.recipe-card-hover { transform: scale(0.98); }
.large { padding: 28rpx; }
.small { padding: 24rpx; }
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}
.name {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--color-text);
}
.small .name { font-size: 30rpx; }
.match {
  font-size: 32rpx;
  font-weight: 800;
  color: var(--color-primary);
  white-space: nowrap;
  flex-shrink: 0;
}
.small .match { font-size: 28rpx; }
.chips {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
  margin-bottom: 16rpx;
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
.missing-label {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 22rpx;
  color: var(--color-warn);
  font-weight: 600;
  margin-bottom: 8rpx;
}
.missing-tags {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
}
.missing-tag {
  padding: 4rpx 16rpx;
  border-radius: var(--radius-pill);
  font-size: 20rpx;
  font-weight: 500;
  background: #FFF3DC;
  color: var(--color-warn);
  border: 2rpx solid var(--color-warn);
}
.ready {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: var(--color-success);
  font-weight: 600;
}
</style>
