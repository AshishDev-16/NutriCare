"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PreparationTasks } from "@/components/dashboard/pantry/PreparationTasks"
import { DeliveryTasks } from "./DeliveryTasks"
import { Overview } from "@/components/dashboard/pantry/Overview"
import { PantryNavbar } from "./PantryNavbar"
import { TaskHistory } from "./TaskHistory"

export function PantryDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <PantryNavbar />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Pantry Dashboard</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="preparation">Preparation Tasks</TabsTrigger>
            <TabsTrigger value="delivery">Delivery Tasks</TabsTrigger>
            <TabsTrigger value="task-history">Task History</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Overview />
          </TabsContent>
          <TabsContent value="preparation" className="space-y-4">
            <PreparationTasks />
          </TabsContent>
          <TabsContent value="delivery" className="space-y-4">
            <DeliveryTasks />
          </TabsContent>
          <TabsContent value="task-history" className="space-y-4">
            <TaskHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 