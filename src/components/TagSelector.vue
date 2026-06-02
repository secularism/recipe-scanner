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
}>(), { max: 0 })

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
  <view class="tags">
    <view
      v-for="opt in options"
      :key="opt.value"
      class="tag"
      :class="{ selected: isSelected(opt.value) }"
      @tap="toggle(opt.value)"
    >
      <text>{{ opt.label }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.tag {
  padding: 12rpx 24rpx;
  border-radius: var(--radius-pill);
  font-size: 26rpx;
  font-weight: 500;
  border: 2rpx solid var(--color-primary-light);
  background: var(--color-bg-card);
  color: var(--color-text);
}
.tag:active { transform: scale(0.96); }
.tag.selected {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
</style>
