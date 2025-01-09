"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TasksList } from "./TasksList"
import { PantryStaff } from "./PantryStaff"
import { KitchenOverview } from "./KitchenOverview"

export function KitchenContent() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Kitchen Management</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="staff">Pantry Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <KitchenOverview />
        </TabsContent>
        <TabsContent value="tasks" className="space-y-4">
          <TasksList />
        </TabsContent>
        <TabsContent value="staff" className="space-y-4">
          <PantryStaff />
        </TabsContent>
      </Tabs>
    </div>
  )
} 