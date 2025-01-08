"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PatientsTable } from "@/components/patients/PatientsTable"
import { AddPatientDialog } from "@/components/patients/AddPatientDialog"
import { useToast } from "@/hooks/use-toast"

export function PatientsContent() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>
      <PatientsTable />
      <AddPatientDialog open={open} onOpenChange={setOpen} />
    </div>
  )
} 