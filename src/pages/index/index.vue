<script setup lang="ts">
import { ref } from 'vue'

const recipes = ref<unknown[]>([])
</script>

<template>
  <view class="index">
    <view class="hero">
      <text class="emoji">🍳</text>
      <text class="title">今天吃什么？</text>
      <text class="subtitle">输入食材，让我帮你想想</text>
    </view>
    <view class="actions">
      <navigator url="/pages/generator/generator" class="btn btn-primary">
        开始生成
      </navigator>
      <view class="row">
        <navigator url="/pages/favorites/favorites" class="btn btn-ghost">
          收藏
        </navigator>
        <navigator url="/pages/history/history" class="btn btn-ghost">
          历史
        </navigator>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.index {
  min-height: 100vh;
  padding: 80rpx 48rpx;
}
.hero {
  text-align: center;
  margin-bottom: 80rpx;
  .emoji { font-size: 120rpx; display: block; }
  .title { font-size: 56rpx; font-weight: 700; display: block; margin-top: 24rpx; }
  .subtitle { font-size: 28rpx; color: var(--color-text-sub); display: block; margin-top: 12rpx; }
}
.actions {
  .row { display: flex; gap: 24rpx; margin-top: 24rpx; }
  .row .btn { flex: 1; }
}
.btn {
  display: block;
  text-align: center;
  padding: 28rpx 0;
  border-radius: var(--radius-pill);
  font-size: 32rpx;
  font-weight: 600;
  &-primary {
    background: var(--color-primary);
    color: #fff;
    box-shadow: var(--shadow-soft);
  }
  &-ghost {
    background: #fff;
    color: var(--color-text);
    border: 2rpx solid var(--color-border);
  }
}
</style>
