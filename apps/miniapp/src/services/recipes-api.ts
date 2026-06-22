import { API_BASE_URL, joinApiUrl } from '../config/api'
import { mapRecipeDtosToRecipes, type RecipeFullDto } from './recipe-mapper'

export interface RecipesRequestSuccess {
  statusCode: number
  data: unknown
}

export interface RecipesRequestOptions {
  url: string
  method: 'GET'
  success: (response: RecipesRequestSuccess) => void
  fail: (error: unknown) => void
}

export type RecipesRequest = (options: RecipesRequestOptions) => void

export interface RecipesApiClientOptions {
  baseUrl?: string
  request?: RecipesRequest
}

export class RecipesApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RecipesApiError'
  }
}

export function createRecipesApiClient(options: RecipesApiClientOptions = {}) {
  const baseUrl = options.baseUrl ?? API_BASE_URL
  const request = options.request ?? defaultRequest

  return {
    async fetchMatchReadyRecipes() {
      const data = await requestJson('recipes?include=matchFields', baseUrl, request)

      if (!Array.isArray(data)) {
        throw new RecipesApiError('Recipes API returned non-array data')
      }

      try {
        return mapRecipeDtosToRecipes(data as RecipeFullDto[])
      } catch (error) {
        throw new RecipesApiError(
          error instanceof Error ? error.message : 'Recipes API mapping failed'
        )
      }
    }
  }
}

export const recipesApi = createRecipesApiClient()

function requestJson(path: string, baseUrl: string, request: RecipesRequest) {
  return new Promise<unknown>((resolve, reject) => {
    request({
      url: joinApiUrl(path, baseUrl),
      method: 'GET',
      success: (response) => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new RecipesApiError(`Recipes API failed with status ${response.statusCode}`))
          return
        }
        resolve(response.data)
      },
      fail: (error) => {
        reject(new RecipesApiError(error instanceof Error ? error.message : 'Recipes API request failed'))
      }
    })
  })
}

function defaultRequest(options: RecipesRequestOptions) {
  uni.request({
    url: options.url,
    method: options.method,
    success: (response: { statusCode: number; data: unknown }) => {
      options.success({
        statusCode: response.statusCode,
        data: response.data
      })
    },
    fail: options.fail
  })
}
