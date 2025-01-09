"use client"

import { useState } from "react"
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
import { toast } from "@/hooks/use-toast"
import { usePantryStaff } from "@/hooks/usePantryStaff"
import { createPantryStaff } from "@/lib/api/pantry"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 characters"),
  floor: z.string().min(1, "Floor is required"),
  wing: z.string().min(1, "Wing is required"),
  email: z.string().email("Invalid email address"),
})

interface AddPantryStaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPantryStaffDialog({ open, onOpenChange }: AddPantryStaffDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = usePantryStaff()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contactNumber: "",
      floor: "",
      wing: "",
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      console.log('Submitting values:', values) // Debug log

      const staffData = {
        name: values.name,
        email: values.email,
        contactNumber: values.contactNumber,
        location: {
          floor: values.floor,
          wing: values.wing
        }
      }

      console.log('Staff data being sent:', staffData) // Debug log

      const result = await createPantryStaff(staffData)
      console.log('API Response:', result) // Debug log

      toast({
        title: "Success",
        description: "Staff member added successfully",
      })
      mutate()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('Error creating staff:', error) // Debug log
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add staff member",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Pantry Staff</DialogTitle>
          <DialogDescription>
            Enter the details of the new pantry staff member
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Staff name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email address" {...field} />
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor</FormLabel>
                    <FormControl>
                      <Input placeholder="Floor number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wing</FormLabel>
                    <FormControl>
                      <Input placeholder="Wing" {...field} />
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
              <Button type="submit" disabled={isLoading}>
                Add Staff
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 