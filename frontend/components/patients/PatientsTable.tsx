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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { usePatients } from "@/hooks/usePatients"
import { Patient } from "@/lib/api/patients"
import { EditPatientDialog } from "./EditPatientDialog"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"

export function PatientsTable() {
  const { patients, isLoading } = usePatients()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Diseases</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(patients) && patients.map((patient: Patient) => (
              <TableRow key={patient._id || patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{`${patient.roomNumber}-${patient.bedNumber}`}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{Array.isArray(patient.diseases) ? patient.diseases.join(", ") : patient.diseases}</TableCell>
                <TableCell>{patient.contactNumber}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPatient(patient)
                          setEditDialogOpen(true)
                        }}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600"
                        onClick={() => {
                          setSelectedPatient(patient)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EditPatientDialog 
        patient={selectedPatient}
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) setSelectedPatient(null)
        }}
      />
      <DeleteConfirmDialog
        patientId={selectedPatient?._id}
        patientName={selectedPatient?.name || ""}
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) setSelectedPatient(null)
        }}
      />
    </>
  )
} 