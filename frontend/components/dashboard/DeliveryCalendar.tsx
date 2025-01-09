"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import useSWR from "swr"
import { getDeliverySchedule } from "@/lib/api/dashboard"

interface DeliveryEvent {
  id: string
  patientName: string
  roomNumber: string
  mealType: 'breakfast' | 'lunch' | 'dinner'
  time: string
  status: 'pending' | 'in_progress' | 'completed'
}

interface DeliveryCalendarProps {
  isLoading: boolean
}

export function DeliveryCalendar({ isLoading }: DeliveryCalendarProps) {
  const [date, setDate] = useState<Date>(new Date())
  const { data: events = [] } = useSWR(
    [`/api/v1/dashboard/schedule`, format(date, 'yyyy-MM-dd')],
    () => getDeliverySchedule(format(date, 'yyyy-MM-dd'))
  )

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
            className="rounded-md border"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            Scheduled Deliveries for {format(date, "MMMM d, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[350px]">
            {events.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No deliveries scheduled for this date
              </p>
            ) : (
              <div className="space-y-4">
                {events.map((event: DeliveryEvent) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{event.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        Room {event.roomNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium capitalize">{event.mealType}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(`2000-01-01 ${event.time}`), "h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
} 