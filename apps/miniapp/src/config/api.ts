export const API_BASE_URL = 'http://47.96.36.31/api'

export function joinApiUrl(path: string, baseUrl: string = API_BASE_URL): string {
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedPath = path.replace(/^\/+/, '')
  return `${normalizedBase}/${normalizedPath}`
}
