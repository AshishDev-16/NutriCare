"use client"

import useSWR from 'swr'
import { getDeliveries, Delivery } from '@/lib/api/deliveries'

export function useDeliveries() {
  const { data, error, isLoading, mutate } = useSWR<Delivery[]>('deliveries', getDeliveries)

  const stats = {
    active: data?.filter(d => d.status === 'pending').length || 0,
    inTransit: data?.filter(d => d.status === 'in_transit').length || 0,
    completed: data?.filter(d => d.status === 'delivered').length || 0,
    cancelled: data?.filter(d => d.status === 'cancelled').length || 0,
  }

  const filteredDeliveries = {
    ongoing: data?.filter(d => ['pending', 'in_transit'].includes(d.status)) || [],
    completed: data?.filter(d => d.status === 'delivered') || [],
    cancelled: data?.filter(d => d.status === 'cancelled') || []
  }

  return {
    deliveries: data || [],
    filteredDeliveries,
    stats,
    isLoading,
    error: error?.message,
    mutate,
  }
} 