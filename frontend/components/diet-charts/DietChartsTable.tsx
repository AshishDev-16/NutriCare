"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, FileText, Pencil, Trash } from "lucide-react"
import { useDietCharts } from "@/hooks/useDietCharts"
import { DietChart } from "@/lib/api/diet-charts"
import { DietChartDetailsDialog } from "./DietChartDetailsDialog"
import { EditDietChartDialog } from "./EditDietChartDialog"
import { DeleteDietChartDialog } from "./DeleteDietChartDialog"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function DietChartsTable() {
  const { dietCharts, isLoading } = useDietCharts()
  const [selectedDietChart, setSelectedDietChart] = useState<DietChart | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Synchronizing Clinical Protocols...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-transparent border-none">
              <TableHead className="py-5 pl-8 font-bold text-slate-900 dark:text-emerald-400">Patient & Location</TableHead>
              <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Morning Protocol</TableHead>
              <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Evening Protocol</TableHead>
              <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Clinical Timeline</TableHead>
              <TableHead className="py-5 font-bold text-slate-900 dark:text-emerald-400">Status</TableHead>
              <TableHead className="py-5 w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dietCharts?.map((chart) => {
              return (
                <TableRow 
                  key={chart._id}
                  className="group border-b border-slate-100 dark:border-slate-800 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors"
                >
                  <TableCell className="py-6 pl-8">
                    <div className="font-bold text-slate-700 dark:text-slate-300">{chart.patient?.name || 'Unknown Patient'}</div>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 px-2 py-0.5 rounded inline-block mt-1">
                      UNIT {chart.patient?.roomNumber || '?'}-{chart.patient?.bedNumber || '?'}
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="space-y-1">
                      {chart.meals?.morning?.items?.map((item, index) => (
                        <div key={index} className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          {item.name} <span className="text-[10px] text-slate-400">({item.quantity})</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="space-y-1">
                      {chart.meals?.evening?.items?.map((item, index) => (
                        <div key={index} className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          {item.name} <span className="text-[10px] text-slate-400">({item.quantity})</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-6 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {chart.startDate ? format(new Date(chart.startDate), "MMM d") : 'Start?'} — {chart.endDate ? format(new Date(chart.endDate), "MMM d, yyyy") : 'End?'}
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge 
                      variant="outline"
                      className={cn(
                        "capitalize px-3 py-0.5 rounded-full font-bold border-none shadow-sm text-[10px]",
                        chart.status === 'active' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      )}
                    >
                      {chart.status || 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-white shadow-sm transition-all focus-visible:ring-emerald-500">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl p-1">
                        <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1.5 text-center">Protocol Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDietChart(chart)
                            setViewDialogOpen(true)
                          }}
                          className="cursor-pointer rounded-lg font-medium focus:bg-emerald-50 focus:text-emerald-600 dark:focus:bg-emerald-900/20"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Full Bio
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDietChart(chart)
                            setEditDialogOpen(true)
                          }}
                          className="cursor-pointer rounded-lg font-medium focus:bg-emerald-50 focus:text-emerald-600 dark:focus:bg-emerald-900/20"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Modify Protocol
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDietChart(chart)
                            setDeleteDialogOpen(true)
                          }}
                          className="cursor-pointer text-red-600 rounded-lg font-medium focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-900/20"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Retire Protocol
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <DietChartDetailsDialog
        dietChart={selectedDietChart}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <EditDietChartDialog
        dietChart={selectedDietChart}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <DeleteDietChartDialog
        dietChart={selectedDietChart}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  )
} 