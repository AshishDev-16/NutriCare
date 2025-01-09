"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import useSWR from "swr"
import { getActivities } from "@/lib/api/dashboard"
import { 
  ClipboardList, 
  CheckCircle2, 
  Truck,
  AlertCircle,
  Clock,
  type LucideIcon 
} from "lucide-react"

interface Activity {
  id: string
  type: 'diet_chart_created' | 'delivery_completed' | 'delivery_delayed' | 'task_completed' | 'task_assigned'
  message: string
  timestamp: string
  meta?: {
    patientName?: string
    roomNumber?: string
    staffName?: string
  }
}

interface ActivityFeedProps {
  isLoading: boolean
}

const activityIcons: Record<Activity['type'], LucideIcon> = {
  diet_chart_created: ClipboardList,
  delivery_completed: CheckCircle2,
  delivery_delayed: AlertCircle,
  task_completed: CheckCircle2,
  task_assigned: Clock,
}

const activityColors: Record<Activity['type'], string> = {
  diet_chart_created: 'text-blue-500',
  delivery_completed: 'text-green-500',
  delivery_delayed: 'text-red-500',
  task_completed: 'text-green-500',
  task_assigned: 'text-orange-500',
}

export function ActivityFeed({ isLoading }: ActivityFeedProps) {
  const { data: activities = [] } = useSWR<Activity[]>(
    '/api/v1/dashboard/activities',
    getActivities
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
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
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type]
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4"
                >
                  <div className={`mt-0.5 ${activityColors[activity.type]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      {activity.message}
                      {activity.meta?.patientName && (
                        <span className="font-medium">
                          {' '}for {activity.meta.patientName}
                        </span>
                      )}
                      {activity.meta?.roomNumber && (
                        <span className="text-muted-foreground">
                          {' '}(Room {activity.meta.roomNumber})
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                      {activity.meta?.staffName && (
                        <span> by {activity.meta.staffName}</span>
                      )}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 