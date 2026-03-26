"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Utensils,
  ClipboardList,
  TruckIcon,
  Settings,
  X,
  LucideIcon,
  Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

interface DashboardSidebarProps {
  open: boolean
  onClose: () => void
}

export default function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const pathname = usePathname()

  const managerLinks = [
    { title: "Overview", href: "/manager", icon: LayoutDashboard },
    { title: "Patients", href: "/manager/patients", icon: Users },
    { title: "Diet Charts", href: "/manager/diet-charts", icon: ClipboardList },
    { title: "Kitchen", href: "/manager/kitchen", icon: Utensils },
    { title: "Deliveries", href: "/manager/deliveries", icon: TruckIcon },
    { title: "Settings", href: "/manager/settings", icon: Settings }
  ]

  const pantryLinks = [
    { title: "Pantry Overview", href: "/pantry", icon: LayoutDashboard },
    { title: "Preparation Tasks", href: "/pantry?tab=preparation", icon: Utensils },
    { title: "Delivery Tasks", href: "/pantry?tab=delivery", icon: TruckIcon },
    { title: "Settings", href: "/pantry/settings", icon: Settings }
  ]

  const { user } = useAuth()
  const links = user?.role === 'manager' ? managerLinks : pantryLinks

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden",
          open ? "block" : "hidden"
        )}
        onClick={onClose}
      />
      
      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
          "transition-transform duration-200"
        )}
      >
        <SidebarContent links={links} onClose={onClose} pathname={pathname} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-full h-full bg-background border-r">
        <SidebarContent links={links} onClose={onClose} pathname={pathname} />
      </div>
    </>
  )
}

// Extracted sidebar content to avoid duplication
function SidebarContent({ 
  links, 
  onClose, 
  pathname 
}: { 
  links: Array<{
    title: string
    href: string
    icon: LucideIcon
  }>, 
  onClose: () => void, 
  pathname: string 
}) {
  return (
    <div className="flex flex-col w-full p-6 h-full bg-white dark:bg-[#0d1c2e] border-r border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#004532] to-[#065f46] rounded-xl flex items-center justify-center shadow-lg shadow-[#065f46]/20 group-hover:scale-110 transition-transform">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-[#004532] dark:text-emerald-400">VitalFlow</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
          <X className="h-6 w-6" />
        </Button>
      </div>
      <nav className="space-y-1.5 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-[#065f46] text-white shadow-lg shadow-[#065f46]/20 translate-x-1"
                  : "text-slate-500 hover:text-[#065f46] hover:bg-emerald-50 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/20"
              )}
            >
              <link.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
              {link.title}
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">System Status</p>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Operational
          </div>
        </div>
      </div>
    </div>
  )
} 