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

const statusIcons = {
  pending: Clock,
  in_progress: PlayCircle,
  completed: CheckCircle2,
  delayed: AlertCircle,
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  delayed: "bg-red-100 text-red-800",
}

export function DeliveryTasks() {
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const { data: tasks, error, isLoading, mutate } = useSWR<Task[]>(
    ['pantry-tasks', 'delivery'],
    () => getPantryTasks('delivery'),
    { revalidateOnFocus: false }
  )

  const filteredTasks = tasks?.filter(task => 
    priorityFilter === 'all' ? true : task.priority === priorityFilter
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Error loading tasks: {error.message}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Delivery Tasks</CardTitle>
            <Select
              value={priorityFilter}
              onValueChange={setPriorityFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {filteredTasks?.map((task) => {
                const StatusIcon = statusIcons[task.status]
                return (
                  <Card key={task._id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{task.description}</p>
                            <Badge 
                              variant={
                                task.priority === 'high' ? 'destructive' : 
                                task.priority === 'medium' ? 'default' : 
                                'secondary'
                              }
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <StatusIcon className="h-4 w-4" />
                            <span>Assigned to {task.assignedTo.name}</span>
                            <span>•</span>
                            <span>Due {task.dueDate ? formatDate(task.dueDate) : 'No date set'}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className={statusColors[task.status]}>
                            {task.status}
                          </Badge>
                          <TaskDetailsModal 
                            task={task}
                            onStatusUpdate={mutate}
                            trigger={
                              <Button variant="ghost" size="sm">
                                <Info className="h-4 w-4" />
                                <span className="sr-only">View Details</span>
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
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
} 