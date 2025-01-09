"use client"

import useSWR from 'swr'
import { getTasks } from '@/lib/api/tasks'

export function useTasks() {
  const { data, error, isLoading, mutate } = useSWR('tasks', getTasks)

  return {
    tasks: data,
    isLoading,
    error: error?.message,
    mutate,
  }
} 