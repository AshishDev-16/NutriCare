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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { usePatients } from "@/hooks/usePatients"
import { Patient } from "@/lib/api/patients"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { createDietChart } from "@/lib/api/diet-charts"
import { useDietCharts } from "@/hooks/useDietCharts"

const formSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  meals: z.object({
    morning: z.object({
      items: z.array(z.object({
        name: z.string().min(1, "Item name is required"),
        quantity: z.string().min(1, "Quantity is required"),
        instructions: z.string().optional(),
      })),
      specialInstructions: z.string().optional(),
    }),
    evening: z.object({
      items: z.array(z.object({
        name: z.string().min(1, "Item name is required"),
        quantity: z.string().min(1, "Quantity is required"),
        instructions: z.string().optional(),
      })),
      specialInstructions: z.string().optional(),
    }),
  }),
  dietaryRestrictions: z.array(z.string()),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
})

interface AddDietChartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddDietChartDialog({ open, onOpenChange }: AddDietChartDialogProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const { toast } = useToast()
  const { patients } = usePatients()
  const { mutate } = useDietCharts()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      meals: {
        morning: {
          items: [{ name: "", quantity: "", instructions: "" }],
          specialInstructions: "",
        },
        evening: {
          items: [{ name: "", quantity: "", instructions: "" }],
          specialInstructions: "",
        },
      },
      dietaryRestrictions: [],
      startDate: "",
      endDate: "",
    },
  })

  // Watch for patient selection changes
  const patientId = form.watch("patientId")
  
  // Update selected patient when patientId changes
  useEffect(() => {
    if (patientId) {
      const patient = patients?.find((p: Patient) => p._id === patientId)
      setSelectedPatient(patient || null)
    }
  }, [patientId, patients])

  // Helper function to add meal items
  const addMealItem = (mealTime: 'morning' | 'evening') => {
    const currentItems = form.getValues(`meals.${mealTime}.items`)
    form.setValue(`meals.${mealTime}.items`, [
      ...currentItems,
      { name: "", quantity: "", instructions: "" }
    ])
  }

  // Helper function to remove meal items
  const removeMealItem = (mealTime: 'morning' | 'evening', index: number) => {
    const currentItems = form.getValues(`meals.${mealTime}.items`)
    form.setValue(
      `meals.${mealTime}.items`,
      currentItems.filter((_, i) => i !== index)
    )
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      await createDietChart({
        patient: {
          _id: values.patientId,
          name: selectedPatient?.name || '',
          roomNumber: selectedPatient?.roomNumber || '',
          bedNumber: selectedPatient?.bedNumber || ''
        },
        meals: values.meals,
        dietaryRestrictions: values.dietaryRestrictions,
        startDate: values.startDate,
        endDate: values.endDate,
        status: 'active'
      })
      
      mutate()
      toast({
        title: "Success",
        description: "Diet chart created successfully",
      })
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('Error creating diet chart:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create diet chart",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
          <DialogTitle>Create Diet Chart</DialogTitle>
          <DialogDescription>
            Select a patient and create their diet chart
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Patient</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients?.map((patient: Patient) => (
                        <SelectItem key={patient._id} value={patient._id || ""}>
                          <div className="flex flex-col">
                            <span className="font-medium">{patient.name}</span>
                            <span className="text-sm text-muted-foreground">
                              Room {patient.roomNumber}-{patient.bedNumber}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedPatient && (
              <>
                <div className="rounded-md border p-4 space-y-4">
                  <h4 className="font-medium">Patient Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium">Diseases</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {selectedPatient.diseases.map((disease, index) => (
                          <li key={index}>{disease}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium">Allergies</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {selectedPatient.allergies.map((allergy, index) => (
                          <li key={index}>{allergy}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Morning Meals</h4>
                    {form.watch('meals.morning.items').map((_, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`meals.morning.items.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Item Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Oatmeal" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`meals.morning.items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 1 bowl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`meals.morning.items.${index}.instructions`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Instructions</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., No sugar" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeMealItem('morning', index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addMealItem('morning')}
                    >
                      Add Morning Item
                    </Button>
                    <FormField
                      control={form.control}
                      name="meals.morning.specialInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Instructions</FormLabel>
                          <FormControl>
                            <Input placeholder="Any special instructions for morning meals" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Evening Meals</h4>
                    {form.watch('meals.evening.items').map((_, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`meals.evening.items.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Item Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Oatmeal" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`meals.evening.items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 1 bowl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`meals.evening.items.${index}.instructions`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Instructions</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., No sugar" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeMealItem('evening', index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addMealItem('evening')}
                    >
                      Add Evening Item
                    </Button>
                    <FormField
                      control={form.control}
                      name="meals.evening.specialInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Instructions</FormLabel>
                          <FormControl>
                            <Input placeholder="Any special instructions for evening meals" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(new Date(field.value), "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) => field.onChange(date?.toISOString() ?? "")}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(new Date(field.value), "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) => field.onChange(date?.toISOString() ?? "")}
                                  disabled={(date) => {
                                    const startDate = form.getValues("startDate");
                                    return startDate ? date < new Date(startDate) : date < new Date();
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
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
                    {isLoading ? "Adding..." : "Add Diet Chart"}
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}