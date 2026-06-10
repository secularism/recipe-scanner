import { computed, onMounted, ref, watch } from 'vue'
import {
  CUISINE_LABELS,
  GENERATOR_DRAFT_KEY,
  INGREDIENT_GROUPS,
  RECENT_INGREDIENTS_KEY,
  RECENT_SEASONINGS_KEY,
  SEASONING_GROUPS,
  TASTE_LABELS
} from '@/data'
import type { Cuisine, GenerateInput, Taste } from '@/types'
import { hasDraftContent, mergeRecentItems, type GeneratorDraft } from '@/utils/generator-form'

export function useGeneratorForm() {
  const selectedIngredients = ref<string[]>([])
  const selectedSeasonings = ref<string[]>([])
  const customIngredients = ref<string[]>([])
  const customSeasonings = ref<string[]>([])
  const selectedCuisine = ref<Cuisine | null>(null)
  const selectedTastes = ref<Taste[]>([])
  const savedDraft = ref<GeneratorDraft | null>(null)
  const restoreDismissed = ref(false)
  const recentIngredients = ref<string[]>([])
  const recentSeasonings = ref<string[]>([])

  function readDraft() {
    try {
      const raw = uni.getStorageSync(GENERATOR_DRAFT_KEY) as GeneratorDraft | null
      savedDraft.value = raw && typeof raw === 'object' ? raw : null
    } catch {
      savedDraft.value = null
    }
  }

  function applyDraft(draft: GeneratorDraft) {
    selectedIngredients.value = Array.isArray(draft.i) ? draft.i : []
    selectedSeasonings.value = Array.isArray(draft.s) ? draft.s : []
    customIngredients.value = Array.isArray(draft.ci) ? draft.ci : []
    customSeasonings.value = Array.isArray(draft.cs) ? draft.cs : []
    selectedCuisine.value = draft.cu ?? null
    selectedTastes.value = Array.isArray(draft.t) ? draft.t : []
  }

  function saveDraft() {
    try {
      uni.setStorageSync(GENERATOR_DRAFT_KEY, {
        i: selectedIngredients.value,
        s: selectedSeasonings.value,
        ci: customIngredients.value,
        cs: customSeasonings.value,
        cu: selectedCuisine.value,
        t: selectedTastes.value
      })
    } catch { /* ignore */ }
  }

  function loadRecent() {
    try {
      const ingredients = uni.getStorageSync(RECENT_INGREDIENTS_KEY)
      const seasonings = uni.getStorageSync(RECENT_SEASONINGS_KEY)
      recentIngredients.value = Array.isArray(ingredients) ? ingredients.filter(item => typeof item === 'string') : []
      recentSeasonings.value = Array.isArray(seasonings) ? seasonings.filter(item => typeof item === 'string') : []
    } catch {
      recentIngredients.value = []
      recentSeasonings.value = []
    }
  }

  const allIngredients = computed(() => [...selectedIngredients.value, ...customIngredients.value])
  const allSeasonings = computed(() => [...selectedSeasonings.value, ...customSeasonings.value])

  function persistRecent() {
    try {
      uni.setStorageSync(RECENT_INGREDIENTS_KEY, mergeRecentItems(recentIngredients.value, allIngredients.value))
      uni.setStorageSync(RECENT_SEASONINGS_KEY, mergeRecentItems(recentSeasonings.value, allSeasonings.value))
      loadRecent()
    } catch { /* ignore */ }
  }

  function restoreDraft() {
    if (!savedDraft.value || !hasDraftContent(savedDraft.value)) return
    applyDraft(savedDraft.value)
    restoreDismissed.value = true
  }

  function dismissRestore() {
    restoreDismissed.value = true
  }

  function onSubmit() {
    if (allIngredients.value.length === 0 && allSeasonings.value.length === 0) {
      uni.showToast({ title: '至少选一个食材或调味料', icon: 'none' })
      return
    }
    persistRecent()
    const input: GenerateInput = {
      ingredients: allIngredients.value,
      seasonings: allSeasonings.value,
      cuisine: selectedCuisine.value,
      tastes: selectedTastes.value.length > 0 ? selectedTastes.value : undefined
    }
    const app = getApp()
    if (app?.globalData) app.globalData.pendingInput = input
    uni.navigateTo({ url: '/pages/result/result' })
  }

  function toggleCuisine(value: string) {
    selectedCuisine.value = selectedCuisine.value === value ? null : (value as Cuisine)
  }

  function toggleTaste(value: string) {
    const next = value as Taste
    selectedTastes.value = selectedTastes.value.includes(next)
      ? selectedTastes.value.filter(item => item !== next)
      : [...selectedTastes.value, next]
  }

  onMounted(() => {
    readDraft()
    loadRecent()
  })

  watch(
    [selectedIngredients, selectedSeasonings, customIngredients, customSeasonings, selectedCuisine, selectedTastes],
    saveDraft,
    { deep: true }
  )

  const hasSelections = computed(() =>
    allIngredients.value.length > 0
    || allSeasonings.value.length > 0
    || !!selectedCuisine.value
    || selectedTastes.value.length > 0
  )
  const canSubmit = computed(() => allIngredients.value.length > 0 || allSeasonings.value.length > 0)
  const showRestoreBar = computed(() => !restoreDismissed.value && !hasSelections.value && hasDraftContent(savedDraft.value))
  const cuisineSummary = computed(() => selectedCuisine.value ? CUISINE_LABELS[selectedCuisine.value] : '全部')
  const tasteSummary = computed(() => selectedTastes.value.length)
  const cuisineOptions = Object.entries(CUISINE_LABELS).map(([value, label]) => ({ value, label }))
  const tasteOptions = Object.entries(TASTE_LABELS).map(([value, label]) => ({ value, label }))
  const ingredientTagOptions = computed(() => INGREDIENT_GROUPS.flatMap(group => group.items.map(item => ({ value: item.name, label: item.name }))))
  const seasoningTagOptions = computed(() => SEASONING_GROUPS.flatMap(group => group.items.map(item => ({ value: item.name, label: item.name }))))

  return {
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
    toggleTaste,
    allIngredients,
    allSeasonings
  }
}
