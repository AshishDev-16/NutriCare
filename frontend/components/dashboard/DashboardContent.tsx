"use client"

import { Users, ClipboardList, UtensilsCrossed, Truck, Calendar, CheckCircle } from "lucide-react"
import { useDashboard } from "@/hooks/useDashboard"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { StatsCard } from "./StatsCard"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function DashboardContent() {
  const { stats, isLoading, error, mutate } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="text-muted-foreground">Loading dashboard data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-24 space-y-4">
        <div className="text-red-500">
          Failed to load dashboard: {error}
        </div>
        <Button onClick={() => mutate()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Patients"
          value={stats?.totalPatients || 0}
          description="Currently admitted patients"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Active Diet Charts"
          value={stats?.activeDietCharts || 0}
          description="Ongoing diet plans"
          icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Completed Tasks"
          value={stats?.completedTasks || 0}
          description={`${stats?.todaysCompletedTasks || 0} completed today`}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          tooltip="Total number of completed tasks"
        />
        <StatsCard
          title="Pending Deliveries"
          value={stats?.pendingDeliveries || 0}
          description="Meals ready for delivery"
          icon={<Truck className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Recent Diet Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Diet Charts</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentDietCharts?.length ? (
              <div className="space-y-4">
                {stats.recentDietCharts.map((chart) => (
                  <div key={chart._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{chart.patient?.name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">
                        Room {chart.patient?.roomNumber || 'N/A'}-{chart.patient?.bedNumber || 'N/A'}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(chart.startDate), "MMM d")} - {format(new Date(chart.endDate), "MMM d")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent diet charts</p>
            )}
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Morning Meals</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.todaysMorningMeals || 0} meals to be prepared
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Evening Meals</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.todayEveningMeals || 0} meals to be prepared
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 