<script setup lang="ts">
/**
 * SectionTitle - 区块标题
 */
defineProps<{
  title: string
  emoji?: string
  hint?: string
}>()
</script>

<template>
  <view class="section-title">
    <view class="left">
      <text v-if="emoji" class="emoji">{{ emoji }}</text>
      <text class="title">{{ title }}</text>
    </view>
    <text v-if="hint" class="hint">{{ hint }}</text>
  </view>
</template>

<style lang="scss" scoped>
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 40rpx 0 20rpx;
}
.left { display: flex; align-items: center; gap: 12rpx; }
.emoji { font-size: 36rpx; }
.title { font-size: 32rpx; font-weight: 700; color: var(--color-text); }
.hint { font-size: 24rpx; color: var(--color-text-sub); }
</style>
