"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, CheckCircle2, AlertCircle, ChefHat } from "lucide-react"
import useSWR from "swr"
import { getAllPantryTasks, type Task } from "@/lib/api/pantry"

export function Overview() {
  const { data: tasks, isLoading } = useSWR<Task[]>(
    ['pantry-tasks', 'all'],
    getAllPantryTasks,
    { revalidateOnFocus: false }
  )

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-[150px]" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[100px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const pendingTasks = tasks?.filter(task => task.status === 'pending').length || 0
  const inProgressTasks = tasks?.filter(task => task.status === 'in_progress').length || 0
  const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0
  const delayedTasks = tasks?.filter(task => task.status === 'delayed').length || 0

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="bg-yellow-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{pendingTasks}</div>
          <p className="text-xs text-muted-foreground">Tasks awaiting action</p>
        </CardContent>
      </Card>
      <Card className="bg-blue-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <ChefHat className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
          <p className="text-xs text-muted-foreground">Tasks currently being handled</p>
        </CardContent>
      </Card>
      <Card className="bg-green-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          <p className="text-xs text-muted-foreground">Tasks completed today</p>
        </CardContent>
      </Card>
      <Card className="bg-red-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delayed Tasks</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{delayedTasks}</div>
          <p className="text-xs text-muted-foreground">Tasks that need attention</p>
        </CardContent>
      </Card>
    </div>
  )
} 