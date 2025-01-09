"use client"

import { Card } from "@/components/ui/card"
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
    return <div>Loading...</div>
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task._id}>
              <TableCell>{task.description}</TableCell>
              <TableCell>
                {`Floor ${task.deliveryLocation.floor}, ${task.deliveryLocation.wing} Wing${
                  task.deliveryLocation.roomNumber 
                    ? `, Room ${task.deliveryLocation.roomNumber}` 
                    : ''
                }`}
              </TableCell>
              <TableCell>{task.assignedTo?.name || 'Unassigned'}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    task.status === 'pending' ? 'default' :
                    task.status === 'in_progress' ? 'secondary' :
                    task.status === 'completed' ? 'secondary' :
                    'destructive'
                  }
                  className={`capitalize ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                    ''
                  }`}
                >
                  {task.status}
                  </Badge>
              </TableCell>
              <TableCell>{task.startTime ? format(new Date(task.startTime), 'PPp') : '-'}</TableCell>
              <TableCell>{task.completionTime ? format(new Date(task.completionTime), 'PPp') : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}