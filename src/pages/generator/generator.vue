<script setup lang="ts">
import GeneratorSelectionSection from '@/components/generator-selection-section.vue'
import { useGeneratorForm } from '@/composables/use-generator-form'

const {
  allIngredients,
  allSeasonings,
  canSubmit,
  cuisineOptions,
  cuisineSummary,
  customIngredients,
  customSeasonings,
  dismissRestore,
  ingredientTagOptions,
  onSubmit,
  recentIngredients,
  recentSeasonings,
  restoreDraft,
  seasoningTagOptions,
  selectedCuisine,
  selectedIngredients,
  selectedSeasonings,
  selectedTastes,
  showRestoreBar,
  tasteOptions,
  tasteSummary,
  toggleCuisine,
  toggleTaste
} = useGeneratorForm()

function updateSelectedIngredients(value: string[]) {
  selectedIngredients.value = value
}

function updateCustomIngredients(value: string[]) {
  customIngredients.value = value
}

function updateSelectedSeasonings(value: string[]) {
  selectedSeasonings.value = value
}

function updateCustomSeasonings(value: string[]) {
  customSeasonings.value = value
}
</script>

<template>
  <view class="page">
    <view class="summary-bar">
      <view class="summary-item">
        <text>食材 </text>
        <text class="strong">{{ allIngredients.length }}</text>
      </view>
      <view class="summary-divider" />
      <view class="summary-item">
        <text>调味 </text>
        <text class="strong">{{ allSeasonings.length }}</text>
      </view>
      <view class="summary-divider" />
      <view class="summary-item">
        <text>菜系 </text>
        <text class="strong">{{ cuisineSummary }}</text>
      </view>
      <view class="summary-divider" />
      <view class="summary-item">
        <text>口味 </text>
        <text class="strong">{{ tasteSummary }}</text>
      </view>
    </view>

    <view v-if="showRestoreBar" class="restore-bar">
      <text class="restore-text">上次选到这里，继续吗</text>
      <view class="restore-actions">
        <view class="restore-btn" @tap="restoreDraft">
          <text>恢复</text>
        </view>
        <view class="dismiss-btn" @tap="dismissRestore">
          <uni-icons type="close" color="#8B5E3D" size="10" />
        </view>
      </view>
    </view>

    <GeneratorSelectionSection
      title="你有什么食材"
      icon="list"
      :options="ingredientTagOptions"
      :selected-values="selectedIngredients"
      :custom-values="customIngredients"
      :recent-items="recentIngredients"
      placeholder="添加自己的食材"
      @update:selected-values="updateSelectedIngredients"
      @update:custom-values="updateCustomIngredients"
    />

    <GeneratorSelectionSection
      title="你有什么调味料"
      icon="gear"
      :options="seasoningTagOptions"
      :selected-values="selectedSeasonings"
      :custom-values="customSeasonings"
      :recent-items="recentSeasonings"
      placeholder="添加你的调味料"
      @update:selected-values="updateSelectedSeasonings"
      @update:custom-values="updateCustomSeasonings"
    />

    <view class="section compact">
      <view class="section-title">
        <uni-icons type="map" color="#E8783B" size="15" />
        <text>想吃哪个菜系</text>
      </view>
      <view class="chip-row">
        <view
          v-for="opt in cuisineOptions"
          :key="opt.value"
          class="chip"
          :class="{ selected: selectedCuisine === opt.value }"
          @tap="toggleCuisine(opt.value)"
        >
          <text>{{ opt.label }}</text>
        </view>
      </view>
    </view>

    <view class="section compact">
      <view class="section-title">
        <uni-icons type="fire" color="#E8783B" size="15" />
        <text>想要什么口味</text>
      </view>
      <view class="chip-row">
        <view
          v-for="opt in tasteOptions"
          :key="opt.value"
          class="chip"
          :class="{ selected: selectedTastes.includes(opt.value as any) }"
          @tap="toggleTaste(opt.value)"
        >
          <text>{{ opt.label }}</text>
        </view>
      </view>
    </view>

    <view class="bottom-cta">
      <text class="btn-summary">
        已选 <text class="strong">{{ allIngredients.length }}</text> 个食材，
        <text class="strong">{{ allSeasonings.length }}</text> 个调味料
      </text>
      <view class="btn-generate" :class="{ disabled: !canSubmit }" @tap="onSubmit">
        <uni-icons type="paperplane" color="#fff" size="17" />
        <text>看看能做啥</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: var(--gradient-bg);
  padding-bottom: 188rpx;
}
.summary-bar {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 32rpx;
  background: var(--color-bg-card);
  border-bottom: 2rpx solid var(--color-border);
}
.summary-item {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 22rpx;
  color: var(--color-text-sub);
}
.strong {
  font-weight: 700;
  color: var(--color-primary);
}
.summary-divider {
  width: 2rpx;
  height: 28rpx;
  background: var(--color-border);
}
.restore-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12rpx 32rpx 0;
  padding: 14rpx 18rpx;
  border-radius: 16rpx;
  border: 2rpx dashed var(--color-primary-light);
  background: linear-gradient(135deg, #FFF8F0, #FFF0E0);
}
.restore-text {
  font-size: 22rpx;
  font-weight: 500;
  color: var(--color-text);
}
.restore-actions {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.restore-btn {
  padding: 6rpx 12rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: var(--color-primary);
}
.dismiss-btn {
  width: 28rpx;
  height: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.section {
  padding: 24rpx 32rpx;
  border-top: 2rpx solid var(--color-border);
}
.section.compact {
  padding-top: 20rpx;
  padding-bottom: 20rpx;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 14rpx;
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-text);
}
.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}
.chip {
  padding: 10rpx 22rpx;
  border-radius: var(--radius-pill);
  font-size: 22rpx;
  font-weight: 500;
  border: 2rpx solid var(--color-border);
  background: var(--color-bg-card);
  color: var(--color-text);
}
.chip:active { transform: scale(0.96); }
.chip.selected {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
.bottom-cta {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24rpx 32rpx 32rpx;
  background: linear-gradient(180deg, rgba(255, 246, 237, 0) 0%, var(--color-bg) 35%, var(--color-bg) 100%);
  z-index: 10;
}
.btn-summary {
  display: block;
  margin-bottom: 12rpx;
  text-align: center;
  font-size: 22rpx;
  color: var(--color-text-sub);
}
.btn-generate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  width: 100%;
  padding: 26rpx 0;
  background: var(--gradient-cta);
  color: #fff;
  border: none;
  border-radius: 32rpx;
  font-size: 30rpx;
  font-weight: 600;
  box-shadow: var(--shadow-cta);
}
.btn-generate:active { transform: scale(0.98); }
.btn-generate.disabled { opacity: 0.5; }
</style>
