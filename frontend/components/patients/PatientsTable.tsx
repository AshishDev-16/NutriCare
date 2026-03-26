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
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-transparent border-none">
              <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Name</TableHead>
              <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Location (Room-Bed)</TableHead>
              <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Age</TableHead>
              <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Gender</TableHead>
              <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Clinical Conditions</TableHead>
              <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Contact</TableHead>
              <TableHead className="py-5 w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(patients) && patients.map((patient: Patient) => (
              <TableRow 
                key={patient._id || patient.id}
                className="group border-b border-slate-100 dark:border-slate-800 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors"
              >
                <TableCell className="py-4 font-semibold text-slate-700 dark:text-slate-300">{patient.name}</TableCell>
                <TableCell className="py-4 font-medium text-slate-500">{`${patient.roomNumber}-${patient.bedNumber}`}</TableCell>
                <TableCell className="py-4 text-slate-500 font-medium">{patient.age}</TableCell>
                <TableCell className="py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {patient.gender}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(patient.diseases) ? patient.diseases : [patient.diseases]).map((d, i) => (
                      <span key={i} className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
                        {d}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-slate-500 font-medium">{patient.contactNumber}</TableCell>
                <TableCell className="py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-white shadow-sm transition-all focus-visible:ring-emerald-500">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl p-1">
                      <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1.5">Operations</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPatient(patient)
                          setEditDialogOpen(true)
                        }}
                        className="cursor-pointer rounded-lg font-medium focus:bg-emerald-50 focus:text-emerald-600 dark:focus:bg-emerald-900/20"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Modify Record
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 rounded-lg font-medium focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-900/20"
                        onClick={() => {
                          setSelectedPatient(patient)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Terminate Entry
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