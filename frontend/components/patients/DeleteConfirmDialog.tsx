"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { deletePatient } from "@/lib/api/patients"
import { usePatients } from "@/hooks/usePatients"

interface DeleteConfirmDialogProps {
  patientId: string | undefined
  patientName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteConfirmDialog({
  patientId,
  patientName,
  open,
  onOpenChange,
}: DeleteConfirmDialogProps) {
  const { toast } = useToast()
  const { mutate } = usePatients()

  async function handleDelete() {
    if (!patientId) return

    try {
      await deletePatient(patientId)
      
      toast({
        title: "Success",
        description: "Patient deleted successfully",
      })
      
      mutate() // Refresh the patients list
    } catch (error) {
      console.error('Error deleting patient:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete patient",
      })
    } finally {
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-medium">{patientName}&apos;s</span> record
            and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 