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
import { motion } from "framer-motion"

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
  limit?: number
  className?: string
  hideHeader?: boolean
}

const activityIcons: Record<Activity['type'], LucideIcon> = {
  diet_chart_created: ClipboardList,
  delivery_completed: CheckCircle2,
  delivery_delayed: AlertCircle,
  task_completed: CheckCircle2,
  task_assigned: Clock,
}

const activityColors: Record<Activity['type'], string> = {
  diet_chart_created: 'bg-blue-100 text-blue-600',
  delivery_completed: 'bg-emerald-100 text-emerald-600',
  delivery_delayed: 'bg-red-100 text-red-600',
  task_completed: 'bg-emerald-100 text-emerald-600',
  task_assigned: 'bg-slate-100 text-slate-600',
}

export function ActivityFeed({ isLoading, limit, className, hideHeader }: ActivityFeedProps) {
  const { data: activities = [] } = useSWR<Activity[]>(
    '/api/v1/dashboard/activities',
    getActivities
  )

  const displayedActivities = limit ? activities.slice(0, limit) : activities

  if (isLoading) {
    return (
      <Card className="border-none bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">System Operations Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
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
    <Card className="border-none bg-white shadow-sm overflow-hidden">
      {!hideHeader && (
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
             <span className="w-2 h-6 bg-[#065f46] rounded-full" />
             Live Operations Stream
          </CardTitle>
          <p className="text-sm text-slate-400 font-medium">Real-time clinical and logistical activity</p>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <ScrollArea className="h-[450px] px-6">
          <div className="space-y-0 relative pb-8">
            <div className="absolute left-[20px] top-4 bottom-8 w-px bg-slate-100" />

            {displayedActivities.map((activity, idx) => {
              const Icon = activityIcons[activity.type]
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-6 py-4 group relative"
                >
                  <div className={`z-10 flex-shrink-0 w-10 h-10 rounded-xl ${activityColors[activity.type]} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 pt-1 flex-1">
                    <p className="text-sm font-semibold text-slate-800 leading-tight">
                      {activity.message}
                      {activity.meta?.patientName && (
                        <span className="text-[#065f46] bg-[#065f46]/5 px-2 py-0.5 rounded-md mx-1">
                          {activity.meta.patientName}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                        {format(new Date(activity.timestamp), 'HH:mm:ss')}
                      </p>
                      {activity.meta?.roomNumber && (
                        <span className="text-xs font-bold text-slate-400">
                          • Room {activity.meta.roomNumber}
                        </span>
                      )}
                      {activity.meta?.staffName && (
                        <span className="text-xs font-bold text-slate-400">
                          • {activity.meta.staffName}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 
 