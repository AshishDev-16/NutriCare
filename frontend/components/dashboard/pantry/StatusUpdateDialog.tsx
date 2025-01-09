"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { updateTaskStatus } from "@/lib/api/pantry"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface StatusUpdateDialogProps {
  taskId: string
  onStatusUpdate: () => void
  trigger?: React.ReactNode
}

export function StatusUpdateDialog({ 
  taskId, 
  onStatusUpdate,
  trigger 
}: StatusUpdateDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusUpdate = async (status: 'in_progress' | 'completed' | 'delayed') => {
    try {
      setIsLoading(true)
      await updateTaskStatus(taskId, status)
      toast({
        title: "Status updated",
        description: `Task status updated to ${status}`
      })
      onStatusUpdate()
      setIsOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task status"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm">Update Status</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Task Status</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={() => handleStatusUpdate('in_progress')}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Mark as In Progress
          </Button>
          <Button
            onClick={() => handleStatusUpdate('completed')}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Mark as Completed
          </Button>
          <Button
            onClick={() => handleStatusUpdate('delayed')}
            disabled={isLoading}
            variant="outline"
            className="text-red-500 hover:text-red-600"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Mark as Delayed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 