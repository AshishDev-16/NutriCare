"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { DeliveryTrends } from "@/components/dashboard/DeliveryTrends"
import { DeliveryCalendar } from "@/components/dashboard/DeliveryCalendar"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { MealStatus } from "@/components/dashboard/MealStatus"
import { StaffMetrics } from "@/components/dashboard/StaffMetrics"
import { useDashboard } from "@/hooks/useDashboard"

export default function ManagerDashboard() {
  const { stats, trends, isLoading, error } = useDashboard()

  if (error) {
    return <div>Error: {error.message || 'Something went wrong'}</div>
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your hospital&apos;s nutrition management
        </p>
      </div>

      <StatsCards 
        data={stats || {
          totalPatients: 0,
          activeDietCharts: 0,
          completedTasks: 0,
          pendingDeliveries: 0,
          todaysMorningMeals: 0,
          todayEveningMeals: 0
        }} 
        isLoading={isLoading}
      />

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Delivery Schedule</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="meals">Meal Status</TabsTrigger>
          <TabsTrigger value="performance">Staff Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <DeliveryCalendar isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityFeed isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="meals">
          <MealStatus isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="performance">
          <StaffMetrics isLoading={isLoading} />
        </TabsContent>
      </Tabs>

      <DeliveryTrends 
        data={trends || []} 
        isLoading={isLoading} 
      />
    </div>
  )
} 