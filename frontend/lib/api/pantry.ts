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

export async function createPantryStaff(data: {
  name: string
  email: string
  contactNumber: string
  floor: string
  wing: string
}) {
  const token = localStorage.getItem("token")
  
  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${getBaseUrl()}/api/v1/pantry/staff`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      contactNumber: data.contactNumber,
      floor: data.floor,
      wing: data.wing
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create pantry staff");
  }

  const responseData = await response.json();
  return responseData.data;
}

export async function updatePantryStaff(id: string, data: {
  name: string
  email: string
  contactNumber: string
  floor: string
  wing: string
}) {
  const token = localStorage.getItem("token")
  const response = await fetch(`${getBaseUrl()}/api/v1/pantry/staff/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to update staff member")
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

export interface Task {
  _id: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
  priority: 'low' | 'medium' | 'high'
  assignedTo: {
    name: string
  }
  type: 'preparation' | 'delivery'
  notes?: string
  roomNumber?: string
  patientName?: string
  deliveryLocation?: {
    floor: string
    wing: string
    roomNumber: string
  }
  createdAt: string
  updatedAt: string
  dueDate: string
}

export async function getPantryTasks(type: 'preparation' | 'delivery'): Promise<Task[]> {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No token found')

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
  const url = `${baseUrl}/api/v1/pantry/tasks?type=${type}`

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json();
    console.error('API Error:', errorData); // Log API errors
    throw new Error(errorData.message || 'Failed to fetch tasks')
  }

  const data = await response.json()
  console.log('API Response:', data); // Log API response
  return data.data
}

export async function updateTaskStatus(
  taskId: string, 
  status: 'in_progress' | 'completed' | 'delayed'
) {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No token found')

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
  
  const response = await fetch(`${baseUrl}/pantry/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status })
  })

  if (!response.ok) {
    throw new Error('Failed to update task status')
  }

  const data = await response.json()
  return data.data
}

export async function getAllPantryTasks(): Promise<Task[]> {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('No token found')

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
  
  const response = await fetch(`${baseUrl}/api/v1/pantry/tasks`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }

  const data = await response.json()
  return data.data
} 