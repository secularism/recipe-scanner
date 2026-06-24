import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'recipe-favorites'

function isValidIdArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every(i => typeof i === 'string')
}

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref<string[]>([])

  function load() {
    try {
      const raw = uni.getStorageSync(STORAGE_KEY)
      ids.value = isValidIdArray(raw) ? raw : []
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

  function remove(id: string): boolean {
    if (!isFavorite(id)) return false
    ids.value = ids.value.filter(x => x !== id)
    persist()
    return true
  }

  const count = computed(() => ids.value.length)

  return { ids, count, load, isFavorite, toggle, remove }
})
