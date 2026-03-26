"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { DeliveryTrends } from "@/components/dashboard/DeliveryTrends"
import { DeliveryCalendar } from "@/components/dashboard/DeliveryCalendar"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { MealStatus } from "@/components/dashboard/MealStatus"
import { StaffMetrics } from "@/components/dashboard/StaffMetrics"
import { useDashboard } from "@/hooks/useDashboard"

import { motion } from "framer-motion"

export default function ManagerDashboard() {
  const { stats, trends, isLoading, error } = useDashboard()

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="p-6 rounded-2xl bg-red-50 border border-red-100 text-red-600 font-bold">
          Error: {error.message || 'System Orchestration Failed'}
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#004532]">Clinical Command Center</h1>
          <p className="text-slate-500 font-medium tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Hospital Nutrition Synchronization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-bold text-slate-600">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="calendar" className="space-y-6">
            <TabsList className="bg-slate-100/50 p-1 rounded-2xl border-none">
              <TabsTrigger value="calendar" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-[#065f46] data-[state=active]:shadow-sm font-bold transition-all">Delivery Schedule</TabsTrigger>
              <TabsTrigger value="meals" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-[#065f46] data-[state=active]:shadow-sm font-bold transition-all">Meal Monitoring</TabsTrigger>
              <TabsTrigger value="performance" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-[#065f46] data-[state=active]:shadow-sm font-bold transition-all">Staff Logistics</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="outline-none border-none">
              <DeliveryCalendar isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="meals" className="outline-none border-none">
              <MealStatus isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="performance" className="outline-none border-none">
              <StaffMetrics isLoading={isLoading} />
            </TabsContent>
          </Tabs>
          
          <DeliveryTrends 
            data={trends || []} 
            isLoading={isLoading} 
          />
        </div>

        <div className="space-y-8">
          <div className="p-1 rounded-[2.5rem] bg-gradient-to-b from-slate-200/50 to-transparent">
            <div className="bg-white dark:bg-[#0d1c2e] rounded-[2.4rem] overflow-hidden shadow-xl border border-white/20">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-lg text-[#004532] dark:text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-6 bg-emerald-500 rounded-full" /> Live Operations
                </h3>
              </div>
              <div className="p-2">
                 <ActivityFeed isLoading={isLoading} limit={5} hideHeader />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}