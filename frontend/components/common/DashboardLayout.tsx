"use client"

import { useState } from "react"
import { DashboardNav } from "./DashboardNav"
import { SidebarNav } from "./SidebarNav"
import  DashboardSidebar  from "./DashboardSidebar"

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0">
        <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
          <SidebarNav />
        </DashboardSidebar>
      </div>
      
      <div className="flex-1 flex flex-col md:pl-64">
        <DashboardNav onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 