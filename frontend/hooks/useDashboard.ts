"use client"

import useSWR from 'swr'
import { getDashboardStats, getDeliveryTrends, getDeliverySchedule } from '@/lib/api/dashboard'

export function useDashboard() {
  const { 
    data: stats, 
    error: statsError, 
    isLoading: statsLoading,
    mutate: mutateStats 
  } = useSWR('dashboard/stats', getDashboardStats, {
    refreshInterval: 30000 // Refresh every 30 seconds
  })

  const {
    data: trends,
    error: trendsError,
    isLoading: trendsLoading
  } = useSWR('dashboard/trends', getDeliveryTrends)

  const {
    data: schedule,
    error: scheduleError,
    isLoading: scheduleLoading
  } = useSWR('dashboard/schedule', getDeliverySchedule)

  return {
    stats,
    trends,
    schedule,
    isLoading: statsLoading || trendsLoading || scheduleLoading,
    error: statsError || trendsError || scheduleError,
    mutate: mutateStats
  }
} 