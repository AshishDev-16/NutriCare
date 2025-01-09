import { Metadata } from "next"
import { PantryDashboard } from "@/components/dashboard/pantry/PantryDashboard"

export const metadata: Metadata = {
  title: "Pantry Dashboard",
  description: "Manage meal preparation tasks and kitchen operations",
}

export default function PantryPage() {
  return <PantryDashboard />
} 