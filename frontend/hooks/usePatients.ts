"use client"

import useSWR from 'swr'
import { getPatients } from '@/lib/api/patients'

export function usePatients() {
  const { data, error, isLoading, mutate } = useSWR(
    'patients',
    getPatients,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  return {
    patients: data,
    isLoading,
    error: error?.message,
    mutate,
  }
} 