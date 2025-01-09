"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Utensils, ClipboardList, Users, Plus } from "lucide-react"
import { useTasks } from "@/hooks/useTasks"
import { usePantryStaff } from "@/hooks/usePantryStaff"
import { useDietCharts } from "@/hooks/useDietCharts"
import { useState } from "react"
import { AddTaskDialog } from "./AddTaskDialog"

export function KitchenOverview() {
  const [openAddTask, setOpenAddTask] = useState(false)
  const { tasks } = useTasks()
  const { staff } = usePantryStaff()
  const { dietCharts } = useDietCharts()

  const activeDietCharts = dietCharts?.filter(chart => chart.status === 'active') || []
  const pendingTasks = tasks?.filter(task => task.status === 'pending') || []
  const inProgressTasks = tasks?.filter(task => task.status === 'in_progress') || []
  const availableStaff = staff?.filter(member => member.status === 'available') || []
  const busyStaff = staff?.filter(member => member.status === 'busy') || []

  const stats = [
    {
      title: "Active Diet Charts",
      value: activeDietCharts.length,
      description: "Currently active diet charts",
      icon: Utensils,
      breakdown: [
        { label: "Morning Meals", value: activeDietCharts.filter(c => c.meals?.morning?.items?.length).length },
        { label: "Evening Meals", value: activeDietCharts.filter(c => c.meals?.evening?.items?.length).length }
      ]
    },
    {
      title: "Kitchen Tasks",
      value: tasks?.length || 0,
      description: "Total tasks in the system",
      icon: ClipboardList,
      breakdown: [
        { label: "Pending", value: pendingTasks.length },
        { label: "In Progress", value: inProgressTasks.length }
      ],
      action: {
        label: "Add Task",
        onClick: () => setOpenAddTask(true)
      }
    },
    {
      title: "Pantry Staff",
      value: staff?.length || 0,
      description: "Total staff members",
      icon: Users,
      breakdown: [
        { label: "Available", value: availableStaff.length },
        { label: "Busy", value: busyStaff.length }
      ]
    }
  ]

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mb-4">
                {stat.description}
              </p>
              {/* Detailed Breakdown */}
              <div className="space-y-2">
                {stat.breakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
              {/* Quick Action Button */}
              {stat.action && (
                <Button 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={stat.action.onClick}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {stat.action.label}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <AddTaskDialog open={openAddTask} onOpenChange={setOpenAddTask} />
    </>
  )
} 