import { getBaseUrl } from './config'

export interface Delivery {
  _id: string
  task: {
    _id: string
    description: string
    deliveryLocation: {
      floor: string
      wing: string
      roomNumber: string
    }
  }
  assignedTo: {
    _id: string
    name: string
  }
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled'
  startTime?: string
  endTime?: string
  notes?: string
  trackingUpdates: Array<{
    status: string
    timestamp: string
    note?: string
  }>
}

export async function getDeliveries(): Promise<Delivery[]> {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No authentication token found")

  const response = await fetch(`${getBaseUrl()}/api/v1/deliveries`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch deliveries")
  }

  const { data } = await response.json()
  return data
}

export async function updateDeliveryStatus(
  id: string, 
  status: Delivery['status'], 
  note?: string
) {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No authentication token found")

  const response = await fetch(`${getBaseUrl()}/api/v1/deliveries/${id}/status`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, note })
  })

  if (!response.ok) {
    throw new Error("Failed to update delivery status")
  }

  const { data } = await response.json()
  return data
} 