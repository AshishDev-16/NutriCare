"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useTasks } from "@/hooks/useTasks"
import { formatDate } from "@/lib/utils"

export function TasksTable() {
  const { tasks, isLoading } = useTasks()

  console.log('Tasks data:', tasks)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks?.map((task) => (
            <TableRow key={task._id}>
              <TableCell>
                <Badge variant={task.type === 'preparation' ? 'default' : 'outline'}>
                  {task.type === 'preparation' ? 'Preparation' : 'Delivery'}
                </Badge>
              </TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>
                {task.assignedTo?.name || 'Unassigned'}
              </TableCell>
              <TableCell>{formatDate(task.dueDate)}</TableCell>
              <TableCell>
                {task.type === 'delivery' && task.deliveryLocation ? (
                  `Floor ${task.deliveryLocation.floor}, ${task.deliveryLocation.wing} Wing${
                    task.deliveryLocation.roomNumber ? `, Room ${task.deliveryLocation.roomNumber}` : ''
                  }`
                ) : '-'}
              </TableCell>
              <TableCell>
                <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                  {task.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 