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
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardSidebarProps {
  children: React.ReactNode
  open: boolean
  onClose: () => void
}

export default function DashboardSidebar({ children, open, onClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const role = "manager" // This should come from auth context

  const managerLinks = [
    {
      title: "Overview",
      href: "/manager",
      icon: LayoutDashboard
    },
    {
      title: "Patients",
      href: "/manager/patients",
      icon: Users
    },
    {
      title: "Diet Charts",
      href: "/manager/diet-charts",
      icon: ClipboardList
    },
    {
      title: "Kitchen",
      href: "/manager/kitchen",
      icon: Utensils
    },
    {
      title: "Deliveries",
      href: "/manager/deliveries",
      icon: TruckIcon
    },
    {
      title: "Settings",
      href: "/manager/settings",
      icon: Settings
    }
  ]

  const links = managerLinks // Since we're in manager dashboard

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
  links: any[], 
  onClose: () => void, 
  pathname: string 
}) {
  return (
    <div className="flex flex-col w-full p-6">
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold text-xl">NutriCare</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
          <X className="h-6 w-6" />
        </Button>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === link.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.title}
          </Link>
        ))}
      </nav>
    </div>
  )
} 