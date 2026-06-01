<script setup lang="ts">
/**
 * EmptyState - 空状态占位
 */
defineProps<{
  emoji?: string
  title: string
  subtitle?: string
}>()
</script>

<template>
  <view class="empty">
    <text class="emoji">{{ emoji || '🥢' }}</text>
    <text class="title">{{ title }}</text>
    <text v-if="subtitle" class="subtitle">{{ subtitle }}</text>
  </view>
</template>

<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 32rpx;
  .emoji { font-size: 100rpx; }
  .title { font-size: 32rpx; color: var(--color-text); margin-top: 24rpx; }
  .subtitle { font-size: 26rpx; color: var(--color-text-sub); margin-top: 12rpx; text-align: center; }
}
</style>
