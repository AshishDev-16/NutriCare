"use client"

import { 
  Users, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  TrendingDown 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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
      title: "Total Patients",
      value: data.totalPatients,
      previousValue: previousData?.totalPatients,
      icon: Users,
      description: "Currently admitted patients",
    },
    {
      title: "Active Diet Charts",
      value: data.activeDietCharts,
      previousValue: previousData?.activeDietCharts,
      icon: ClipboardList,
      description: "Ongoing diet plans",
    },
    {
      title: "Completed Tasks",
      value: data.completedTasks,
      previousValue: previousData?.completedTasks,
      icon: CheckCircle2,
      description: "Tasks completed today",
    },
    {
      title: "Pending Deliveries",
      value: data.pendingDeliveries,
      previousValue: previousData?.pendingDeliveries,
      icon: Clock,
      description: "Meals awaiting delivery",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-[120px]" />
              </CardTitle>
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
              <Skeleton className="h-4 w-[100px] mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const change = calculateChange(stat.value, stat.previousValue)
        const Icon = stat.icon
        
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {stat.description}
              </p>
              {change !== 0 && (
                <div className={`text-xs mt-2 flex items-center ${
                  change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {change > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(change).toFixed(1)}% from last period
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 