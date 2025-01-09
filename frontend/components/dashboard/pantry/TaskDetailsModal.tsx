"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Info, AlertCircle, StickyNote } from "lucide-react"
import { type Task } from "@/lib/api/pantry"
import { StatusUpdateDialog } from "./StatusUpdateDialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDate } from "@/lib/utils"

interface TaskDetailsModalProps {
  task: Task
  onStatusUpdate: () => void
  trigger?: React.ReactNode
}

export function TaskDetailsModal({ task, onStatusUpdate, trigger }: TaskDetailsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Info className="h-4 w-4" />
            <span className="sr-only">View Details</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-6">
            {/* Task Description */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
              <p className="text-lg font-medium">{task.description}</p>
            </div>

            {/* Priority and Status */}
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Priority</h4>
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
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Status</h4>
                <Badge variant="outline" className="capitalize">
                  {task.status}
                </Badge>
              </div>
            </div>

            {/* Assignment and Schedule */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Assigned To</h4>
                <p className="flex items-center gap-2">
                  {task.assignedTo.name}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Scheduled For</h4>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {task.dueDate ? formatDate(task.dueDate) : 'No date set'}
                </p>
                <p className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4" />
                  {task.dueDate ? formatDate(task.dueDate) : 'No date set'}
                </p>
              </div>
            </div>

            {/* Additional Info for Delivery Tasks */}
            {task.type === 'delivery' && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Delivery Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Room</p>
                    <p className="font-medium">{task.roomNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Patient</p>
                    <p className="font-medium">{task.patientName || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Add Notes section before the Actions */}
            {task.notes && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <StickyNote className="h-4 w-4" />
                  Manager Notes
                </h4>
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{task.notes}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            {task.status !== 'completed' && (
              <div className="flex justify-end gap-2">
                <StatusUpdateDialog 
                  taskId={task._id}
                  onStatusUpdate={onStatusUpdate}
                  trigger={
                    <Button>
                      Update Status
                    </Button>
                  }
                />
              </div>
            )}

            {/* Notes or Warnings */}
            {task.status === 'delayed' && (
              <div className="flex items-start gap-2 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-500">Delayed Task</h4>
                  <p className="text-sm text-red-500">This task is behind schedule and needs immediate attention.</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 