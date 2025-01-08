"use client"

import useSWR from 'swr'
import { getDashboardStats } from "@/lib/api/dashboard"

export function useDashboardData() {
  const { data, error, isLoading, mutate } = useSWR(
    'dashboard', 
    getDashboardStats,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  return {
    data,
    isLoading,
    error: error?.message,
    mutate,
  }
} 