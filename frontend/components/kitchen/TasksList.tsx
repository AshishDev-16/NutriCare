"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TasksTable } from "@/components/kitchen/TasksTable"
import { AddTaskDialog } from "@/components/kitchen/AddTaskDialog"

export function TasksList() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Kitchen Tasks</h3>
          <p className="text-sm text-muted-foreground">
            Manage and assign kitchen preparation tasks
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
      <TasksTable />
      <AddTaskDialog open={open} onOpenChange={setOpen} />
    </div>
  )
} 