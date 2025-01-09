"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import useSWR from "swr"
import { getMealStatus } from "@/lib/api/dashboard"

interface MealStatusData {
  patientId: string
  patientName: string
  roomNumber: string
  morningMeal: {
    status: 'pending' | 'preparing' | 'delivered' | 'none'
    items: string[]
  }
  eveningMeal: {
    status: 'pending' | 'preparing' | 'delivered' | 'none'
    items: string[]
  }
}

interface MealStatusProps {
  isLoading: boolean
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  none: "bg-gray-100 text-gray-800"
}

export function MealStatus({ isLoading }: MealStatusProps) {
  const { data: mealStatus = [] } = useSWR<MealStatusData[]>(
    '/api/v1/dashboard/meal-status',
    getMealStatus
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patient Meal Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <Skeleton className="h-12 w-[200px]" />
                <div className="space-x-2">
                  <Skeleton className="h-6 w-20 inline-block" />
                  <Skeleton className="h-6 w-20 inline-block" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Meal Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {mealStatus.map((patient) => (
              <div
                key={patient.patientId}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{patient.patientName}</p>
                  <p className="text-sm text-muted-foreground">
                    Room {patient.roomNumber}
                  </p>
                </div>
                <div className="space-x-4">
                  <div className="inline-flex flex-col items-center gap-2">
                    <span className="text-sm text-muted-foreground">Morning</span>
                    <Badge variant="secondary" className={statusColors[patient.morningMeal.status]}>
                      {patient.morningMeal.status}
                    </Badge>
                  </div>
                  <div className="inline-flex flex-col items-center gap-2">
                    <span className="text-sm text-muted-foreground">Evening</span>
                    <Badge variant="secondary" className={statusColors[patient.eveningMeal.status]}>
                      {patient.eveningMeal.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 