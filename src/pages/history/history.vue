<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useHistoryStore } from '@/stores/history'
import type { HistoryItem } from '@/types'

const histStore = useHistoryStore()

onShow(() => histStore.load())

interface Group {
  label: string
  items: HistoryItem[]
}

const grouped = computed<Group[]>(() => {
  const groups = new Map<string, HistoryItem[]>()
  for (const item of histStore.list) {
    const d = new Date(item.generatedAt)
    const today = new Date()
    const diffDay = Math.floor((today.getTime() - d.getTime()) / 86_400_000)
    let label: string
    if (diffDay === 0) label = '今天'
    else if (diffDay === 1) label = '昨天'
    else label = `${d.getMonth() + 1}月${d.getDate()}日`
    if (!groups.has(label)) groups.set(label, [])
    groups.get(label)!.push(item)
  }
  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }))
})

function timeOf(ts: number): string {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function openDetail(id: string) {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
}

function remove(id: string) {
  uni.showModal({
    title: '确认删除',
    content: '这条记录会被删除',
    success: (res) => { if (res.confirm) histStore.remove(id) }
  })
}

function clearAll() {
  uni.showModal({
    title: '清空所有历史',
    content: '此操作不可恢复',
    success: (res) => { if (res.confirm) histStore.clear() }
  })
}
</script>

<template>
  <view class="page">
    <view v-if="histStore.list.length === 0" class="empty">
      <EmptyState
        icon="list"
        title="还没有历史记录"
        subtitle="你生成的菜谱会出现在这里"
      />
    </view>
    <view v-else>
      <view class="header-row">
        <view class="header-title">
          <uni-icons type="list" color="#4A2D15" size="15" />
          <text>历史记录 · <text class="count">{{ histStore.list.length }} 条</text></text>
        </view>
      </view>
      <view class="timeline">
        <view v-for="g in grouped" :key="g.label" class="date-group">
          <text class="date-label">{{ g.label }}</text>
          <view
            v-for="item in g.items"
            :key="item.id"
            class="history-item"
            hover-class="history-item-hover"
            @tap="openDetail(item.recipeId)"
          >
            <view class="item-info">
              <text class="item-name">{{ item.recipeName }}</text>
              <view class="item-meta">
                <text class="time">{{ timeOf(item.generatedAt) }}</text>
                <text v-if="item.missingCount && item.missingCount > 0" class="missing">
                  缺 {{ item.missingCount }} 项
                </text>
                <text v-else class="ready">食材齐全</text>
              </view>
            </view>
            <view class="arrow-wrap" @tap.stop="remove(item.id)">
              <uni-icons type="close" color="#8B5E3D" size="16" />
            </view>
          </view>
        </view>
      </view>
      <view class="clear-wrap">
        <view class="btn-clear" @tap="clearAll">
          <uni-icons type="trash" color="#D9706A" size="13" />
          <text>清空全部</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: var(--gradient-bg);
  padding-bottom: 40rpx;
}
.empty { padding-top: 80rpx; }
.header-row {
  padding: 24rpx 32rpx 16rpx;
  border-bottom: 2rpx solid var(--color-border);
  background: var(--color-bg-card);
}
.header-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--color-text);
}
.count { color: var(--color-primary); font-weight: 700; }
.timeline { padding: 16rpx 32rpx; }
.date-group { margin-bottom: 16rpx; }
.date-label {
  display: block;
  font-size: 24rpx;
  font-weight: 600;
  color: var(--color-text-sub);
  padding: 12rpx 0 8rpx;
  position: sticky;
  top: 0;
  background: var(--color-bg);
  z-index: 1;
}
.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  margin-bottom: 8rpx;
  background: var(--gradient-card);
  border: 2rpx solid var(--color-border);
  border-radius: 20rpx;
}
.history-item-hover { transform: scale(0.98); }
.item-info { flex: 1; min-width: 0; }
.item-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4rpx;
}
.item-meta {
  display: flex;
  gap: 12rpx;
  font-size: 22rpx;
  color: var(--color-text-sub);
}
.missing { color: var(--color-warn); }
.ready { color: var(--color-success); }
.arrow-wrap {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16rpx;
  flex-shrink: 0;
}
.clear-wrap {
  text-align: center;
  padding: 32rpx 0;
}
.btn-clear {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 40rpx;
  border-radius: var(--radius-pill);
  border: 2rpx solid var(--color-danger);
  background: var(--color-bg-card);
  color: var(--color-danger);
  font-size: 24rpx;
  font-weight: 500;
}
.btn-clear:active { background: #FEF2F2; }
</style>
