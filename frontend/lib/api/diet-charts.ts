import { getBaseUrl } from './config'

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

export async function getDietCharts(): Promise<DietChart[]> {
  const token = localStorage.getItem("token")
  
  if (!token) {
    throw new Error("No authentication token found")
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
    
    // First get diet charts
    const dietChartsResponse = await fetch(`${baseUrl}/api/v1/diet-charts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!dietChartsResponse.ok) {
      throw new Error("Failed to fetch diet charts")
    }

    const dietChartsData = await dietChartsResponse.json()

    // Get patient details for each diet chart
    const patientsResponse = await fetch(`${baseUrl}/api/v1/patients`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!patientsResponse.ok) {
      throw new Error("Failed to fetch patients")
    }

    const patientsData = await patientsResponse.json()
    const patientsMap = new Map(patientsData.data.map((patient: any) => [patient._id, patient]))

    // Merge diet charts with patient details
    const transformedData = dietChartsData.data.map((chart: any) => ({
      ...chart,
      patient: {
        ...chart.patient,
        ...(patientsMap.get(chart.patient._id) || {}),
      }
    }))

    return transformedData
  } catch (error) {
    console.error('Diet Charts API Request Failed:', error)
    throw error
  }
}

export async function createDietChart(data: Omit<DietChart, '_id' | 'createdAt' | 'createdBy'>) {
  const token = localStorage.getItem("token")
  const response = await fetch(`${getBaseUrl()}/api/v1/diet-charts`, {
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