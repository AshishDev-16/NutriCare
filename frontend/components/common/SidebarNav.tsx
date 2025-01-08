"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { LayoutDashboard, Users, ClipboardList } from "lucide-react"

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
  }
]

export function SidebarNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)} {...props}>
      {managerLinks.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
              "justify-start"
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
} 