"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PreparationTasks } from "@/components/dashboard/pantry/PreparationTasks"
import { DeliveryTasks } from "./DeliveryTasks"
import { Overview } from "@/components/dashboard/pantry/Overview"
import { TaskHistory } from "./TaskHistory"
import { motion } from "framer-motion"

export function PantryDashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#004532]">Pantry Operations</h2>
        <p className="text-slate-500 font-medium tracking-tight">Real-time preparation and delivery orchestration</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-slate-100/50 p-1 rounded-2xl border-none">
          <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-[#065f46] data-[state=active]:shadow-sm font-bold transition-all">Overview</TabsTrigger>
          <TabsTrigger value="preparation" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-[#065f46] data-[state=active]:shadow-sm font-bold transition-all">Preparation</TabsTrigger>
          <TabsTrigger value="delivery" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-[#065f46] data-[state=active]:shadow-sm font-bold transition-all">Delivery</TabsTrigger>
          <TabsTrigger value="task-history" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-[#065f46] data-[state=active]:shadow-sm font-bold transition-all">History</TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="overview" className="space-y-8 outline-none border-none">
            <Overview />
          </TabsContent>
          <TabsContent value="preparation" className="space-y-8 outline-none border-none">
            <PreparationTasks />
          </TabsContent>
          <TabsContent value="delivery" className="space-y-8 outline-none border-none">
            <DeliveryTasks />
          </TabsContent>
          <TabsContent value="task-history" className="space-y-8 outline-none border-none">
            <TaskHistory />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  )
}