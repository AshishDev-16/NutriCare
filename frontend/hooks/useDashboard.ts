"use client"

import useSWR from 'swr'
import { getDashboardStats } from '@/lib/api/dashboard'

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR('dashboard', getDashboardStats)

  return {
    stats: data,
    isLoading,
    error: error?.message,
    mutate
  }
} 