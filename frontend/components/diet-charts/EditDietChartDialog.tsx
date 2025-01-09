"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { DietChart } from "@/lib/api/diet-charts"
import { toast } from "@/hooks/use-toast"
import { useDietCharts } from "@/hooks/useDietCharts"
import { Loader2, Plus, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const mealItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.string().min(1, "Quantity is required"),
  instructions: z.string().optional(),
})

const formSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(["active", "completed", "cancelled"]),
  morningMeals: z.array(mealItemSchema).min(1, "At least one morning meal is required"),
  morningInstructions: z.string().optional(),
  eveningMeals: z.array(mealItemSchema).min(1, "At least one evening meal is required"),
  eveningInstructions: z.string().optional(),
})

interface EditDietChartDialogProps {
  dietChart: DietChart | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditDietChartDialog({
  dietChart,
  open,
  onOpenChange,
}: EditDietChartDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutate } = useDietCharts()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: dietChart ? new Date(dietChart.startDate) : new Date(),
      endDate: dietChart ? new Date(dietChart.endDate) : new Date(),
      status: dietChart?.status || "active",
      morningMeals: dietChart?.meals?.morning?.items?.map(item => ({
        name: item.name || '',
        quantity: item.quantity || '',
        instructions: item.instructions || ''
      })) || [],
      morningInstructions: dietChart?.meals?.morning?.specialInstructions || "",
      eveningMeals: dietChart?.meals?.evening?.items?.map(item => ({
        name: item.name || '',
        quantity: item.quantity || '',
        instructions: item.instructions || ''
      })) || [],
      eveningInstructions: dietChart?.meals?.evening?.specialInstructions || "",
    },
  })

  useEffect(() => {
    if (dietChart) {
      form.reset({
        startDate: new Date(dietChart.startDate),
        endDate: new Date(dietChart.endDate),
        status: dietChart.status,
        morningMeals: dietChart.meals?.morning?.items?.map(item => ({
          name: item.name || '',
          quantity: item.quantity || '',
          instructions: item.instructions || ''
        })) || [],
        morningInstructions: dietChart.meals?.morning?.specialInstructions || "",
        eveningMeals: dietChart.meals?.evening?.items?.map(item => ({
          name: item.name || '',
          quantity: item.quantity || '',
          instructions: item.instructions || ''
        })) || [],
        eveningInstructions: dietChart.meals?.evening?.specialInstructions || "",
      })
    }
  }, [dietChart, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!dietChart?._id) return

    try {
      setIsSubmitting(true)
      console.log('Submitting values:', values)

      const updateData = {
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        status: values.status,
        meals: {
          morning: {
            items: values.morningMeals.map(item => ({
              name: item.name,
              quantity: item.quantity,
              instructions: item.instructions || ''
            })),
            specialInstructions: values.morningInstructions || ''
          },
          evening: {
            items: values.eveningMeals.map(item => ({
              name: item.name,
              quantity: item.quantity,
              instructions: item.instructions || ''
            })),
            specialInstructions: values.eveningInstructions || ''
          }
        }
      }

      console.log('Update payload:', updateData)

      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
      const response = await fetch(`${baseUrl}/api/v1/diet-charts/${dietChart._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updateData),
      })

      console.log('Response status:', response.status)
      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update diet chart')
      }

      toast({
        title: "Success",
        description: "Diet chart updated successfully",
      })

      mutate()
      onOpenChange(false)
    } catch (error) {
      console.error('Update error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update diet chart",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addMealItem = (type: 'morningMeals' | 'eveningMeals') => {
    const currentMeals = form.getValues(type)
    form.setValue(type, [...currentMeals, { name: '', quantity: '', instructions: '' }])
  }

  const removeMealItem = (type: 'morningMeals' | 'eveningMeals', index: number) => {
    const currentMeals = form.getValues(type)
    form.setValue(type, currentMeals.filter((_, i) => i !== index))
  }

  if (!dietChart) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        aria-describedby="edit-diet-chart-description"
      >
        <DialogHeader>
          <DialogTitle>Edit Diet Chart</DialogTitle>
          <p 
            id="edit-diet-chart-description" 
            className="text-sm text-muted-foreground"
          >
            Make changes to the diet chart for {dietChart?.patient?.name}
          </p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <DatePicker date={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <DatePicker date={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Morning Meals */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Morning Meals</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addMealItem('morningMeals')}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch('morningMeals')?.map((_, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <FormField
                      control={form.control}
                      name={`morningMeals.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`morningMeals.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`morningMeals.${index}.instructions`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Instructions</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-8"
                      onClick={() => removeMealItem('morningMeals', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <FormField
                  control={form.control}
                  name="morningInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Evening Meals */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Evening Meals</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addMealItem('eveningMeals')}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.watch('eveningMeals')?.map((_, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <FormField
                      control={form.control}
                      name={`eveningMeals.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`eveningMeals.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`eveningMeals.${index}.instructions`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Instructions</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-8"
                      onClick={() => removeMealItem('eveningMeals', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <FormField
                  control={form.control}
                  name="eveningInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Diet Chart'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 