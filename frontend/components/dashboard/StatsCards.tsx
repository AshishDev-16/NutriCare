"use client"

import { 
  Users, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

interface StatsCardsProps {
  data: {
    totalPatients: number
    activeDietCharts: number
    completedTasks: number
    pendingDeliveries: number
    todaysMorningMeals: number
    todayEveningMeals: number
  }
  previousData?: {
    totalPatients: number
    activeDietCharts: number
    completedTasks: number
    pendingDeliveries: number
  }
  isLoading: boolean
}

export function StatsCards({ data, previousData, isLoading }: StatsCardsProps) {
  const calculateChange = (current: number, previous: number | undefined) => {
    if (!previous) return 0
    return ((current - previous) / previous) * 100
  }

  const stats = [
    {
      title: "Active Patients",
      value: data.totalPatients,
      previousValue: previousData?.totalPatients,
      icon: Users,
      description: "Admitted & Monitored",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Active Diet Plans",
      value: data.activeDietCharts,
      previousValue: previousData?.activeDietCharts,
      icon: ClipboardList,
      description: "Clinical Compliance",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Completed Meals",
      value: data.completedTasks,
      previousValue: previousData?.completedTasks,
      icon: CheckCircle2,
      description: "Delivery Cycle Today",
      color: "bg-teal-50 text-teal-600",
    },
    {
      title: "Pending Logistics",
      value: data.pendingDeliveries,
      previousValue: previousData?.pendingDeliveries,
      icon: Clock,
      description: "Awaiting Orchestration",
      color: "bg-slate-50 text-slate-600",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-none bg-white shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
              <Skeleton className="h-3 w-[120px] mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => {
        const change = calculateChange(stat.value, stat.previousValue)
        const Icon = stat.icon
        
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-none bg-white shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Icon className="h-20 w-20 transform translate-x-4 -translate-y-4" />
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold tracking-tight text-slate-500 uppercase">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-xl ${stat.color} transition-transform group-hover:scale-110`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs font-semibold text-slate-400">
                    {stat.description}
                  </p>
                </div>
                {change !== 0 && (
                  <div className={`text-xs mt-4 flex items-center font-bold px-2 py-1 rounded-lg w-fit ${
                    change > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {change > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(change).toFixed(1)}% vs last cycle
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
} 
 