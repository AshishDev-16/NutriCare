"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { usePatients } from "@/hooks/usePatients"
import { Patient, updatePatient } from "@/lib/api/patients"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(0, "Age must be a positive number"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  roomNumber: z.string().min(1, "Room number is required"),
  bedNumber: z.string().min(1, "Bed number is required"),
  floorNumber: z.string().min(1, "Floor number is required"),
  diseases: z.string(),
  allergies: z.string(),
  contactNumber: z.string().min(10, "Contact number must be at least 10 characters"),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactRelation: z.string().min(2, "Relation is required"),
  emergencyContactPhone: z.string().min(10, "Emergency contact number must be at least 10 characters"),
})

interface EditPatientDialogProps {
  patient: Patient | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPatientDialog({ patient, open, onOpenChange }: EditPatientDialogProps) {
  const { toast } = useToast()
  const { mutate } = usePatients()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 0,
      gender: undefined as "male" | "female" | "other" | undefined,
      roomNumber: "",
      bedNumber: "",
      floorNumber: "",
      diseases: "",
      allergies: "",
      contactNumber: "",
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactPhone: "",
    },
  })

  useEffect(() => {
    if (patient) {
      form.reset({
        name: patient.name,
        age: patient.age,
        gender: patient.gender as "male" | "female" | "other",
        roomNumber: patient.roomNumber,
        bedNumber: patient.bedNumber,
        floorNumber: patient.floorNumber,
        diseases: patient.diseases.join(", "),
        allergies: patient.allergies.join(", "),
        contactNumber: patient.contactNumber,
        emergencyContactName: patient.emergencyContact.name,
        emergencyContactRelation: patient.emergencyContact.relation,
        emergencyContactPhone: patient.emergencyContact.phone,
      })
    }
  }, [patient, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!patient?._id) return

    try {
      const patientData = {
        name: values.name,
        age: values.age,
        gender: values.gender,
        roomNumber: values.roomNumber,
        bedNumber: values.bedNumber,
        floorNumber: values.floorNumber,
        diseases: values.diseases.split(',').map(d => d.trim()).filter(Boolean),
        allergies: values.allergies.split(',').map(a => a.trim()).filter(Boolean),
        contactNumber: values.contactNumber,
        emergencyContact: {
          name: values.emergencyContactName,
          relation: values.emergencyContactRelation,
          phone: values.emergencyContactPhone,
        },
      }

      await updatePatient(patient._id, patientData)
      
      toast({
        title: "Success",
        description: "Patient updated successfully",
      })
      
      mutate() // Refresh the patients list
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating patient:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update patient",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
          <DialogDescription>
            Update the patient's details below
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Patient name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Input placeholder="Gender" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Room number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bedNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Bed number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="floorNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Floor number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diseases"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diseases</FormLabel>
                    <FormControl>
                      <Input placeholder="Comma separated diseases" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Input placeholder="Comma separated allergies" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Emergency contact name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactRelation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Relation</FormLabel>
                    <FormControl>
                      <Input placeholder="Relation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Emergency contact number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update Patient
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 