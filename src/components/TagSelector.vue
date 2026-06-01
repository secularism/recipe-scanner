<script setup lang="ts">
/**
 * TagSelector - 多选/单选标签选择器
 * @param options - 选项列表
 * @param modelValue - 已选项数组
 * @param max - 最多选几个（0=不限）
 */
interface Option { label: string; value: string }

const props = withDefaults(defineProps<{
  options: Option[]
  modelValue: string[]
  max?: number
  placeholder?: string
}>(), { max: 0, placeholder: '点击下方标签添加' })

const emit = defineEmits<{
  (e: 'update:modelValue', v: string[]): void
}>()

function isSelected(v: string) {
  return props.modelValue.includes(v)
}

function toggle(v: string) {
  if (isSelected(v)) {
    emit('update:modelValue', props.modelValue.filter(x => x !== v))
    return
  }
  if (props.max > 0 && props.modelValue.length >= props.max) {
    uni.showToast({ title: `最多选 ${props.max} 个`, icon: 'none' })
    return
  }
  emit('update:modelValue', [...props.modelValue, v])
}
</script>

<template>
  <view class="tag-selector">
    <view class="tags">
      <view
        v-for="opt in options"
        :key="opt.value"
        class="tag"
        :class="{ active: isSelected(opt.value) }"
        @tap="toggle(opt.value)"
      >
        <text>{{ opt.label }}</text>
      </view>
    </view>
    <view v-if="modelValue.length === 0" class="placeholder">
      <text>{{ placeholder }}</text>
    </view>
    <view v-else class="summary">
      <text>已选 {{ modelValue.length }} 项</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.tag-selector {
  width: 100%;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.tag {
  padding: 14rpx 28rpx;
  border-radius: var(--radius-pill);
  background: #fff;
  border: 2rpx solid var(--color-border);
  font-size: 26rpx;
  color: var(--color-text);
  transition: all 0.15s;
  &.active {
    background: var(--color-primary);
    color: #fff;
    border-color: var(--color-primary);
    box-shadow: var(--shadow-soft);
  }
}
.placeholder, .summary {
  margin-top: 16rpx;
  font-size: 24rpx;
  color: var(--color-text-sub);
}
</style>
