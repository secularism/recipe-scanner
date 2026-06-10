import type { Cuisine, Taste } from '@/types'

export interface GeneratorDraft {
  i: string[]
  s: string[]
  ci: string[]
  cs: string[]
  cu: Cuisine | null
  t: Taste[]
}

export function hasDraftContent(draft: GeneratorDraft | null | undefined): boolean {
  if (!draft) return false
  return draft.i.length > 0
    || draft.s.length > 0
    || draft.ci.length > 0
    || draft.cs.length > 0
    || !!draft.cu
    || draft.t.length > 0
}

export function mergeRecentItems(existing: string[], latest: string[], max: number = 4): string[] {
  const seen = new Set<string>()
  const merged: string[] = []
  for (const raw of [...latest, ...existing]) {
    const value = raw.trim()
    if (!value || seen.has(value)) continue
    seen.add(value)
    merged.push(value)
    if (merged.length >= max) break
  }
  return merged
}
