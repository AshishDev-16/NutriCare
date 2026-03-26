"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TasksTable } from "@/components/kitchen/TasksTable"
import { AddTaskDialog } from "@/components/kitchen/AddTaskDialog"

import { motion } from "framer-motion"

export function TasksList() {
  const [open, setOpen] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-3xl font-extrabold tracking-tight text-[#004532]">Kitchen Operations</h3>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Preparation & Delivery Orchestration
          </p>
        </div>
        <Button 
          onClick={() => setOpen(true)}
          className="h-12 px-6 bg-[#065f46] hover:bg-[#064e3b] text-white font-bold rounded-xl shadow-lg shadow-[#065f46]/20 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create New Task
        </Button>
      </div>

      <div className="p-1 rounded-[2.5rem] bg-gradient-to-b from-slate-200/50 to-transparent">
        <div className="bg-white dark:bg-[#0d1c2e] rounded-[2.4rem] overflow-hidden shadow-xl border border-white/20">
          <TasksTable />
        </div>
      </div>

      <AddTaskDialog open={open} onOpenChange={setOpen} />
    </motion.div>
  )
}