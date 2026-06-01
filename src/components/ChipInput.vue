<script setup lang="ts">
import { ref } from 'vue'

/**
 * ChipInput - 自定义项输入
 * 输完按回车/点 + 添加为 chip
 */
const props = withDefaults(defineProps<{
  modelValue: string[]
  placeholder?: string
  max?: number
}>(), { placeholder: '输入后按回车添加', max: 20 })

const emit = defineEmits<{
  (e: 'update:modelValue', v: string[]): void
}>()

const inputValue = ref('')

function commit() {
  const v = inputValue.value.trim()
  if (!v) return
  if (props.modelValue.includes(v)) {
    uni.showToast({ title: '已存在', icon: 'none' })
    inputValue.value = ''
    return
  }
  if (props.modelValue.length >= props.max) {
    uni.showToast({ title: `最多 ${props.max} 个`, icon: 'none' })
    return
  }
  emit('update:modelValue', [...props.modelValue, v])
  inputValue.value = ''
}

function remove(idx: number) {
  const next = [...props.modelValue]
  next.splice(idx, 1)
  emit('update:modelValue', next)
}
</script>

<template>
  <view class="chip-input">
    <view class="input-row">
      <input
        v-model="inputValue"
        class="input"
        :placeholder="placeholder"
        confirm-type="done"
        @confirm="commit"
      />
      <view class="add-btn" @tap="commit">
        <text>+</text>
      </view>
    </view>
    <view v-if="modelValue.length > 0" class="chips">
      <view
        v-for="(item, idx) in modelValue"
        :key="item + idx"
        class="chip"
      >
        <text>{{ item }}</text>
        <text class="x" @tap.stop="remove(idx)">×</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.input-row {
  display: flex;
  gap: 16rpx;
  align-items: center;
}
.input {
  flex: 1;
  height: 80rpx;
  padding: 0 24rpx;
  background: #fff;
  border: 2rpx solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 28rpx;
}
.add-btn {
  width: 80rpx;
  height: 80rpx;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  font-weight: 300;
  line-height: 1;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 20rpx;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 20rpx;
  background: var(--color-secondary);
  color: var(--color-text);
  border-radius: var(--radius-pill);
  font-size: 26rpx;
  .x {
    color: var(--color-text-sub);
    font-size: 32rpx;
    line-height: 1;
    padding: 0 4rpx;
  }
}
</style>
