"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import useSWR from "swr"
import { getStaffMetrics } from "@/lib/api/dashboard"
import { motion } from "framer-motion"
import { Award, Clock, ChevronRight, Zap, TrendingUp } from "lucide-react"

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

  if (error) {
    return (
      <Card className="border-none bg-white shadow-sm border-red-100 border-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-red-600">Metric Failure</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 font-medium">Critical error retrieving workforce performance data.</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="border-none bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Workforce Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none bg-white shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#065f46] rounded-full" />
              Workforce Optimization
            </CardTitle>
            <CardDescription className="font-medium text-slate-500">Real-time operational efficiency metrics</CardDescription>
          </div>
          <Award className="h-6 w-6 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[450px] px-6">
          <div className="space-y-10 pb-10">
            {staffMetrics.map((staff, idx) => {
              const completionRate = Math.round((staff.metrics.completedDeliveries / staff.metrics.totalDeliveries) * 100)
              const onTimeRate = Math.round((staff.metrics.onTimeDeliveries / staff.metrics.completedDeliveries) * 100)
              
              return (
                <motion.div 
                  key={staff.staffId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#065f46] text-white flex items-center justify-center font-bold shadow-sm">
                        {staff.name.charAt(0)}
                      </div>
                      <h3 className="font-bold text-slate-800 tracking-tight">{staff.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      <TrendingUp className="h-3.5 w-3.5" /> High Performer
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>Fulfillment Rate</span>
                        <span className="text-slate-900">{completionRate}%</span>
                      </div>
                      <Progress 
                        value={completionRate} 
                        className="h-1.5 bg-slate-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>Punctuality</span>
                        <span className="text-slate-900">{onTimeRate}%</span>
                      </div>
                      <Progress 
                        value={onTimeRate} 
                        className="h-1.5 bg-slate-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Avg Time</p>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-sm font-bold text-slate-800">{staff.metrics.averageDeliveryTime}m</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Tasks</p>
                      <div className="flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-sm font-bold text-slate-800">{staff.metrics.completedTasks}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/50 flex flex-col justify-center items-center group cursor-pointer hover:bg-[#065f46] hover:text-white transition-all">
                      <span className="text-[10px] font-bold uppercase tracking-wider">Review</span>
                      <ChevronRight className="h-4 w-4 mt-1 group-hover:translate-x-1 transition-transform" />
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
 