import { getBaseUrl } from './config'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface DashboardData {
  totalPatients: number
  activeDietCharts: number
  completedTasks: number
  todaysCompletedTasks: number
  todaysMeals: number
  pendingDeliveries: number
  recentDietCharts: Array<{
    _id: string
    patient: {
      name: string
      roomNumber: string
      bedNumber: string
    }
    startDate: string
    endDate: string
  }>
  todaysMorningMeals: number
  todayEveningMeals: number
}

export async function getDashboardStats(): Promise<DashboardData> {
  const token = localStorage.getItem("token")
  
  if (!token) {
    throw new Error("No authentication token found")
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
    const response = await fetch(`${baseUrl}/api/v1/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard data: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || {
      totalPatients: 0,
      activeDietCharts: 0,
      completedTasks: 0,
      todaysCompletedTasks: 0,
      todaysMeals: 0,
      pendingDeliveries: 0,
      recentDietCharts: [],
      todaysMorningMeals: 0,
      todayEveningMeals: 0
    }
  } catch (error) {
    console.error('Dashboard API Request Failed:', error)
    throw error
  }
}

export async function getDeliveryTrends() {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No token found')

  const response = await fetch(`${getBaseUrl()}/api/v1/dashboard/trends`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch delivery trends')
  }

  const data = await response.json()
  return data.data
}

export async function getDeliverySchedule(date?: string) {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No token found')

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
  const queryDate = date ? `?date=${date}` : ''
  
  const response = await fetch(`${baseUrl}/api/v1/dashboard/schedule${queryDate}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch delivery schedule')
  }

  const data = await response.json()
  return data.data
}

export async function getActivities() {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No token found')

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
  
  const response = await fetch(`${baseUrl}/api/v1/dashboard/activities`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch activities')
  }

  const data = await response.json()
  return data.data
}

export async function getMealStatus() {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No token found')

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
  
  const response = await fetch(`${baseUrl}/api/v1/dashboard/meal-status`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch meal status')
  }

  const data = await response.json()
  return data.data
}

export async function getStaffMetrics() {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No token found')

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
  
  const response = await fetch(`${baseUrl}/api/v1/dashboard/staff-metrics`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch staff metrics')
  }

  const data = await response.json()
  return data.data
} 