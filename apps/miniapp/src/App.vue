<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useFavoritesStore } from '@/stores/favorites'
import { useHistoryStore } from '@/stores/history'

onLaunch(() => {
  // 全量加载持久化数据
  useFavoritesStore().load()
  useHistoryStore().load()
  // 预留给分享传参
  // @ts-ignore
  if (typeof getApp === 'function') {
    const app = getApp()
    if (app && !app.globalData) app.globalData = {}
  }
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
/* global styles in uni.scss */
</style>
