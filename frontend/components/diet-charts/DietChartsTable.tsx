"use client"

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
import { MoreHorizontal, Pencil, Trash, Eye } from "lucide-react"
import { useDietCharts } from "@/hooks/useDietCharts"
import { format } from "date-fns"
import { DietChart } from "@/lib/api/diet-charts"

export function DietChartsTable() {
  const { dietCharts, isLoading } = useDietCharts()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Morning Meals</TableHead>
            <TableHead>Evening Meals</TableHead>
            <TableHead>Dietary Restrictions</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!dietCharts || dietCharts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No diet charts found.
              </TableCell>
            </TableRow>
          ) : (
            dietCharts.map((chart: DietChart) => (
              <TableRow key={chart._id}>
                <TableCell>
                  <div className="font-medium">{chart.patient?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Room {chart.patient?.roomNumber}-{chart.patient?.bedNumber}
                  </div>
                </TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {chart.meals?.morning?.items?.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item.name} - {item.quantity}
                      </li>
                    ))}
                  </ul>
                  {chart.meals?.morning?.specialInstructions && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: {chart.meals.morning.specialInstructions}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {chart.meals?.evening?.items?.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item.name} - {item.quantity}
                      </li>
                    ))}
                  </ul>
                  {chart.meals?.evening?.specialInstructions && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: {chart.meals.evening.specialInstructions}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {chart.dietaryRestrictions?.map((restriction: string, index: number) => (
                      <li key={index} className="text-sm">
                        {restriction}
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>{format(new Date(chart.startDate), 'PPP')}</TableCell>
                <TableCell>{format(new Date(chart.endDate), 'PPP')}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          // Handle view details
                        }}
                        className="cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          // Handle edit
                        }}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600"
                        onClick={() => {
                          // Handle delete
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
} 