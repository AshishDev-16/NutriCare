const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface Patient {
  _id?: string
  id?: string
  name: string
  age: number
  gender: string
  roomNumber: string
  bedNumber: string
  floorNumber: string
  diseases: string[]
  allergies: string[]
  contactNumber: string
  emergencyContact: {
    name: string
    relation: string
    phone: string
  }
  createdAt?: string
}

export async function getPatients() {
  const token = localStorage.getItem("token")
  const response = await fetch(`${BASE_URL}/api/v1/patients`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch patients")
  }

  const data = await response.json()
  return data.data
}

export async function createPatient(patientData: Omit<Patient, "id" | "createdAt">) {
  const token = localStorage.getItem("token")
  const response = await fetch(`${BASE_URL}/api/v1/patients`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patientData),
  })

  if (!response.ok) {
    throw new Error("Failed to create patient")
  }

  const data = await response.json()
  return data.data
}

export async function updatePatient(id: string, patientData: Partial<Patient>) {
  const token = localStorage.getItem("token")
  const response = await fetch(`${BASE_URL}/api/v1/patients/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patientData),
  })

  if (!response.ok) {
    throw new Error("Failed to update patient")
  }

  const data = await response.json()
  return data.data
}

export async function deletePatient(id: string) {
  const token = localStorage.getItem("token")
  const response = await fetch(`${BASE_URL}/api/v1/patients/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete patient")
  }

  return true
} 