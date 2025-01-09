"use client"

import useSWR from 'swr'
import { getPantryStaff } from '@/lib/api/pantry'

export function usePantryStaff() {
  const { data, error, isLoading, mutate } = useSWR(
    'pantry-staff',
    getPantryStaff,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  return {
    staff: data,
    isLoading,
    error: error?.message,
    mutate,
  }
} 