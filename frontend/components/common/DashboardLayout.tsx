"use client"

import { useState } from "react"
import { DashboardNav } from "./DashboardNav"
import DashboardSidebar from "./DashboardSidebar"
import { SidebarNav } from "./SidebarNav"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0">
        <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="md:pl-64 flex-1">
        <DashboardNav onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-8 pt-6">
          {children}
        </main>
      </div>
    </div>
  )
} 