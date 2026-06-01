import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { findRecipeById } from '@/data'
import type { Recipe } from '@/types'

const STORAGE_KEY = 'recipe-favorites'

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<string[]>([])

  function load() {
    try {
      const raw = uni.getStorageSync(STORAGE_KEY) as string[] | null
      ids.value = raw || []
    } catch {
      ids.value = []
    }
  }

  function persist() {
    uni.setStorageSync(STORAGE_KEY, ids.value)
  }

  function isFavorite(id: string): boolean {
    return ids.value.includes(id)
  }

  function toggle(id: string): boolean {
    if (isFavorite(id)) {
      ids.value = ids.value.filter(x => x !== id)
    } else {
      ids.value = [...ids.value, id]
    }
    persist()
    return isFavorite(id)
  }

  const list = computed<Recipe[]>(() => {
    return ids.value
      .map(id => findRecipeById(id))
      .filter((r): r is Recipe => r !== undefined)
  })

  return { ids, list, load, isFavorite, toggle }
})
