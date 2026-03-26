"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DietChartsTable } from "./DietChartsTable"
import { AddDietChartDialog } from "./AddDietChartDialog"

import { motion } from "framer-motion"

export function DietChartsContent() {
  const [open, setOpen] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-extrabold tracking-tight text-[#004532]">Dietary Protocols</h2>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Precision Nutrition Planning & Monitoring
          </p>
        </div>
        <Button 
          onClick={() => setOpen(true)}
          className="h-12 px-6 bg-[#065f46] hover:bg-[#064e3b] text-white font-bold rounded-xl shadow-lg shadow-[#065f46]/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create New Protocol
        </Button>
      </div>

      <div className="p-1 rounded-[2.5rem] bg-gradient-to-b from-slate-200/50 to-transparent">
        <div className="bg-white dark:bg-[#0d1c2e] rounded-[2.4rem] overflow-hidden shadow-xl border border-white/20">
          <DietChartsTable />
        </div>
      </div>

      <AddDietChartDialog open={open} onOpenChange={setOpen} />
    </motion.div>
  )
}