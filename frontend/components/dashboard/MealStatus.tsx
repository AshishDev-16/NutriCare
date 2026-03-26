"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import useSWR from "swr"
import { getMealStatus } from "@/lib/api/dashboard"
import { motion } from "framer-motion"
import { Coffee, Moon, User, MapPin } from "lucide-react"

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

const statusConfig = {
  pending: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Awaiting" },
  preparing: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "In Prep" },
  delivered: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Fulfilled" },
  none: { color: "bg-slate-100 text-slate-500 border-slate-200", label: "Not Scheduled" }
}

export function MealStatus({ isLoading }: MealStatusProps) {
  const { data: mealStatus = [] } = useSWR<MealStatusData[]>(
    '/api/v1/dashboard/meal-status',
    getMealStatus
  )

  if (isLoading) {
    return (
      <Card className="border-none bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Clinical Nutrition Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <Skeleton className="h-10 w-[200px]" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#065f46] rounded-full" />
              Patient Meal Monitoring
            </CardTitle>
            <CardDescription className="font-medium text-slate-500">Active distribution cycles for today</CardDescription>
          </div>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50">Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[450px] px-6">
          <div className="space-y-3 pb-6">
            {mealStatus.map((patient, idx) => (
              <motion.div
                key={patient.patientId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100/50 rounded-2xl transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{patient.patientName}</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      ROOM {patient.roomNumber}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Coffee className="h-3 w-3" /> Morning
                    </div>
                    <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight transition-all border ${statusConfig[patient.morningMeal.status].color}`}>
                      {statusConfig[patient.morningMeal.status].label}
                    </Badge>
                  </div>

                  <div className="w-px h-8 bg-slate-200" />

                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Moon className="h-3 w-3" /> Evening
                    </div>
                    <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight transition-all border ${statusConfig[patient.eveningMeal.status].color}`}>
                      {statusConfig[patient.eveningMeal.status].label}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 
 