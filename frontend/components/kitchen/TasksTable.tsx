"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TaskFilters } from "./TaskFilters"
import { useTasks } from "@/hooks/useTasks"
import { formatDate, cn } from "@/lib/utils"

export function TasksTable() {
  const { tasks, isLoading } = useTasks()
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const filteredTasks = tasks?.filter(task => {
    const matchesType = typeFilter === 'all' || task.type === typeFilter
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    return matchesType && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6">
      <div className="flex px-6 pt-6 justify-end items-center">
        <TaskFilters 
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onTypeChange={setTypeFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
        />
      </div>

      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-transparent border-none">
              <TableHead className="py-5 pl-8 font-bold text-slate-900 dark:text-emerald-400">Task Description</TableHead>
              <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Type</TableHead>
              <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Status</TableHead>
              <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Priority</TableHead>
              <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Personnel</TableHead>
              <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks?.map((task) => (
              <TableRow 
                key={task._id}
                className="group border-b border-slate-100 dark:border-slate-800 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors"
              >
                <TableCell className="py-5 pl-8 font-semibold text-slate-700 dark:text-slate-300">{task.description}</TableCell>
                <TableCell className="py-5">
                  <span className="capitalize text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                    {task.type}
                  </span>
                </TableCell>
                <TableCell className="py-5">
                  <Badge 
                    variant="outline"
                    className={cn(
                      "capitalize px-3 py-1 rounded-full font-bold border-none shadow-sm",
                      task.status === 'completed' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      task.status === 'in_progress' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      task.status === 'pending' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}
                  >
                    {task.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="py-5">
                  <div className={cn(
                    "w-2 h-6 rounded-full",
                    task.priority === 'high' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" :
                    task.priority === 'medium' ? "bg-amber-500" :
                    "bg-slate-300"
                  )} title={`Priority: ${task.priority}`} />
                </TableCell>
                <TableCell className="py-5 font-medium text-slate-600 dark:text-slate-400">
                  {task.assignedTo?.name || "Unassigned"}
                </TableCell>
                <TableCell className="py-5 text-slate-500 font-medium whitespace-nowrap">
                  {task.dueDate ? formatDate(task.dueDate) : 'No deadline'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 