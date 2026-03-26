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
  AreaChart,
  Area
} from "recharts"
import { motion } from "framer-motion"

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
      <Card className="border-none bg-white shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">Delivery Performance Logistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full rounded-2xl" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-none bg-white shadow-sm overflow-hidden group">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2 h-6 bg-[#065f46] rounded-full" />
            Operational Efficiency Trends
          </CardTitle>
          <p className="text-sm text-slate-400 font-medium">Monitoring clinical meal distribution across departments</p>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#065f46" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#065f46" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#bec9c2" opacity={0.2} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: '700' }}
                />
                <Area
                  type="monotone"
                  dataKey="deliveries"
                  stroke="#065f46"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorDeliveries)"
                  name="Total Orchestrated"
                />
                <Line
                  type="monotone"
                  dataKey="onTime"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="Clinical Compliance"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 