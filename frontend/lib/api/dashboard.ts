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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Dashboard API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Dashboard API Request Failed:', error)
    throw error
  }
} 