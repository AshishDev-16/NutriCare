"use client"

import { useState, useEffect } from "react"
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
import { PantryStaff, updatePantryStaff } from "@/lib/api/pantry"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 characters"),
  floor: z.string().min(1, "Floor is required"),
  wing: z.string().min(1, "Wing is required"),
  email: z.string().email("Invalid email address"),
})

interface EditPantryStaffDialogProps {
  staff: PantryStaff | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPantryStaffDialog({ staff, open, onOpenChange }: EditPantryStaffDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { mutate } = usePantryStaff()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: staff?.name || '',
      email: staff?.email || '',
      contactNumber: staff?.contactNumber || '',
      floor: staff?.location?.floor || '',
      wing: staff?.location?.wing || ''
    },
  })

  useEffect(() => {
    if (staff) {
      form.reset({
        name: staff.name,
        email: staff.email,
        contactNumber: staff.contactNumber,
        floor: staff.location.floor,
        wing: staff.location.wing,
      })
    }
  }, [staff, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!staff?._id) return

    try {
      setIsLoading(true)
      const updateData = {
        name: values.name,
        email: values.email,
        contactNumber: values.contactNumber,
        floor: values.floor,
        wing: values.wing
      };

      console.log('Sending update data:', updateData); // Debug log

      await updatePantryStaff(staff._id, updateData);

      toast({
        title: "Success",
        description: "Staff member updated successfully",
      })
      mutate()
      onOpenChange(false)
    } catch (error) {
      console.error('Update error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update staff member",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
          <DialogDescription>
            Update the details of the staff member
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
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Staff'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 