<script setup lang="ts">
/**
 * EmptyState - 空状态占位
 * @param icon - uni-icons type（可选）
 * @param title - 标题文字
 * @param subtitle - 副标题文字
 */
withDefaults(defineProps<{
  icon?: string
  title: string
  subtitle?: string
}>(), { icon: '' })
</script>

<template>
  <view class="empty">
    <view v-if="icon" class="icon-wrap">
      <uni-icons :type="icon" color="#E8783B" size="80" />
    </view>
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
}
.icon-wrap {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
}
.title {
  font-size: 32rpx;
  color: var(--color-text);
  margin-top: 24rpx;
  font-weight: 600;
}
.subtitle {
  font-size: 26rpx;
  color: var(--color-text-sub);
  margin-top: 12rpx;
  text-align: center;
}
</style>
