"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PantryStaffTable } from "./PantryStaffTable"
import { AddPantryStaffDialog } from "./AddPantryStaffDialog"

export function PantryStaff() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Pantry Staff</h3>
          <p className="text-sm text-muted-foreground">
            Manage pantry staff and their assignments
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>
      <PantryStaffTable />
      <AddPantryStaffDialog open={open} onOpenChange={setOpen} />
    </div>
  )
} 