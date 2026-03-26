"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, CheckCircle2, AlertCircle, ChefHat } from "lucide-react"
import useSWR from "swr"
import { getAllPantryTasks, type Task } from "@/lib/api/pantry"
import { motion } from "framer-motion"

export function Overview() {
  const { data: tasks, isLoading } = useSWR<Task[]>(
    ['pantry-tasks', 'all'],
    getAllPantryTasks,
    { revalidateOnFocus: false }
  )

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-[150px]" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[100px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const pendingTasks = tasks?.filter(task => task.status === 'pending').length || 0
  const inProgressTasks = tasks?.filter(task => task.status === 'in_progress').length || 0
  const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0
  const delayedTasks = tasks?.filter(task => task.status === 'delayed').length || 0

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
    >
      <Card className="border-none shadow-sm bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl overflow-hidden group hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Tasks</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-amber-100/50 text-amber-600 flex items-center justify-center">
            <Clock className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{pendingTasks}</div>
          <p className="text-xs font-medium text-slate-500">Awaiting your action</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl overflow-hidden group hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">In Progress</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-blue-100/50 text-blue-600 flex items-center justify-center">
            <ChefHat className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{inProgressTasks}</div>
          <p className="text-xs font-medium text-slate-500">Currently active</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl overflow-hidden group hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-emerald-100/50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{completedTasks}</div>
          <p className="text-xs font-medium text-slate-500">Successfully handled</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl overflow-hidden group hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">Delayed</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-red-100/50 text-red-600 flex items-center justify-center">
            <AlertCircle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-3xl font-black text-red-600 mb-1">{delayedTasks}</div>
          <p className="text-xs font-medium text-slate-500">Needs immediate focus</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
 