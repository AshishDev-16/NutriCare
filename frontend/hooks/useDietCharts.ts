"use client"

import useSWR from 'swr'
import { getDietCharts } from '@/lib/api/diet-charts'

export function useDietCharts() {
  const { data, error, isLoading, mutate } = useSWR(
    'diet-charts',
    getDietCharts,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  return {
    dietCharts: data,
    isLoading,
    error: error?.message,
    mutate,
  }
} 