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
import { formatDate } from "@/lib/utils"

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <TaskFilters 
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onTypeChange={setTypeFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks?.map((task) => (
              <TableRow key={task._id}>
                <TableCell>{task.description}</TableCell>
                <TableCell className="capitalize">{task.type}</TableCell>
                <TableCell>
                  <Badge variant={
                    task.status === 'pending' ? 'default' :
                    task.status === 'in_progress' ? 'secondary' :
                    task.status === 'completed' ? 'secondary' :
                    'destructive'
                  } className={`capitalize ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                    ''
                  }`}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      task.priority === 'high' ? 'destructive' : 
                      task.priority === 'medium' ? 'default' : 
                      'secondary'
                    }
                  >
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>{task.assignedTo?.name}</TableCell>
                <TableCell>{task.dueDate ? formatDate(task.dueDate) : 'No date set'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 