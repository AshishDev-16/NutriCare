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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { useDietCharts } from "@/hooks/useDietCharts"
import { DietChart } from "@/lib/api/diet-charts"
import { DietChartDetailsDialog } from "./DietChartDetailsDialog"
import { EditDietChartDialog } from "./EditDietChartDialog"
import { DeleteDietChartDialog } from "./DeleteDietChartDialog"

export function DietChartsTable() {
  const { dietCharts, isLoading } = useDietCharts()
  const [selectedDietChart, setSelectedDietChart] = useState<DietChart | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Morning Meals</TableHead>
            <TableHead>Evening Meals</TableHead>
            <TableHead>Instructions</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dietCharts?.map((chart) => {
            return (
              <TableRow key={chart._id}>
                <TableCell>
                  <div className="font-medium">{chart.patient?.name || 'N/A'}</div>
                  <div className="text-sm text-muted-foreground">
                    Room - {chart.patient?.roomNumber || 'N/A'}-{chart.patient?.bedNumber || 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {chart.meals?.morning?.items?.map((item, index) => (
                      <li key={index}>
                        {item.name} - {item.quantity}
                      </li>
                    ))}
                  </ul>
                  {chart.meals?.morning?.specialInstructions && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Note: {chart.meals.morning.specialInstructions}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {chart.meals?.evening?.items?.map((item, index) => (
                      <li key={index}>
                        {item.name} - {item.quantity}
                      </li>
                    ))}
                  </ul>
                  {chart.meals?.evening?.specialInstructions && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Note: {chart.meals.evening.specialInstructions}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    {chart.meals?.morning?.items?.map((item, index) => (
                      item.instructions && (
                        <div key={`morning-${index}`} className="text-sm text-muted-foreground">
                          • {item.instructions}
                        </div>
                      )
                    ))}
                    {chart.meals?.evening?.items?.map((item, index) => (
                      item.instructions && (
                        <div key={`evening-${index}`} className="text-sm text-muted-foreground">
                          • {item.instructions}
                        </div>
                      )
                    ))}
                    {(!chart.meals?.morning?.items?.some(item => item.instructions) && 
                      !chart.meals?.evening?.items?.some(item => item.instructions)) && (
                      <div className="text-sm text-muted-foreground">No instructions</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>{chart.startDate ? format(new Date(chart.startDate), "MMMM do, yyyy") : 'N/A'}</div>
                  <div>{chart.endDate ? format(new Date(chart.endDate), "MMMM do, yyyy") : 'N/A'}</div>
                </TableCell>
                <TableCell className="capitalize">{chart.status || 'N/A'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedDietChart(chart)
                          setViewDialogOpen(true)
                        }}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedDietChart(chart)
                          setEditDialogOpen(true)
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedDietChart(chart)
                          setDeleteDialogOpen(true)
                        }}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

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