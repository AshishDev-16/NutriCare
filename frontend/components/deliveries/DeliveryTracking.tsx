"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Task {
  _id: string
  description: string
  status: string
  assignedTo: {
    _id: string
    name: string
  }
  deliveryLocation: {
    floor: string
    wing: string
    roomNumber?: string
  }
  startTime?: string
  completionTime?: string
}

interface DeliveryTrackingProps {
  tasks: Task[]
  isLoading: boolean
}

export function DeliveryTracking({ tasks, isLoading }: DeliveryTrackingProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-transparent border-none">
            <TableHead className="py-5 pl-8 font-bold text-slate-900 dark:text-emerald-400">Operation</TableHead>
            <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Destination</TableHead>
            <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Personnel</TableHead>
            <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Status</TableHead>
            <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Dispatch</TableHead>
            <TableHead className="py-5 pr-8 font-bold text-slate-900 dark:text-emerald-400">Arrival</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow 
              key={task._id}
              className="group border-b border-slate-100 dark:border-slate-800 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors"
            >
              <TableCell className="py-5 pl-8 font-semibold text-slate-700 dark:text-slate-300">{task.description}</TableCell>
              <TableCell className="py-5">
                <div className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  {`UNIT ${task.deliveryLocation.floor}-${task.deliveryLocation.wing}`}
                </div>
                {task.deliveryLocation.roomNumber && (
                  <div className="text-[10px] text-slate-400 font-medium">Room {task.deliveryLocation.roomNumber}</div>
                )}
              </TableCell>
              <TableCell className="py-5 font-medium text-slate-500">{task.assignedTo?.name || 'Unassigned'}</TableCell>
              <TableCell className="py-5">
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize px-3 py-1 rounded-full font-bold border-none shadow-sm text-xs",
                    task.status === 'completed' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    task.status === 'in_progress' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  )}
                >
                  {task.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell className="py-5 text-slate-500 font-medium whitespace-nowrap text-xs">
                {task.startTime ? format(new Date(task.startTime), 'MMM d, HH:mm') : <span className="text-slate-300">—</span>}
              </TableCell>
              <TableCell className="py-5 pr-8 text-slate-500 font-medium whitespace-nowrap text-xs">
                {task.completionTime ? format(new Date(task.completionTime), 'MMM d, HH:mm') : <span className="text-slate-300">—</span>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}