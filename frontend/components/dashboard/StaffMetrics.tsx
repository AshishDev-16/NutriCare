"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import useSWR from "swr"
import { getStaffMetrics } from "@/lib/api/dashboard"

interface StaffMetric {
  staffId: string
  name: string
  metrics: {
    totalDeliveries: number
    completedDeliveries: number
    onTimeDeliveries: number
    totalTasks: number
    completedTasks: number
    averageDeliveryTime: number
  }
  recentPerformance: {
    date: string
    deliveries: number
    onTime: number
  }[]
}

interface StaffMetricsProps {
  isLoading: boolean
}

export function StaffMetrics({ isLoading }: StaffMetricsProps) {
  const { data: staffMetrics = [], error } = useSWR<StaffMetric[]>(
    '/api/v1/dashboard/staff-metrics',
    getStaffMetrics
  )

  console.log('Staff metrics:', staffMetrics) // Debug log
  console.log('Error if any:', error) // Debug log

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error loading staff metrics: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-[100px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-8">
            {staffMetrics.map((staff) => (
              <div key={staff.staffId} className="space-y-2">
                <h3 className="font-medium">{staff.name}</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Delivery Completion Rate</span>
                      <span className="font-medium">
                        {Math.round((staff.metrics.completedDeliveries / staff.metrics.totalDeliveries) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(staff.metrics.completedDeliveries / staff.metrics.totalDeliveries) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>On-Time Delivery Rate</span>
                      <span className="font-medium">
                        {Math.round((staff.metrics.onTimeDeliveries / staff.metrics.completedDeliveries) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(staff.metrics.onTimeDeliveries / staff.metrics.completedDeliveries) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Average Delivery Time</p>
                      <p className="font-medium">{staff.metrics.averageDeliveryTime} mins</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tasks Completed</p>
                      <p className="font-medium">
                        {staff.metrics.completedTasks} / {staff.metrics.totalTasks}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 