"use client"

import { DashboardContent } from "@/components/dashboard/DashboardContent"

export default function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your hospital&apos;s nutrition management
        </p>
      </div>
      <DashboardContent />
    </div>
  )
} 