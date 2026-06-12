import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { HistoryItem } from '@/types'

const STORAGE_KEY = 'recipe-history'
const MAX_ITEMS = 50

function isValidItem(x: unknown): x is HistoryItem {
  return !!x && typeof x === 'object'
    && typeof (x as any).id === 'string'
    && typeof (x as any).recipeId === 'string'
    && typeof (x as any).recipeName === 'string'
    && typeof (x as any).generatedAt === 'number'
}

export const useHistoryStore = defineStore('history', () => {
  const list = ref<HistoryItem[]>([])

  function load() {
    try {
      const raw = uni.getStorageSync(STORAGE_KEY)
      if (Array.isArray(raw)) {
        list.value = raw.filter(isValidItem)
      } else {
        list.value = []
      }
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

  /** 按 recipeId+input 查重，3 秒内同输入不重复入库（防 result 页反复进出） */
  function addIfFresh(record: Omit<HistoryItem, 'id' | 'generatedAt'>) {
    const sig = JSON.stringify([...record.input.ingredients, ...record.input.seasonings].sort())
    const now = Date.now()
    const recent = list.value.find(x => {
      if (now - x.generatedAt > 3000) return false
      const xs = JSON.stringify([...x.input.ingredients, ...x.input.seasonings].sort())
      return xs === sig
    })
    if (!recent) add(record)
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

  return { list: sorted, load, add, addIfFresh, remove, clear }
})
