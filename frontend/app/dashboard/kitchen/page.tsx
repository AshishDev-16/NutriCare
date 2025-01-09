import { KitchenOverview } from "@/components/kitchen/KitchenOverview"
import { TasksList } from "@/components/kitchen/TasksList"
import { Separator } from "@/components/ui/separator"

export default function KitchenPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Kitchen Management</h2>
        <p className="text-muted-foreground">
          Manage kitchen tasks and monitor diet chart preparation
        </p>
      </div>
      <Separator />
      <KitchenOverview />
      <Separator />
      <TasksList />
    </div>
  )
} 