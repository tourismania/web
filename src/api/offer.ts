import apiClient from './axios'
import type { Offer } from './types/offer'

export class OfferApi {
  static async getAll(): Promise<Offer[]> {
    const response = await apiClient.get<Offer[]>('/api/v1/tours')
    return response.data
  }

  static async getById(id: string): Promise<Offer> {
    const response = await apiClient.get<Offer>(`/api/v1/tours/${id}`)
    return response.data
  }

  static async create(data: Partial<Offer>): Promise<Offer> {
    const response = await apiClient.post<Offer>('/api/v1/tours', data)
    return response.data
  }

  static async update(id: string, data: Partial<Offer>): Promise<Offer> {
    const response = await apiClient.put<Offer>(`/api/v1/tours/${id}`, data)
    return response.data
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/tours/${id}`)
  }
}