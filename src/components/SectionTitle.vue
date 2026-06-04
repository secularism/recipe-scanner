<script setup lang="ts">
/**
 * SectionTitle - 区块标题
 * @param icon - uni-icons type
 * @param title - 标题文字
 * @param hint - 右侧次要文字
 */
withDefaults(defineProps<{
  icon?: string
  title: string
  hint?: string
}>(), { icon: '' })
</script>

<template>
  <view class="section-title">
    <view class="left">
      <uni-icons v-if="icon" :type="icon" color="#4A2D15" size="16" />
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
  margin-bottom: 20rpx;
}
.left { display: flex; align-items: center; gap: 12rpx; }
.title { font-size: 28rpx; font-weight: 700; color: var(--color-text); }
.hint { font-size: 22rpx; color: var(--color-text-sub); }
</style>
