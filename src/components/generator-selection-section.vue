<script setup lang="ts">
import { computed, ref } from 'vue'

interface Option {
  label: string
  value: string
}

const props = defineProps<{
  title: string
  icon: string
  options: Option[]
  selectedValues: string[]
  customValues: string[]
  recentItems?: string[]
  placeholder: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedValues', v: string[]): void
  (e: 'update:customValues', v: string[]): void
}>()

const inputValue = ref('')

const optionSet = computed(() => new Set(props.options.map(item => item.value)))
const mergedSelected = computed(() => [
  ...props.selectedValues.map(value => ({ value, source: 'selected' as const })),
  ...props.customValues.map(value => ({ value, source: 'custom' as const }))
])

function toggleOption(value: string) {
  if (props.selectedValues.includes(value)) {
    emit('update:selectedValues', props.selectedValues.filter(item => item !== value))
    return
  }
  emit('update:selectedValues', [...props.selectedValues, value])
}

function addCustom(value: string) {
  const next = value.trim()
  if (!next) return
  if (optionSet.value.has(next)) {
    if (!props.selectedValues.includes(next)) {
      emit('update:selectedValues', [...props.selectedValues, next])
    }
    inputValue.value = ''
    return
  }
  if (!props.customValues.includes(next)) {
    emit('update:customValues', [...props.customValues, next])
  }
  inputValue.value = ''
}

function removeChip(value: string, source: 'selected' | 'custom') {
  if (source === 'selected') {
    emit('update:selectedValues', props.selectedValues.filter(item => item !== value))
    return
  }
  emit('update:customValues', props.customValues.filter(item => item !== value))
}

function clearAll() {
  emit('update:selectedValues', [])
  emit('update:customValues', [])
}

function useRecent(value: string) {
  if (optionSet.value.has(value)) {
    if (!props.selectedValues.includes(value)) {
      emit('update:selectedValues', [...props.selectedValues, value])
    }
    return
  }
  if (!props.customValues.includes(value)) {
    emit('update:customValues', [...props.customValues, value])
  }
}
</script>

<template>
  <view class="section">
    <view class="section-header">
      <view class="section-title">
        <uni-icons :type="icon" color="#E8783B" size="15" />
        <text>{{ title }}</text>
      </view>
      <view class="btn-clear" @tap="clearAll">
        <text>重新选</text>
      </view>
    </view>

    <view v-if="recentItems && recentItems.length > 0" class="recent-row">
      <text class="recent-label">最近</text>
      <view
        v-for="item in recentItems"
        :key="item"
        class="recent-chip"
        @tap="useRecent(item)"
      >
        <text>{{ item }}</text>
      </view>
    </view>

    <view class="tag-cloud">
      <view
        v-for="option in options"
        :key="option.value"
        class="tag"
        :class="{ selected: selectedValues.includes(option.value) }"
        @tap="toggleOption(option.value)"
      >
        <text>{{ option.label }}</text>
      </view>
    </view>

    <view v-if="mergedSelected.length > 0" class="selected-row">
      <view
        v-for="item in mergedSelected"
        :key="item.source + item.value"
        class="selected-chip"
      >
        <text>{{ item.value }}</text>
        <view class="rm" @tap.stop="removeChip(item.value, item.source)">
          <uni-icons type="close" color="#4A2D15" size="9" />
        </view>
      </view>
    </view>

    <view class="chip-input-wrap">
      <input
        v-model="inputValue"
        class="chip-input"
        :placeholder="placeholder"
        confirm-type="done"
        @confirm="addCustom(inputValue)"
      />
      <view class="btn-add" @tap="addCustom(inputValue)">
        <text>+</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.section {
  padding: 24rpx 32rpx;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-text);
}
.btn-clear {
  padding: 4rpx 16rpx;
  border-radius: 12rpx;
  border: 2rpx solid var(--color-border);
  font-size: 22rpx;
  color: var(--color-text-sub);
  opacity: 0.72;
}
.recent-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 16rpx;
  overflow-x: auto;
  white-space: nowrap;
}
.recent-label {
  flex-shrink: 0;
  font-size: 20rpx;
  color: var(--color-text-sub);
  opacity: 0.65;
}
.recent-chip {
  flex-shrink: 0;
  padding: 6rpx 16rpx;
  border-radius: var(--radius-pill);
  background: var(--color-bg-card);
  border: 2rpx solid var(--color-border);
  font-size: 20rpx;
  color: var(--color-text-sub);
}
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}
.tag {
  padding: 8rpx 20rpx;
  border-radius: var(--radius-pill);
  border: 2rpx solid var(--color-border);
  background: var(--color-bg-card);
  font-size: 22rpx;
  font-weight: 500;
  color: var(--color-text);
}
.tag:active,
.recent-chip:active,
.btn-clear:active,
.btn-add:active {
  transform: scale(0.98);
}
.tag.selected {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: #fff;
}
.selected-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: 12rpx;
}
.selected-chip {
  display: inline-flex;
  align-items: center;
  gap: 4rpx;
  padding: 6rpx 12rpx 6rpx 18rpx;
  border-radius: var(--radius-pill);
  background: var(--color-primary-light);
  font-size: 20rpx;
  font-weight: 500;
  color: var(--color-text);
}
.rm {
  width: 24rpx;
  height: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chip-input-wrap {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 16rpx;
}
.chip-input {
  flex: 1;
  height: 56rpx;
  padding: 0 20rpx;
  border-radius: 16rpx;
  border: 2rpx solid var(--color-border);
  background: var(--color-bg-card);
  font-size: 22rpx;
  color: var(--color-text);
}
.btn-add {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  border: 2rpx solid var(--color-primary);
  background: var(--color-bg-card);
  font-size: 30rpx;
  font-weight: 600;
  color: var(--color-primary);
}
</style>
