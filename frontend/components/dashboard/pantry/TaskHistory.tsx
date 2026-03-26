"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import useSWR from "swr"
import { getPantryTasks, type Task } from "@/lib/api/pantry"
import { formatDate, cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function TaskHistory() {
  const { data: tasks, error, isLoading } = useSWR<Task[]>(
    ['pantry-tasks', 'completed'],
    async () => {
      const prepTasks = await getPantryTasks('preparation')
      const deliveryTasks = await getPantryTasks('delivery')
      const allTasks = [...prepTasks, ...deliveryTasks]
      return allTasks.filter(task => task.status === 'completed')
    },
    { revalidateOnFocus: false }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#065f46]/20 border-t-[#065f46] rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Recuperating Archive Data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-medium">
        Protocol Error: {error.message}
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-1">
        <h3 className="text-2xl font-extrabold tracking-tight text-[#004532]">Operational History</h3>
        <p className="text-slate-500 font-medium">Audit of completed clinical nutrition tasks</p>
      </div>

      <div className="p-1 rounded-[2rem] bg-gradient-to-b from-slate-200/50 to-transparent">
        <Card className="bg-white dark:bg-[#0d1c2e] rounded-[1.9rem] overflow-hidden shadow-xl border border-white/20">
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-transparent border-none">
                    <TableHead className="py-5 pl-8 font-bold text-slate-900 dark:text-emerald-400">Description</TableHead>
                    <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Type</TableHead>
                    <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Priority</TableHead>
                    <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Personnel</TableHead>
                    <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Finalized On</TableHead>
                    <TableHead className="py-5 pr-8 font-bold text-slate-900 dark:text-emerald-400">Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks?.map((task) => (
                    <TableRow 
                      key={task._id}
                      className="group border-b border-slate-100 dark:border-slate-800 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors"
                    >
                      <TableCell className="py-4 pl-8 font-semibold text-slate-700 dark:text-slate-300">{task.description}</TableCell>
                      <TableCell className="py-4">
                        <span className="capitalize text-[10px] font-bold tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase">
                          {task.type}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full inline-block mr-2",
                          task.priority === 'high' ? "bg-red-500" : 
                          task.priority === 'medium' ? "bg-amber-500" : 
                          "bg-slate-300"
                        )} />
                        {task.priority}
                      </TableCell>
                      <TableCell className="py-4 font-medium text-slate-500">{task.assignedTo?.name}</TableCell>
                      <TableCell className="py-4 text-slate-500 font-medium whitespace-nowrap">{formatDate(task.updatedAt)}</TableCell>
                      <TableCell className="py-4 pr-8 text-slate-500 font-medium">
                        {task.type === 'delivery' && task.deliveryLocation ? 
                          `F${task.deliveryLocation.floor} · ${task.deliveryLocation.wing}` : 
                          <span className="text-slate-300">N/A</span>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
 