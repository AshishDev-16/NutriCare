import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserNav } from "./UserNav"
import { NotificationPanel } from "@/components/notifications/NotificationPanel"
interface DashboardNavProps {
  onMenuClick: () => void
}

export function DashboardNav({ onMenuClick }: DashboardNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <NotificationPanel />
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        <UserNav />
      </div>
    </header>
  )
} 