<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { useHistoryStore } from '@/stores/history'
import { CUISINE_LABELS } from '@/data'

const histStore = useHistoryStore()

onShow(() => histStore.load())

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  return new Date(ts).toLocaleDateString('zh-CN')
}

function openDetail(id: string) {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
}

function remove(id: string) {
  uni.showModal({
    title: '确认删除',
    content: '这条记录会被删除',
    success: (res) => {
      if (res.confirm) histStore.remove(id)
    }
  })
}

function clearAll() {
  uni.showModal({
    title: '清空所有历史',
    content: '此操作不可恢复',
    success: (res) => {
      if (res.confirm) histStore.clear()
    }
  })
}
</script>

<template>
  <view class="page">
    <view v-if="histStore.list.length > 0" class="toolbar">
      <text class="count">共 {{ histStore.list.length }} 条</text>
      <text class="clear" @tap="clearAll">清空</text>
    </view>
    <EmptyState
      v-if="histStore.list.length === 0"
      emoji="📜"
      title="还没有历史记录"
      subtitle="生成菜谱后会自动留痕"
    />
    <view v-else class="list">
      <view
        v-for="item in histStore.list"
        :key="item.id"
        class="card row"
      >
        <view class="left" @tap="openDetail(item.recipeId)">
          <text class="name">{{ item.recipeName }}</text>
          <text class="meta">
            {{ item.input.ingredients.length + item.input.seasonings.length }} 项 ·
            {{ item.input.cuisine ? CUISINE_LABELS[item.input.cuisine] : '不挑菜系' }}
          </text>
          <text class="time">{{ timeAgo(item.generatedAt) }}</text>
        </view>
        <text class="del" @tap="remove(item.id)">×</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page { min-height: 100vh; padding: 32rpx; }
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  padding: 0 8rpx;
  .count { font-size: 26rpx; color: var(--color-text-sub); }
  .clear { font-size: 26rpx; color: var(--color-danger); }
}
.list { display: flex; flex-direction: column; gap: 16rpx; }
.row {
  display: flex;
  align-items: center;
  padding: 24rpx;
}
.left { flex: 1; display: flex; flex-direction: column; gap: 6rpx; }
.name { font-size: 30rpx; font-weight: 600; color: var(--color-text); }
.meta { font-size: 22rpx; color: var(--color-text-sub); }
.time { font-size: 22rpx; color: var(--color-primary); }
.del {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: var(--color-text-sub);
  line-height: 1;
}
</style>
