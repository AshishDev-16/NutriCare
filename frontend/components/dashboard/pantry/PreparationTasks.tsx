"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Clock, 
  CheckCircle2, 
  PlayCircle,
  AlertCircle,
  Info 
} from "lucide-react"
import useSWR from "swr"
import { getPantryTasks, type Task } from "@/lib/api/pantry"
import { StatusUpdateDialog } from "./StatusUpdateDialog"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TaskDetailsModal } from "./TaskDetailsModal"
import { formatDate } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const statusIcons: Record<string, any> = {
  pending: Clock,
  in_progress: PlayCircle,
  completed: CheckCircle2,
  delayed: AlertCircle,
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  delayed: "bg-red-100 text-red-800",
}

export function PreparationTasks() {
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const { data: tasks, error, isLoading, mutate } = useSWR<Task[]>(
    ['pantry-tasks', 'preparation'],
    () => getPantryTasks('preparation'),
    { revalidateOnFocus: false }
  )

  const filteredTasks = tasks?.filter(task => 
    priorityFilter === 'all' ? true : task.priority === priorityFilter
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50/50 dark:bg-red-900/10 rounded-[2rem] border border-red-100/50 dark:border-red-900/20">
        <p className="text-red-500 font-medium">System Alert: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">Active Prep Queue</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Kitchen Orchestration</p>
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px] bg-white dark:bg-[#1a2b3c] border-none shadow-sm rounded-xl font-bold text-slate-600 dark:text-slate-300">
            <SelectValue placeholder="All Ops" />
          </SelectTrigger>
          <SelectContent className="border-none shadow-2xl rounded-2xl">
            <SelectItem value="all">Standard View</SelectItem>
            <SelectItem value="high" className="text-rose-500 font-bold">Critical Only</SelectItem>
            <SelectItem value="medium" className="text-amber-500 font-bold">Priority Ops</SelectItem>
            <SelectItem value="low" className="text-blue-500 font-bold">Standard Ops</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks?.map((task, index) => {
            const StatusIcon = statusIcons[task.status] || Info
            return (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="group relative overflow-hidden p-6 bg-white dark:bg-[#0d1c2e] rounded-[2rem] border border-slate-100 dark:border-slate-800/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={cn(
                    "absolute top-0 left-0 w-1.5 h-full opacity-50 group-hover:opacity-100 transition-opacity",
                    task.priority === 'high' ? "bg-rose-500" : 
                    task.priority === 'medium' ? "bg-amber-500" : 
                    "bg-blue-500"
                  )} />
                  
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "p-2 rounded-xl bg-opacity-10 dark:bg-opacity-20",
                          task.priority === 'high' ? "bg-rose-500 text-rose-600 dark:text-rose-400" : 
                          task.priority === 'medium' ? "bg-amber-500 text-amber-600 dark:text-amber-400" : 
                          "bg-blue-500 text-blue-600 dark:text-blue-400"
                        )}>
                          <StatusIcon className="h-5 w-5" />
                        </div>
                        <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{task.description}</p>
                        <Badge 
                          variant="outline"
                          className={cn(
                            "px-3 py-0.5 rounded-full border-none font-black text-[10px] uppercase tracking-tighter shadow-sm",
                            task.priority === 'high' ? "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" : 
                            task.priority === 'medium' ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" : 
                            "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          )}
                        >
                          {task.priority} Prio
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-sm font-bold text-slate-400">
                          <span className="p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">Staff</span>
                          <span className="text-slate-500 dark:text-slate-300">{task.assignedTo.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm font-bold text-slate-400">
                          <Clock className="h-4 w-4" />
                          <span className="text-slate-500 dark:text-slate-300">
                            {task.dueDate ? formatDate(task.dueDate) : 'TBD'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-center">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "px-4 py-1.5 rounded-xl font-black uppercase text-[10px] border-none shadow-md",
                          task.status === 'completed' ? "bg-emerald-500 text-white shadow-emerald-200 dark:shadow-none" :
                          task.status === 'in_progress' ? "bg-indigo-500 text-white shadow-indigo-200 dark:shadow-none" :
                          "bg-slate-400 text-white"
                        )}
                      >
                        {task.status.replace('_', ' ')}
                      </Badge>
                      
                      <div className="flex items-center space-x-1 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <TaskDetailsModal 
                          task={task}
                          onStatusUpdate={mutate}
                          trigger={
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg hover:bg-white dark:hover:bg-[#1a2b3c] hover:shadow-sm">
                              <Info className="h-4 w-4 text-slate-400" />
                            </Button>
                          }
                        />
                        {task.status !== 'completed' && (
                          <StatusUpdateDialog 
                            taskId={task._id}
                            onStatusUpdate={mutate}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}