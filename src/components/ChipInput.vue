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
        <view class="x" @tap.stop="remove(idx)">
          <uni-icons type="close" color="#8B5E3D" size="11" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.input-row {
  display: flex;
  gap: 12rpx;
  align-items: center;
}
.input {
  flex: 1;
  height: 64rpx;
  padding: 0 24rpx;
  border-radius: 16rpx;
  border: 2rpx solid var(--color-border);
  background: var(--color-bg-card);
  font-size: 26rpx;
  color: var(--color-text);
}
.input:focus { border-color: var(--color-primary); }
.add-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  border: 2rpx solid var(--color-primary);
  background: var(--color-bg-card);
  color: var(--color-primary);
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
.add-btn:active {
  background: var(--color-primary);
  color: #fff;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: 12rpx;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6rpx;
  padding: 6rpx 16rpx 6rpx 20rpx;
  border-radius: var(--radius-pill);
  background: var(--color-primary-light);
  font-size: 22rpx;
  color: var(--color-text);
  font-weight: 500;
}
.x {
  width: 28rpx;
  height: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
