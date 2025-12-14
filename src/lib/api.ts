import { supabase } from './supabase'

const API_URL = import.meta.env.VITE_SUPABASE_URL as string

interface Sweet {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  created_at: string
  updated_at: string
}

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || ''}`
  }
}

export const sweetsApi = {
  async getAll(): Promise<Sweet[]> {
    const response = await fetch(`${API_URL}/functions/v1/sweets`)
    if (!response.ok) throw new Error('Failed to fetch sweets')
    return response.json()
  },

  async search(name?: string, category?: string, minPrice?: number, maxPrice?: number): Promise<Sweet[]> {
    const params = new URLSearchParams()
    if (name) params.append('name', name)
    if (category) params.append('category', category)
    if (minPrice !== undefined) params.append('minPrice', minPrice.toString())
    if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString())

    const response = await fetch(`${API_URL}/functions/v1/sweets/search?${params}`)
    if (!response.ok) throw new Error('Failed to search sweets')
    return response.json()
  },

  async create(sweet: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>): Promise<Sweet> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/functions/v1/sweets`, {
      method: 'POST',
      headers,
      body: JSON.stringify(sweet)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error)
    }
    return response.json()
  },

  async update(id: string, updates: Partial<Sweet>): Promise<Sweet> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/functions/v1/sweets/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error)
    }
    return response.json()
  },

  async delete(id: string): Promise<void> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/functions/v1/sweets/${id}`, {
      method: 'DELETE',
      headers
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error)
    }
  }
}

export const inventoryApi = {
  async purchase(sweetId: string, quantity: number): Promise<{ message: string; sweetName: string; quantity: number; totalPrice: number }> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/functions/v1/sweets/${sweetId}/purchase`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ quantity })
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error)
    }
    return response.json()
  },

  async restock(sweetId: string, quantity: number): Promise<{ message: string; sweetName: string; addedQuantity: number; newQuantity: number }> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/functions/v1/sweets/${sweetId}/restock`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ quantity })
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error)
    }
    return response.json()
  }
}
