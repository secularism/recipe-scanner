import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { HistoryItem, GenerateInput } from '@/types'

const STORAGE_KEY = 'recipe-history'
const MAX_ITEMS = 50

export const useHistoryStore = defineStore('history', () => {
  const list = ref<HistoryItem[]>([])

  function load() {
    try {
      const raw = uni.getStorageSync(STORAGE_KEY) as HistoryItem[] | null
      list.value = raw || []
    } catch {
      list.value = []
    }
  }

  function persist() {
    uni.setStorageSync(STORAGE_KEY, list.value)
  }

  function add(record: Omit<HistoryItem, 'id' | 'generatedAt'>) {
    const item: HistoryItem = {
      ...record,
      id: `h_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      generatedAt: Date.now()
    }
    list.value = [item, ...list.value].slice(0, MAX_ITEMS)
    persist()
  }

  function remove(id: string) {
    list.value = list.value.filter(x => x.id !== id)
    persist()
  }

  function clear() {
    list.value = []
    persist()
  }

  const sorted = computed(() => [...list.value].sort((a, b) => b.generatedAt - a.generatedAt))

  return { list: sorted, load, add, remove, clear }
})
