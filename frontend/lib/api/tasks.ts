import { getBaseUrl } from './config'

export interface Task {
  _id: string
  description: string
  type: 'preparation' | 'delivery'
  assignedTo?: {
    _id: string
    name: string
  }
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  notes?: string
  deliveryLocation?: {
    floor: string
    wing: string
    roomNumber?: string
  }
}

export async function getTasks(): Promise<Task[]> {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No authentication token found")

  const response = await fetch(`${getBaseUrl()}/api/v1/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) throw new Error("Failed to fetch tasks")
  const data = await response.json()
  return data.data
}

export async function createTask(data: {
  description: string
  type: 'preparation' | 'delivery'
  assignedTo?: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  notes?: string
  deliveryLocation?: {
    floor: string
    wing: string
    roomNumber?: string
  }
}): Promise<Task> {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No authentication token found")

  const response = await fetch(`${getBaseUrl()}/api/v1/tasks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create task")
  }

  const responseData = await response.json()
  return responseData.data
} 