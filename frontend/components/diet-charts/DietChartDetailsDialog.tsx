"use client"

import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DietChart } from "@/lib/api/diet-charts"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DietChartDetailsDialogProps {
  dietChart: DietChart | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DietChartDetailsDialog({
  dietChart,
  open,
  onOpenChange,
}: DietChartDetailsDialogProps) {
  if (!dietChart) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Diet Chart Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          <div className="space-y-6">
            {/* Patient Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                  <span>Patient Information</span>
                  <Badge variant={dietChart.status === 'active' ? 'default' : 'secondary'}>
                    {dietChart.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-base">{dietChart.patient?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Room</p>
                  <p className="text-base">{`${dietChart.patient?.roomNumber || 'N/A'}-${dietChart.patient?.bedNumber || 'N/A'}`}</p>
                </div>
              </CardContent>
            </Card>

            {/* Morning Meals Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Morning Meals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dietChart.meals?.morning?.items?.map((item, index) => (
                  <div key={index} className="flex flex-col space-y-1 pb-3 last:pb-0 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.instructions && (
                          <p className="text-sm text-muted-foreground">
                            Instructions: {item.instructions}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline">{item.quantity}</Badge>
                    </div>
                  </div>
                ))}
                {dietChart.meals?.morning?.specialInstructions && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium text-muted-foreground">
                      Special Instructions:
                    </p>
                    <p className="text-sm">{dietChart.meals.morning.specialInstructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Evening Meals Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Evening Meals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dietChart.meals?.evening?.items?.map((item, index) => (
                  <div key={index} className="flex flex-col space-y-1 pb-3 last:pb-0 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.instructions && (
                          <p className="text-sm text-muted-foreground">
                            Instructions: {item.instructions}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline">{item.quantity}</Badge>
                    </div>
                  </div>
                ))}
                {dietChart.meals?.evening?.specialInstructions && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium text-muted-foreground">
                      Special Instructions:
                    </p>
                    <p className="text-sm">{dietChart.meals.evening.specialInstructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="text-sm">
                    {format(new Date(dietChart.startDate), "MMM d, yyyy")} - {format(new Date(dietChart.endDate), "MMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created By</p>
                  <p className="text-sm">{dietChart.createdBy?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p className="text-sm">{format(new Date(dietChart.createdAt), "PPP")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 