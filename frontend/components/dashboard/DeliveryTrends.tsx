"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface DeliveryTrendsProps {
  data: {
    date: string
    deliveries: number
    onTime: number
    delayed: number
  }[]
  isLoading: boolean
}

export function DeliveryTrends({ data, isLoading }: DeliveryTrendsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delivery Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-sm text-muted-foreground"
              />
              <YAxis className="text-sm text-muted-foreground" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="deliveries"
                stroke="#2563eb"
                strokeWidth={2}
                name="Total Deliveries"
              />
              <Line
                type="monotone"
                dataKey="onTime"
                stroke="#16a34a"
                strokeWidth={2}
                name="On Time"
              />
              <Line
                type="monotone"
                dataKey="delayed"
                stroke="#dc2626"
                strokeWidth={2}
                name="Delayed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 