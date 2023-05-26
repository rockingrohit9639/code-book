import { apiClient } from '~/utils/client'

export async function fetchFileById(id: string) {
  const { data } = await apiClient.get<any>(`/files/download/${id}`, { responseType: 'blob' })
  return data
}
