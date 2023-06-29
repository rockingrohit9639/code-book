import { CerateTagDto, Tag } from '~/types/tag'
import { apiClient } from '~/utils/client'

export async function fetchAllTags() {
  const { data } = await apiClient.get<Tag[]>('tags')
  return data
}

export async function createTag(dto: CerateTagDto) {
  const { data } = await apiClient.post<Tag>('tags', dto)
  return data
}
