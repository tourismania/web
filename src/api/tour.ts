import apiClient from './axios'
import type { Tour } from './types/tour'

export class TourApi {
  static async getAll(): Promise<Tour[]> {
    const response = await apiClient.get<Tour[]>('/api/v1/tours')
    return response.data
  }

  static async getById(id: string): Promise<Tour> {
    const response = await apiClient.get<Tour>(`/api/v1/tours/${id}`)
    return response.data
  }

  static async create(data: Partial<Tour>): Promise<Tour> {
    const response = await apiClient.post<Tour>('/api/v1/tours', data)
    return response.data
  }

  static async update(id: string, data: Partial<Tour>): Promise<Tour> {
    const response = await apiClient.put<Tour>(`/api/v1/tours/${id}`, data)
    return response.data
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/tours/${id}`)
  }
}