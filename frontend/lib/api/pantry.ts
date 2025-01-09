import { getBaseUrl } from './config'

export interface PantryStaff {
  _id: string
  name: string
  email: string
  contactNumber: string
  location: {
    floor: string
    wing: string
  }
  status: 'available' | 'busy'
  currentTasks: string[]
}

export async function getPantryStaff(): Promise<PantryStaff[]> {
  const token = localStorage.getItem("token")
  
  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${getBaseUrl()}/api/v1/pantry/staff`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch pantry staff")
  }

  const data = await response.json()
  return data.data
}

export async function createPantryStaff(data: Omit<PantryStaff, '_id' | 'status' | 'currentTasks'>) {
  const token = localStorage.getItem("token")
  
  if (!token) {
    throw new Error("No authentication token found")
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
  console.log('Making request to:', `${baseUrl}/api/v1/pantry/staff`) // Debug log
  console.log('With data:', data) // Debug log

  const response = await fetch(`${baseUrl}/api/v1/pantry/staff`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  console.log('Response status:', response.status) // Debug log
  const responseData = await response.json()
  console.log('Response data:', responseData) // Debug log

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to create pantry staff")
  }

  return responseData.data
}

export async function updatePantryStaff(id: string, data: Partial<PantryStaff>) {
  const token = localStorage.getItem("token")
  
  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${getBaseUrl()}/api/v1/pantry/staff/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to update pantry staff")
  }

  const responseData = await response.json()
  return responseData.data
}

export async function deletePantryStaff(id: string) {
  const token = localStorage.getItem("token")
  
  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${getBaseUrl()}/api/v1/pantry/staff/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to delete pantry staff")
  }

  return true
} 