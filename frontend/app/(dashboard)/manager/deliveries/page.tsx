import { DeliveryContent } from "@/components/deliveries/DeliveryContent"
import { Separator } from "@/components/ui/separator"

export default function DeliveriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Delivery Tracking</h2>
        <p className="text-muted-foreground">
          Monitor and manage food deliveries in real-time
        </p>
      </div>
      <Separator />
      <DeliveryContent />
    </div>
  )
} 