const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface DietChart {
  _id: string
  patient: {
    _id: string
    name: string
    roomNumber: string
    bedNumber: string
  }
  meals: {
    morning: {
      items: Array<{
        name: string
        quantity: string
        instructions?: string
      }>
      specialInstructions?: string
    }
    evening: {
      items: Array<{
        name: string
        quantity: string
        instructions?: string
      }>
      specialInstructions?: string
    }
  }
  dietaryRestrictions: string[]
  startDate: string
  endDate: string
  status: 'active' | 'completed' | 'cancelled'
  createdBy: {
    _id: string
    name: string
  }
  createdAt: string
}

export async function getDietCharts() {
  const token = localStorage.getItem("token")
  const response = await fetch(`${BASE_URL}/api/v1/diet-charts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch diet charts")
  }

  const data = await response.json()
  return data.data
}

export async function createDietChart(data: Omit<DietChart, '_id' | 'createdAt' | 'createdBy'>) {
  const token = localStorage.getItem("token")
  const response = await fetch(`${BASE_URL}/api/v1/diet-charts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create diet chart")
  }

  const responseData = await response.json()
  return responseData.data
} 