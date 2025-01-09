"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { formatDate } from "@/lib/utils"

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
    return <div>Loading history...</div>
  }

  if (error) {
    return <div>Error loading history: {error.message}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completed Tasks History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Completed On</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks?.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task.description}</TableCell>
                  <TableCell className="capitalize">{task.type}</TableCell>
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
                  <TableCell>{formatDate(task.updatedAt)}</TableCell>
                  <TableCell>
                    {task.type === 'delivery' && task.deliveryLocation ? 
                      `Floor ${task.deliveryLocation.floor}, ${task.deliveryLocation.wing} Wing${
                        task.deliveryLocation.roomNumber ? `, Room ${task.deliveryLocation.roomNumber}` : ''
                      }` : '-'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 